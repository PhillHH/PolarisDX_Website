# Consumer wireframes — test: Vitamin D3 Spray

Test slice for the consumer-facing product pages (Vit-D spray, masks, combo).
Vit-D spray **first** to lock the format & process before masks + combo.
Deliberately **abstract / low-fidelity** and in **English** (content owner: Claire).

## Deliverables

| File                                       | Purpose                                                                | Audience        |
| ------------------------------------------ | ---------------------------------------------------------------------- | --------------- |
| `../VitaminD3Spray_Wireframe_Content.pptx` | **Editable content deck** — Claire fills this in                       | Claire          |
| `consumer/vitamin-d3-spray.html`           | Abstract layout reference (open in a browser; uses `../wireframe.css`) | dev / alignment |
| `ppt/build_pptx.py`                        | Generator (Python stdlib only, no deps) — regenerates the deck         | internal        |

## The .pptx (Claire's workspace)

14 slides, 16:9, native editable PowerPoint fields (not an image):

- **Slide 1** — "How to use this deck".
- **Slide 2** — page flow: order of the 12 sections.
- **Slides 3–14** — one slide per section:
  - left: an **abstract greyscale layout sketch** (loose blocks, no final styling),
  - right: the **same generic content slots** every time — Headline,
    Supporting copy, Body, Key points, CTA, Visual brief. Click a slot and
    overwrite the grey prompt; fill what's relevant, skip the rest.
- Sign-off via PowerPoint comments (Review → New Comment).

It is intentionally _not_ a rigid template: same loose slots everywhere so
Claire owns the content and we're not pre-deciding copy or layout.

## Process

1. Claire fills content in the `.pptx`.
2. Both of you sign off via `.pptx` comments.
3. Dev builds the React page from approved content + the HTML reference.
4. Once the format is approved → same mechanic for **masks** + **combo**.

## Assumptions (please confirm with Claire)

1. **Standalone consumer page** with a slim consumer header/footer —
   _not_ the existing B2B PolarisDX shell (different brand/audience).
2. **New DTC flow** (Hero → Trust → Why → USP → How to use → Benefits →
   Ingredients → Reviews → Pricing → FAQ → Guarantee → Closing CTA) —
   consumer-first, not the existing practice/order-oriented `/vitamin-d3-spray`.
3. **Format**: one slide per section, 16:9. (Alternative: whole page on one
   tall portrait slide — say the word and I'll build that variant.)
4. **Greyscale, abstract, low-fi** on purpose while there is no brandbook/CI —
   structure & content first.

Regenerate: `python3 wireframes/ppt/build_pptx.py`
