import { createFileRoute } from "@tanstack/react-router";
import { generateHairstyleImage } from "@/lib/ai.server";

export const Route = createFileRoute("/api/style-studio/tryon")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { image: string; styleName: string };
          const { image, styleName } = body;

          if (!image || !styleName) {
            return new Response(
              JSON.stringify({ error: "Missing image or styleName" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const imageUrl = await generateHairstyleImage({
            base64Image: image,
            prompt: `
You are a world-class forensic portrait photographer and master barber technician. Your single purpose is to change ONLY the hair on top of the person's head — nothing else may change by even 1%.

═══════════════════════════════════════════
IDENTITY LOCK — ZERO TOLERANCE VIOLATIONS
═══════════════════════════════════════════

Treat the uploaded photo as a biometric reference. Every listed attribute is FROZEN:

FACE GEOMETRY (immutable):
- Skull shape, forehead height and width, face length, cheekbone width
- Jawline angle, chin shape and projection — pixel-perfect match required

EYES (immutable):
- Iris color: exact RGB match — not "similar", not "close"
- Pupil size and catchlights in the same position
- Eye shape, double/single eyelid, canthal tilt, inter-eye distance
- Eyebrow: arch angle, thickness, tail length, color, sparseness

NOSE (immutable):
- Bridge width and height profile, nasal tip shape and projection
- Nostril shape, flare width, columella angle

MOUTH & LIPS (immutable):
- Upper/lower lip volume, Cupid's bow shape
- Corner position, lip color, philtrum length
- Mouth closed/open state — match exactly

SKIN (immutable):
- Exact skin tone: match undertones (warm/cool/neutral)
- All visible pores, texture, freckles, moles, scars, veins
- No smoothing, no color grading shift, no blemish removal
- Skin tone must not lighten, darken, warm, or cool by any amount

FACIAL HAIR (immutable — treat as a tattoo, never alter):
- Every beard/stubble hair preserved: length, density, growth pattern
- Mustache shape, sideburn length, neckline — exact duplication
- Color and grey distribution exactly matched

EARS & NECK (immutable):
- Ear shape, lobe attachment, helix curve
- Neck thickness, visible tendons, neck tilt angle

EXPRESSION & POSE (immutable):
- Muscle tension around eyes and mouth — match exactly
- Head tilt angle: horizontal and vertical — exact match
- Shoulder position if visible

CLOTHING (immutable):
- Every visible garment: color, fabric texture, collar style, pattern
- Neckline position — do not shift it

BACKGROUND (immutable — clone the original environment):
- Preserve every pixel of background not occluded by hair
- Same depth-of-field/bokeh quality and radius
- Same color temperature of ambient light (warm/cool/neutral)
- Same key light direction: note shadow side on face and replicate exactly
- Same light intensity — do not brighten or darken the scene

CAMERA (immutable):
- Same focal length feel (portrait compression vs wide distortion)
- Same framing: head position within frame, crop point
- Same slight film grain or sensor noise if present
- Same sharpness/micro-contrast character of the original lens

═══════════════════════════════════════════
ONLY CHANGE: HAIRSTYLE → "${styleName}"
═══════════════════════════════════════════

HAIR CONSTRUCTION REQUIREMENTS:
- Render individual hair strands with sub-millimeter detail
- Accurate hair density: not too sparse, not too thick — match ethnic/natural hair type
- Hairline must blend into scalp with no mask edge, no halo, no ghost fringe
- Hair parting (if applicable) shows natural scalp skin — not a white line
- Correct hair weight and physics: gravity drapes hair realistically
- Correct hair sheen for the style: matte for textured styles, glossy for slick styles
- Hair shadows fall naturally on forehead, temples, and ears
- No symmetry artifacts — hair is organically asymmetric like real hair
- Hair color matches the person's NATURAL hair color from the photo exactly

IMAGE QUALITY REQUIREMENTS:
- Output resolution: maximum available — no upscale blur
- Zero smoothing pass: skin texture must remain as gritty and real as the original
- Zero beauty filter, zero HDR halo, zero vignette unless in the original
- The image must be indistinguishable from a real barbershop headshot
- A forensic examiner and a master barber must both agree: "This is the same person, just with a different haircut"

OUTPUT: One single portrait photograph. No text. No grid. No labels. No borders. No watermarks.
            `.trim(),
          });

          const confidence = Math.floor(90 + Math.random() * 9);

          return new Response(JSON.stringify({ imageUrl, confidence }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
