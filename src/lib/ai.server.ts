/**
 * Server-only AI client with multi-provider cascade fallback.
 *
 * Provider order:
 * 1. OpenRouter (with built-in models array fallback)
 * 2. fal.ai (FLUX models)
 * 3. Replicate (Stable Diffusion / FLUX)
 *
 * Sends a user photo + prompt and returns the generated image
 * as a base64 data URL string.
 */

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

/**
 * Extract raw base64 data from a data URL: "data:image/jpeg;base64,xxxx" → "xxxx"
 */
function stripDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return { mimeType: "image/jpeg", data: dataUrl };
  return { mimeType: match[1], data: match[2] };
}

// ============================================================================
// PROVIDER 1: OpenRouter (with built-in model fallback)
// ============================================================================

interface OpenRouterContentBlock {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content?: OpenRouterContentBlock[] | string;
      images?: Array<{
        type?: "image_url";
        image_url?: { url?: string };
        imageUrl?: { url?: string };
      }>;
    };
  }>;
  error?: { message: string };
}

async function callOpenRouter(
  base64Image: string,
  prompt: string,
  model: string,
): Promise<string> {
  const apiKey1 = getEnv("OPENROUTER_API_KEY_1");
  const apiKey2 = getEnv("OPENROUTER_API_KEY_2");

  const body = {
    model,
    modalities: ["image", "text"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: base64Image } },
          { type: "text", text: prompt },
        ],
      },
    ],
  };

  // Try first key
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey1}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://barberflow-pos.local",
        "X-Title": "BarberFlow POS",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const json = (await res.json()) as OpenRouterResponse;

      if (json.error) {
        throw new Error(`OpenRouter error: ${json.error.message}`);
      }

      const message = json.choices?.[0]?.message;
      if (!message) throw new Error("No message in OpenRouter response");

      for (const image of message.images || []) {
        const imageUrl = image.image_url?.url || image.imageUrl?.url;
        if (imageUrl) return imageUrl;
      }

      const raw = message.content;
      if (!raw) throw new Error("No content or images in OpenRouter response");

      const blocks: OpenRouterContentBlock[] = Array.isArray(raw) ? raw : [{ type: "text", text: raw }];

      for (const block of blocks) {
        if (block.type === "image_url" && block.image_url?.url) {
          return block.image_url.url;
        }
      }

      throw new Error("No image block in OpenRouter response");
    }
  } catch (err1) {
    console.warn(`OpenRouter key 1 failed, trying key 2:`, err1);
  }

  // Try second key
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey2}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://barberflow-pos.local",
        "X-Title": "BarberFlow POS",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenRouter key 2 ${model} ${res.status}: ${text}`);
    }

    const json = (await res.json()) as OpenRouterResponse;

    if (json.error) {
      throw new Error(`OpenRouter error: ${json.error.message}`);
    }

    const message = json.choices?.[0]?.message;
    if (!message) throw new Error("No message in OpenRouter response");

    for (const image of message.images || []) {
      const imageUrl = image.image_url?.url || image.imageUrl?.url;
      if (imageUrl) return imageUrl;
    }

    const raw = message.content;
    if (!raw) throw new Error("No content or images in OpenRouter response");

    const blocks: OpenRouterContentBlock[] = Array.isArray(raw) ? raw : [{ type: "text", text: raw }];

    for (const block of blocks) {
      if (block.type === "image_url" && block.image_url?.url) {
        return block.image_url.url;
      }
    }

    throw new Error("No image block in OpenRouter response");
  } catch (err2) {
    throw new Error(`OpenRouter both keys failed: ${err2}`);
  }
}

// ============================================================================
// PROVIDER 2: fal.ai (FLUX models)
// ============================================================================

interface FalResponse {
  images: Array<{ url: string }>;
  error?: string;
}

async function callFal(
  base64Image: string,
  prompt: string,
): Promise<string> {
  const apiKey = getEnv("FAL_API_KEY");

  const { mimeType, data } = stripDataUrl(base64Image);

  const body = {
    prompt: prompt,
    image_url: `data:${mimeType};base64,${data}`,
    sync_mode: true,
  };

  const res = await fetch("https://queue.fal.run/fal-ai/ideogram/v3", {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fal.ai ${res.status}: ${text}`);
  }

  const json = (await res.json()) as FalResponse;

  if (json.error) {
    throw new Error(`fal.ai error: ${json.error}`);
  }

  if (!json.images || json.images.length === 0) {
    throw new Error("No images in fal.ai response");
  }

  // fal.ai returns URLs, fetch and convert to base64
  const imageUrl = json.images[0].url;
  const imgRes = await fetch(imageUrl);
  const imgBuffer = await imgRes.arrayBuffer();
  const base64 = Buffer.from(imgBuffer).toString("base64");
  const imgMimeType = imgRes.headers.get("content-type") || "image/png";

  return `data:${imgMimeType};base64,${base64}`;
}

// ============================================================================
// PROVIDER 3: Replicate (Stable Diffusion / FLUX)
// ============================================================================

interface ReplicateResponse {
  output: string[] | string;
  error?: string;
  status: string;
}

async function callReplicate(
  base64Image: string,
  prompt: string,
): Promise<string> {
  const apiKey = getEnv("REPLICATE_API_TOKEN");

  const { mimeType, data } = stripDataUrl(base64Image);

  // Create prediction
  const createRes = await fetch("https://api.replicate.com/v1/models/tencentarc/photomaker-style/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Prefer: "wait=60",
    },
    body: JSON.stringify({
      input: {
        prompt: prompt,
        input_image: `data:${mimeType};base64,${data}`,
        style_strength_ratio: 0.2, // Lower for better identity preservation
        num_inference_steps: 30,
      },
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`Replicate create ${createRes.status}: ${text}`);
  }

  const createJson = await createRes.json();
  const predictionId = createJson.id;

  // Poll for result
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!pollRes.ok) {
      const text = await pollRes.text();
      throw new Error(`Replicate poll ${pollRes.status}: ${text}`);
    }

    const pollJson = (await pollRes.json()) as ReplicateResponse;

    if (pollJson.status === "succeeded") {
      if (!pollJson.output || pollJson.output.length === 0) {
        throw new Error("No output in Replicate response");
      }

      const imageUrl = Array.isArray(pollJson.output) ? pollJson.output[0] : pollJson.output;
      const imgRes = await fetch(imageUrl);
      const imgBuffer = await imgRes.arrayBuffer();
      const base64 = Buffer.from(imgBuffer).toString("base64");
      const imgMimeType = imgRes.headers.get("content-type") || "image/png";

      return `data:${imgMimeType};base64,${base64}`;
    }

    if (pollJson.status === "failed") {
      throw new Error(`Replicate prediction failed: ${pollJson.error || "Unknown error"}`);
    }

    // Still processing, wait and retry
    await new Promise((resolve) => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error("Replicate prediction timed out");
}

// ============================================================================
// Main entry point with cascade fallback
// ============================================================================

export async function generateHairstyleImage(params: {
  base64Image: string;
  prompt: string;
}): Promise<string> {
  const { base64Image, prompt } = params;

  // Try OpenRouter primary model
  try {
    console.log("Trying OpenRouter (primary)...");
    return await callOpenRouter(base64Image, prompt, "google/gemini-3.1-flash-image-preview");
  } catch (openRouterErr) {
    console.warn("OpenRouter primary failed, trying fallback model:", openRouterErr);
  }

  // Try OpenRouter fallback model
  try {
    console.log("Trying OpenRouter (fallback)...");
    return await callOpenRouter(base64Image, prompt, "google/gemini-2.5-flash-image");
  } catch (openRouterErr2) {
    console.warn("OpenRouter fallback failed, trying fal.ai:", openRouterErr2);
  }

  // Fallback to fal.ai
  try {
    console.log("Trying fal.ai...");
    return await callFal(base64Image, prompt);
  } catch (falErr) {
    console.warn("fal.ai failed, trying Replicate:", falErr);
  }

  // Fallback to Replicate
  try {
    console.log("Trying Replicate...");
    return await callReplicate(base64Image, prompt);
  } catch (replicateErr) {
    console.error("Replicate also failed:", replicateErr);
    throw new Error("Generation failed — all providers returned no image");
  }
}
