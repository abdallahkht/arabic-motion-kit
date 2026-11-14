# Original motion examples

Each row pairs the original preview with its editable scene. Open the scene folder for its settings, layout, styles, animation code and any scene-specific assets.

| Example | Video | Code |
| --- | --- | --- |
| Isometric flow | [MP4](../../gallery/media/isometric-flow.mp4) | [Scene](blocks/isometric-flow) |
| Blue editorial | [MP4](../../gallery/media/blue-editorial.mp4) | [Scene](blocks/blue-editorial) |
| Ink Wash | [MP4](../../gallery/media/ink-wash.mp4) | [Scene](blocks/ink-wash) |
| Hours collapse | [MP4](../../gallery/media/hours-collapse.mp4) | [Scene](blocks/hours-collapse) |
| Agent fan-out | [MP4](../../gallery/media/agent-fan-out.mp4) | [Scene](blocks/agent-fan-out) |
| App launch | [MP4](../../gallery/media/app-launch.mp4) | [Scene](blocks/app-launch) |

## Render a scene

From this folder, with Node.js 22+ and FFmpeg installed:

```sh
npm ci
npm run render -- isometric-flow ../../renders/isometric-flow.mp4
```

Use any scene folder name in the command. To change the words or colors, pass a JSON file with overrides as the last argument. See each scene’s README and `block.json` for its supported settings. The six original MP4 files are included in the main kit download.

The scene source, shared runtime and original media are distributed with permission under separate terms. [Asset and dependency notices](UPSTREAM-CREDITS.md).
