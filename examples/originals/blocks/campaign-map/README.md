# Campaign map

The sweeping arrows on a map from a history documentary, for any story about how something moved or spread: a company expanding, a trend crossing the world, a trade route, an empire, a tour, a voyage. A real map fills the frame, printed like an old atlas with engraved lines along every coast. Big tapered arrows surge across it one at a time, thick at the tail and sharp at the head. Each one plants on a numbered place with a date, a ring pulses out and the count ticks. The camera follows every arrow.

**Key moment:** the final arrow plants with the biggest hit. Every earlier arrow flashes gold, a ring wave and colour wash roll out across the map from the last place, the camera lands on the whole sweep and the total and hero line stamp in together.

## Suits

- A company, product or idea spreading to new places
- Tours, journeys and trade routes
- Historic voyages and campaigns
- Anything said as "from here, to here, to here" at the scale of cities, countries or continents
- Round-the-world and across-the-Pacific stories, which draw as one unbroken line

## Doesn't suit

- A route along real streets. Use `route-map`
- More than five moves
- Places a few streets apart. The map works at city scale and above
- A precise path. The arrows are curved arcs between places, not the route anyone actually took

## Render the featured map

From the kit root, install the scene dependencies with `npm ci --prefix examples/originals`, then run:

```sh
node scripts/featured.mjs campaign-map renders/my-map.mp4
```

To draw a different journey, copy `examples/featured/campaign-map.json`, change the stops, coordinates and stage labels, and pass the copy as the final argument. The bundled world outlines work offline. Enter latitude and longitude for each stop and verify the units for the final total.

## What to change

See [block.json](block.json) for all supported settings.

| Variables | What they are |
|---|---|
| `mapData` | A map file from `animate campaign`. Leave empty for the offline world map |
| `mapStyle` | `parchment` or `ink`. A colour you set yourself always wins |
| `title` | Optional title. Leave empty for just the count |
| `origin`, `originStage` | The starting place and its date |
| `place1` to `place5` | Where each arrow lands. Leave one empty to skip that move |
| `stage1` to `stage5` | The date or stage of each move |
| `lat1`, `lon1` and so on | Where each place is, plus `originLat` and `originLon`. Not used with `mapData` |
| `bend1` to `bend5` | Curve of each arrow, from -0.4 to 0.4. Empty picks one that bows away from the middle of the map |
| `routeShape` | `chain` has each arrow leave the last place, `hub` has every arrow leave the first. Not used with `mapData` |
| `countLabel`, `countStart`, `count1` to `count5` | The small count. It can tick up or down, and numbers roll as each arrow flies |
| `heroValue`, `heroLine` | The total and line that stamp in at the key moment |
| `tilt` | Map tilt in degrees. 0 is flat |
| `territory` | `on` tints the land the arrows reach as they pass. Default `off` |
| `land`, `landEdge`, `sea`, `seaDeep`, `coast`, `grid` | The map's colours |
| `arrow`, `arrowTail`, `keyline`, `flash` | Arrows, their cream outline and the key moment flash |
| `plate`, `plateText`, `stageText`, `heroText`, `table` | Plates, text and the table behind the sheet |
| `overlayPosition` | `top` or `bottom` for the overlay output |

- The default story is true: Magellan and Elcano's voyage of 1519 to 1522. Five ships left, four reached the Strait, two reached Tidore and one, the Victoria, came home. Change every word and number when you change the story.
- `territory` suits spread and takeover stories, where the land really was reached or taken. Leave it off for journeys, because it marks land near the arrows and a voyage passing a coast doesn't claim it. `animate campaign` leaves this choice to you.
- Keep place names to about 20 characters and the hero line to one sentence. Long names wrap, and very long ones crowd the short outputs.
- Without `mapData` there are no country borders, because the bundled outlines only have land.
- Small islands are missing from the offline map. A marker can sit in open sea where the island would be.
- The plates between the first and last drop their dates in the finished frame, to keep the sweep clear. Every date is on screen as its arrow lands.
- A route that circles the world ends a full turn from where it began, so the same place shows at both ends of the sheet.

## Timing

| | |
|---|---|
| Build-up before the key moment | 4.6s by default; 2.8s minimum |
| Hold | 1.5s by default |
| Transparent exit | Closes onto the final place in 0.36s |

Each arrow is one beat. Fewer moves means each one takes longer, and the last arrow always lands exactly on the key.

The camera opens tight on the first place, then swings to frame each arrow as it flies, lifting out a little on long moves. During the last arrow it pulls back to the full sweep, arriving as the arrow lands. In flight the arrow's head rides above the map, and its shadow slams shut as it plants. The marker stamps down, a ring pulses and the count settles on the new value. Older plates step aside during the close-ups and return for the reveal.

During the hold a slow sheen travels along the arrows, rings pulse at every place and the camera drifts a little.

## Outputs

`full` uses the map full frame, with a stacked hero plate inside the portrait safe area. A wide route shows as the whole map sheet lying on a table, with the title above and the hero below.

`top` uses a wider framing and a one-row hero plate. Long hero lines stack into two rows. Below 720px high the title drops away and the middle plates leave the finished frame, so the numbers carry it.

`overlay` uses a 1000px-high square card with its own framing and one-row hero plate. It opens from the first place and closes onto the last.

Framing is worked out from the places themselves, in every output. Plates are placed clear of the arrows, first for each close-up and again for the finished frame.
