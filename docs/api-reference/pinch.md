# Pinch

Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).

## Constructor

```ts
import {EventManager, Pinch} from 'mjolnir.js';

const eventManager = new EventManager({
  // ...
  recognizers: [new Pinch({pointers: 2})]
});
```

- `options` (object, optional) - Options
  - `event` (string) - Name of the event. Default `'pinch'`.
  - `pointers` (number) - Required pointers, with a minimal of 2. Default `2`.
  - `threshold` (number) - Minimal scale before recognizing. Default `0`.

## Events

- pinch, together with all of below
- pinchstart
- pinchmove
- pinchend
- pinchcancel
- pinchin
- pinchout

## Source

https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/pinch.ts
