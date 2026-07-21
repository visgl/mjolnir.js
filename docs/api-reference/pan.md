# Pan

Recognized when the pointer is down and moved in the allowed direction.

## Constructor

```ts
import {EventManager, Pan, InputDirection} from 'mjolnir.js';

const eventManager = new EventManager(target, {
  // ...
  recognizers: [new Pan({direction: InputDirection.Horizontal})]
});
```

- `options` (object, optional) - Options
  - `event` (string) - Name of the event. Default `'pan'`.
  - `pointers` (number) - Required pointers. Default `1`.
  - `threshold` (number) - Minimal pan distance required before recognizing. Default `10`.
  - `direction` (InputDirection) - Direction of the panning. Default `InputDirection.All`.
  - `trackpad` (boolean) - Recognize two-finger trackpad pan gestures from wheel events. This option is only used when `pointers` is `2`. Default `false`.

### Trackpad pan

Trackpad support is opt-in. Configure the recognizer with `pointers: 2` and `trackpad: true`:

```ts
import {EventManager, Pan} from 'mjolnir.js';

const eventManager = new EventManager(target, {
  recognizers: [new Pan({pointers: 2, trackpad: true})]
});

eventManager.on('panmove', (event) => {
  if (event.pointerType === 'trackpad') {
    console.log(event.deltaX, event.deltaY);
  }
});
```

Two-finger scrolling is emitted as a continuous pan lifecycle (`panstart`, `panmove`, and `panend`). Existing pointer and touch behavior is unchanged when `trackpad` is not enabled.

## Events

- pan, together with all of below
- panstart
- panmove
- panend
- pancancel
- panleft
- panright
- panup
- pandown

## Source

https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/pan.ts
