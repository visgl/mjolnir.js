# Pan

Recognized when the pointer is down and moved in the allowed direction.

## Constructor

```ts
import {EventManager, Pan, InputDirection} from 'mjolnir.js';

const eventManager = new EventManager({
  // ...
  recognizers: [
    new Pan({direction: InputDirection.Horizontal})
  ]
});
```

* `options` (object, optional) - Options
  - `event` (string) -	Name of the event. Default `'pan'`.
  - `pointers` (number) - Required pointers. Default `1`.
  - `threshold` (number) - Minimal pan distance required before recognizing. Default `10`.
  - `direction` {InputDirection} - Direction of the panning. Default `InputDirection.All`.

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
