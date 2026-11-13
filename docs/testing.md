# Validation — 2026-11-14

Release candidate 0.1.0. Tested locally on Apple Silicon macOS, Node.js, FFmpeg and the pinned HyperFrames 0.9.10 engine.

- All 42 animation configs compile to distinct editable compositions.
- Catalog, five explainer plans and the 16-effect collection passed HyperFrames checks after Arabic anchor, label occlusion and layer-spacing fixes.
- Keyframe sheets were visually inspected, including actual local subject segmentation on the supplied demonstration footage.
- The editable animation, effects and explainer previews opened with their expected timelines.
- Unit checks cover catalog coverage, invalid dimensions/data, output preservation, text escaping, caption bounds and Arabic phrase matching.
- Skill metadata validation passed. Setup was exercised in a fresh installation destination and rerun to confirm existing entries are preserved.

Silent-gallery warnings are intentional. Static holds allow reading. Cutout edge quality is source-dependent; no automatic head tracking is claimed. These are keyframe and transition checks, not a claim that every rendered frame was manually watched.

Windows/Linux and every possible user video are not tested. See the release notes for the final media, packaging and installation checks.

## Final local checks

All 63 gallery MP4s were probed: video streams only, no audio tracks. The desktop gallery, 390px mobile layout, 42-animation filter, 16-effect filter, Arabic search, modal playback and play/pause were exercised. No horizontal overflow was observed in the mobile DOM.

Optional transcription was installed and run on eight seconds of Arabic speech using Python 3.12 and Whisper tiny (26 word timings). Python 3.15 was incompatible with the optional inference dependency; setup now selects Python 3.10–3.13. PyAV 19 changed an API required by faster-whisper, so PyAV is pinned to tested 15.1.0. Arabic recognition still needs correction by the assistant/member. The default small model was not the smoke-test model.

Recorded audio, scene anchors, short caption groups and synthesized SFX were integrated into an eight-second QA render. This checks integration, not transcription accuracy or a listening review. Transparent ProRes export was tested at 1080×1920 with an alpha-bearing pixel format. Source footage and examples were not color-graded.
