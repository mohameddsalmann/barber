import { createFileRoute } from "@tanstack/react-router";
import { generateHairstyleImage } from "@/lib/ai.server";

export const Route = createFileRoute("/api/style-studio/discover")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { image: string };
          const { image } = body;

          if (!image) {
            return new Response(JSON.stringify({ error: "Missing image" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const imageUrl = await generateHairstyleImage({
            base64Image: image,
            prompt: `
You are a world-class forensic portrait photographer and master barber technician. Generate a 3×4 grid of 12 portrait panels. The ONLY difference between panels is the hairstyle. Every other visual attribute is frozen and identical across all 12 panels.

═══════════════════════════════════════════
IDENTITY LOCK — APPLIES TO ALL 12 PANELS
(Zero tolerance — any violation = failure)
═══════════════════════════════════════════

FACE GEOMETRY (frozen across all panels):
- Skull shape, forehead height/width, cheekbone width, jaw angle, chin shape

EYES (frozen):
- Iris color: exact RGB — not approximate
- Eye shape, eyelid type, canthal tilt, inter-eye distance
- Eyebrows: arch, thickness, tail, color, sparseness, exact position

NOSE (frozen):
- Bridge width/height, nasal tip projection and shape, nostril flare

MOUTH (frozen):
- Lip volume, Cupid's bow, corner position, lip color, open/closed state

SKIN (frozen):
- Exact skin tone with undertone — no shift across panels
- All pores, freckles, moles, scars duplicated identically
- Absolutely no smoothing, brightening, or color shift between panels

FACIAL HAIR (frozen — treat as permanent ink):
- Beard/stubble: every hair, density, pattern, color, grey distribution
- Preserved identically in all 12 panels without exception

EARS, NECK, SHOULDERS (frozen):
- Shape, tilt, clothing — pixel-level consistency across all panels

EXPRESSION (frozen):
- Same neutral expression with identical muscle tension in all 12 panels

POSE & FRAMING (frozen):
- Same head tilt, same camera distance, same crop, same centering

BACKGROUND (frozen — replicate original environment in all 12 panels):
- Same background, same bokeh, same light direction and color temperature
- Same key light shadow pattern on the face — consistent across all panels

═══════════════════════════════════════════
ONLY VARIABLE: HAIRSTYLE (one per panel)
═══════════════════════════════════════════

HAIR QUALITY RULES (all panels):
- Individual strands visible with realistic texture and weight
- Hairline blends into scalp — no mask edge, no halo artifact
- Hair color matches the person's natural hair color from the input photo
- Hair physics: gravity and weight behave realistically per style
- Natural asymmetry — no mirrored or templated hair placement
- Hair shadows fall on forehead, temples, and ears per style geometry

═══════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════

- Single image, portrait aspect ratio (taller than wide)
- Clean 3-column × 4-row grid = 12 equal panels
- Thin 2px dark separator lines between panels
- Style name label centered at bottom of each panel (small, legible font)
- Maximum resolution — each panel must be sharp and printable

PANELS (in order, left-to-right, top-to-bottom):
1.  Buzz Cut — uniform #1–2 guard all over, skin visible through hair on sides
2.  Low Taper Fade — gradual fade from skin at nape to short on sides, 2–3 inch length on top
3.  French Crop — blunt horizontal fringe at mid-forehead, tight skin taper on sides
4.  Textured Quiff — voluminous front swept upward, matte product texture, mid fade
5.  Slick Back — all hair combed straight back, wet high-shine pomade finish, no loose strands
6.  Curly Taper — natural coil/curl pattern preserved on top, clean low fade on sides
7.  Mid Fade + 360 Waves — brushed wave pattern on top, precise mid fade line
8.  Crew Cut — #3–4 on top uniform, slightly longer than buzz, neat taper on sides
9.  Pompadour — high front volume lift, sides slicked back, structured top
10. Modern Mullet — short tapered sides, disconnected longer textured back
11. Caesar Cut — horizontal fringe pushed forward, uniform 1-inch length overall
12. High Fade + Textured Top — skin fade up to temples, messy finger-combed top

IMAGE QUALITY (all panels):
- Studio barbershop photography quality — soft key light, subtle fill, slight rim on hair
- Skin pores visible in every panel — no smoothing between panels
- No beauty filter, no HDR bloom, no vignette unless in original photo
- Each panel must look like a real professional barbershop headshot
- A forensic examiner must confirm: "Same person, 12 different haircuts"
            `.trim(),
          });

          return new Response(JSON.stringify({ imageUrl }), {
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
