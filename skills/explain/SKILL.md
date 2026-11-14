---
name: explain
description: "Turn one idea or sentence into an Arabic animated explainer with researched facts, a short script, editable scenes, narration timing and captions. Use for a complete educational short, concept explanation, or animated tutorial from an idea."
---

# Explain

The assistant writes the story and builds the video. A sentence is enough to begin. A finished voiced video also needs a recording or an explicitly requested, available TTS provider. Do not invent that an included preview has narration.

## Locate and prepare

Resolve this skill's real file path; the kit is two directories above it, or use `app-location.txt` on Windows. Read `docs/commands-ar.md` and `skills/animate/SKILL.md` for setup, research, sources, footage rules and review. Five editable scripts in `examples/` demonstrate the plan format. The kit's CLI compiles a plan; Claude/Codex supplies the topic reasoning and writing.

## End-to-end workflow

1. Interpret the sentence as one answerable question. Pick a hook, a concrete mechanism and a clear takeaway. Use approximately 45–70 Arabic words for a 20–35s short, then adjust to actual speech. Use natural, broadly understood Arabic, short phrases and familiar words. Do not force a dialect. Ask about voice only if needed to finish a narrated export.
2. Verify technical/current claims from primary sources. Record source links and the claim they support in the plan's `sources` and `facts` fields. Mark illustrative numbers explicitly. Do not imply probability illustrations are measured model output. Clearly label schematics and simplified science.
3. Write `script.md` and `plan.json` in a new project folder. Use 4–7 scenes with a distinct visual function: hook, mechanism, example, takeaway. Default to a coherent mix of titles, real screens and explanatory diagrams; do not produce the same card stack for every subject. Share a brief script when approval is requested; otherwise continue with the supplied intent.
4. Choose from `hero`, `tokens`, `probability`, `network`, `layers`, `flow`, `bars`, `metric`, `scan`, `solar`, `fiber`, `comparison`, or `custom`. Each scene needs `type`, `title`, `items`, `duration`; bars need real or labelled illustrative `values`. The supplied kit is vector/2.5D, not a photorealistic 3D simulator. For a genuinely new scene, create a HyperFrames template from `examples/custom-scene.html`, using `__SCENE_ID__` for the ID and timeline key. Read the installed HyperFrames skill/registry before advanced custom work; optional external registry blocks are not bundled with this kit.
5. Search/capture missing real visual material as described in `animate`. Use the member's own clips or authorized reusable assets. Build scenes around what the narration actually explains. Keep assets local and write an asset ledger.
6. Without narration, build a **silent preview**: `npm run motion -- explain projects/topic/plan.json --out work/topic-preview`. Do not call this the voiced final. Offer the script for one clean phone/mic recording. Do not clone a voice or generate a synthetic voice unless requested.
7. With narration, transcribe locally or use an existing reviewed transcript. Clean retakes without cutting words; preserve an original and a cut list. Add an `anchor` phrase to each scene after the first. Run `python3 scripts/align-plan.py plan.json words.json narration.wav --out aligned-plan.json`; repeated anchors require `occurrence`. This aligns scenes and short caption groups to speech. Review the words and timing rather than trusting automatic Arabic transcription. Build from the aligned plan and confirm audio duration matches the composition.
8. Add restrained original SFX where useful. Choose from the 80 cues in `assets/sounds/catalog.json`. Each scene may specify a cue such as `sound: "page-turn-03"` and a `soundAt` offset in seconds. Match the cue to a visible action; there is no music library. Do not bury the voice or silently add copyrighted music.
9. Check, snapshot and visually inspect the complete piece at phone size, all cuts and caption boundaries. Open the editable preview. Render the requested file, probe audio/video streams and inspect decoded output frames. Listen if an actual listening tool is available; otherwise state audio was measured, not heard. Deliver the MP4, script, sources, editable project and any known limitations.

## Guardrails that improve the result

Never manufacture a fact or a completed source lookup. Never substitute a random stock clip for a needed explanation. Keep the conclusion within what the sources support. A silent draft is a valid intermediate deliverable, but finish the narrated version when narration is available. Preserve the member's chosen format and editing style. Change the supplied example content; don't pass its sample metrics off as their results.
