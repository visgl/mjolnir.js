# DoubleClickDrag

Recognized when a second tap or click turns into a vertical drag gesture.

## Constructor

```ts
import {EventManager, DoubleClickDrag} from 'mjolnir.js';

const eventManager = new EventManager({
  // ...
  recognizers: [new DoubleClickDrag()]
});
```

- `options` (object, optional) - Options
  - `event` (string) - Name of the event. Default `'doubleclickdrag'`.
  - `pointers` (number) - Required pointers. Default `1`.
  - `interval` (number) - Maximum time in ms between the two taps. Default `500`.
  - `time` (number) - Maximum press time in ms for each tap. Default `350`.
  - `threshold` (number) - Maximum movement in px allowed while tapping. Default `28`.
  - `dragThreshold` (number) - Minimum vertical movement in px before dragging starts. Default `1`.
  - `pixelsPerScale` (number) - Vertical pixels required to double the scale. Default `120`.

## Events

- doubleclickdrag, together with all of below
- doubleclickdragstart
- doubleclickdragmove
- doubleclickdragend
- doubleclickdragcancel

## Notes

- The emitted event includes a `scale` property derived from the vertical drag distance.
- The gesture is silent until the second tap turns into a drag and crosses `dragThreshold`.

## Source

https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/double-click-drag.ts
