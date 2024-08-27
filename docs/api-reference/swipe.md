# Swipe

Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.

## Constructor

```ts
import {EventManager, InputDirection, Swipe} from 'mjolnir.js';

const eventManager = new EventManager({
  // ...
  recognizers: [new Swipe({direction: InputDirection.Horizontal})]
});
```

- `options` (object, optional) - Options
  - `event` (string) - Name of the event. Default `'swipe'`.
  - `pointers` (number) - Required pointers. Default `1`.
  - `threshold` (number) - Minimal distance required before recognizing. Default `10`.
  - `direction` {InputDirection} - Direction of the panning. Default `InputDirection.All`.
  - `velocity` (number) - Minimal velocity required before recognizing, unit is in px per ms. Default `0.3`.

## Events

- swipe, together with all of below
- swipeleft
- swiperight
- swipeup
- swipedown

## Source

https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/swipe.ts
