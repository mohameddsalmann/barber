# Image Generation Prompt Templates

This document contains all the AI prompt templates used for the Style Studio feature in BarberFlow POS.

## 📍 Location

The prompt templates are located in:
- **Try-On Mode**: `src/routes/api.style-studio.tryon.ts`
- **Discover Mode**: `src/routes/api.style-studio.discover.ts`
- **AI Implementation**: `src/lib/ai.server.ts`

---

## 🎨 Mode 1: Try-On Mode (Single Style Preview)

**File**: `src/routes/api.style-studio.tryon.ts`

**Purpose**: Apply a specific hairstyle to the user's photo while preserving their identity

**Prompt Template**:

```
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
```

**Variables**:
- `${styleName}` - The selected hairstyle name (e.g., "Buzz Cut", "Pompadour", "French Crop")

---

## 🔍 Mode 2: Discover Mode (12-Style Grid)

**File**: `src/routes/api.style-studio.discover.ts`

**Purpose**: Generate a 3x4 grid showing the user with 12 different hairstyles

**Prompt Template**:

```
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
```

**No variables** - This prompt is static and generates all 12 styles at once

---

## 🤖 AI Provider Configuration

**File**: `src/lib/ai.server.ts`

### Provider Cascade (Fallback Order)

The system tries providers in this order until one succeeds:

1. **OpenRouter** (Primary Model)
   - Model: `google/gemini-3.1-flash-image-preview`
   - Requires: `OPENROUTER_API_KEY_1` and `OPENROUTER_API_KEY_2`

2. **OpenRouter** (Fallback Model)
   - Model: `google/gemini-2.5-flash-image`
   - Uses same API keys as primary

3. **fal.ai** (FLUX Models)
   - Model: `fal-ai/ideogram/v3`
   - Requires: `FAL_API_KEY`

4. **Replicate** (Stable Diffusion / FLUX)
   - Model: `tencentarc/photomaker-style`
   - Requires: `REPLICATE_API_TOKEN`
   - Settings:
     - `style_strength_ratio: 0.2` (lower for better identity preservation)
     - `num_inference_steps: 30`

### Required Environment Variables

Create a `.env` file with:

```env
# OpenRouter (Primary provider)
OPENROUTER_API_KEY_1=sk-or-v1-xxxxx
OPENROUTER_API_KEY_2=sk-or-v1-xxxxx

# fal.ai (Fallback 1)
FAL_API_KEY=xxxxx

# Replicate (Fallback 2)
REPLICATE_API_TOKEN=r8_xxxxx
```

---

## 🎯 Key Prompt Engineering Principles

### 1. Identity Preservation
The prompts use an "IDENTITY LOCK" section that explicitly lists every facial feature that must remain unchanged:
- Face geometry and bone structure
- Eyes, nose, lips, ears
- Skin tone and texture
- Beard and facial hair
- Expression and pose
- Background and lighting
- Clothing

### 2. Photorealism Requirements
- Individual hair strands visible
- Natural scalp blending
- Realistic shadows and highlights
- No cartoon or AI-generated appearance
- Skin pores and texture preserved
- Professional barbershop photography quality

### 3. Output Specifications
- **Try-On Mode**: Single portrait image
- **Discover Mode**: 3x4 grid (12 panels) with labels
- High resolution
- No borders or extra elements

### 4. Hairstyle Catalog (Discover Mode)
The 12 hairstyles are carefully ordered to show variety:
1. Buzz Cut
2. Low Taper Fade
3. French Crop
4. Textured Quiff
5. Slick Back
6. Curly Taper
7. Mid Fade + Waves
8. Crew Cut
9. Pompadour
10. Modern Mullet
11. Caesar Cut
12. High Fade + Textured Top

---

## 🔧 How to Modify Prompts

### Adding a New Hairstyle to Try-On Mode

1. Add the style to `src/mock/data.ts`:
```typescript
export const styleOptions: StyleOption[] = [
  // ... existing styles
  {
    id: "new-style",
    name: "New Style Name",
    icon: "✂️",
    category: "Fades", // or "Crops", "Classic", etc.
  },
];
```

2. The prompt in `api.style-studio.tryon.ts` will automatically use the style name via `${styleName}`

### Modifying the Discover Mode Grid

1. Edit the "HAIRSTYLES" section in `src/routes/api.style-studio.discover.ts`
2. Change the number of styles (currently 12)
3. Update the grid layout description if needed (e.g., 2x6, 4x3)

### Adjusting Identity Preservation

To make the AI preserve identity more strictly:
- Add more specific details to the "IDENTITY LOCK" section
- Increase emphasis on specific features
- Add negative prompts (what NOT to change)

To allow more creative freedom:
- Reduce the "IDENTITY LOCK" constraints
- Focus only on core facial features
- Allow background/lighting variations

### Changing Photorealism Level

For more stylized results:
- Remove "individual hair strands" requirement
- Allow "artistic interpretation"
- Reduce emphasis on "professional photography"

For hyper-realistic results:
- Add "8K resolution" requirement
- Specify "macro lens detail"
- Add "studio lighting setup" details

---

## 📊 Response Format

### Try-On Mode Response
```json
{
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "confidence": 94
}
```

### Discover Mode Response
```json
{
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

Both return base64-encoded images that can be directly displayed in `<img>` tags.

---

## 🐛 Troubleshooting

### Issue: Generated images don't preserve identity
**Solution**: Strengthen the "IDENTITY LOCK" section with more specific constraints

### Issue: Hair looks unrealistic
**Solution**: Add more detail to "HAIR REQUIREMENTS" section about texture, strands, and shadows

### Issue: Grid layout is incorrect (Discover Mode)
**Solution**: Be more explicit about grid dimensions and separator lines in "OUTPUT FORMAT"

### Issue: All providers fail
**Solution**: Check that all API keys are valid and have sufficient credits

### Issue: Slow generation times
**Solution**: 
- Reduce `num_inference_steps` in Replicate settings
- Use faster models in OpenRouter
- Optimize image resolution

---

## 💡 Best Practices

1. **Test with diverse faces**: Ensure prompts work across different ethnicities, ages, and genders
2. **Balance identity vs. style**: Too strict = poor style application, too loose = identity loss
3. **Iterate on failures**: When a provider fails, examine the error and adjust prompts
4. **Monitor costs**: Image generation can be expensive, especially with fallback chains
5. **Cache results**: Consider caching generated images to avoid regenerating the same combinations

---

## 📚 Additional Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [fal.ai Documentation](https://fal.ai/docs)
- [Replicate Documentation](https://replicate.com/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Stable Diffusion Prompting](https://stable-diffusion-art.com/prompt-guide/)

---

## 🔄 Version History

- **v2.0** (Current): Enhanced forensic-level identity preservation prompts
  - Upgraded to "world-class forensic portrait photographer" framing
  - Added zero-tolerance identity lock with biometric-level detail
  - Expanded face geometry specifications (skull shape, forehead dimensions)
  - Added exact RGB color matching for eyes
  - Detailed skin tone preservation (undertones, no color shift)
  - Facial hair treated as "permanent ink" - never altered
  - Camera characteristics preservation (focal length, grain, sharpness)
  - Sub-millimeter hair strand detail requirements
  - Forensic examiner validation standard
  - More precise hairstyle descriptions with guard numbers and measurements

- **v1.0**: Initial implementation with 3-provider cascade
  - OpenRouter (Gemini models)
  - fal.ai (FLUX/Ideogram)
  - Replicate (PhotoMaker)
