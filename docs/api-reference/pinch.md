# Pinch

Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).

## Constructor

```ts
import {EventManager, Pinch} from 'mjolnir.js';

const eventManager = new EventManager(target, {
  // ...
  recognizers: [new Pinch({pointers: 2})]
});
```

- `options` (object, optional) - Options
  - `event` (string) - Name of the event. Default `'pinch'`.
  - `pointers` (number) - Required pointers, with a minimal of 2. Default `2`.
  - `threshold` (number) - Minimal scale before recognizing. Default `0`.
  - `trackpad` (boolean) - Recognize trackpad pinch gestures from wheel events. This option is only used when `pointers` is `2`. Default `false`.

### Trackpad pinch

Trackpad support is opt-in:

```ts
import {EventManager, Pinch} from 'mjolnir.js';

const eventManager = new EventManager(target, {
  recognizers: [new Pinch({trackpad: true})]
});

eventManager.on('pinchmove', (event) => {
  if (event.pointerType === 'trackpad') {
    console.log(event.scale);
  }
});
```

The browser represents a trackpad pinch as a wheel sequence with `ctrlKey` set. Mjolnir.js converts this sequence into a continuous pinch lifecycle (`pinchstart`, `pinchmove`, and `pinchend`). Existing pointer and touch behavior is unchanged when `trackpad` is not enabled.

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
