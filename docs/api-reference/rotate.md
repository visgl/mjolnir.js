# Rotate

Recognized when two or more pointer are moving in a circular motion.

## Constructor

```ts
import {EventManager, Rotate} from 'mjolnir.js';

const eventManager = new EventManager({
  // ...
  recognizers: [
    new Rotate({pointers: 2})
  ]
});
```

* `options` (object, optional) - Options
  - `event` (string) -	Name of the event. Default `'rotate'`.
  - `pointers` (number) - Required pointers, with a minimal of 2. Default `2`.
  - `threshold` (number) - Minimal rotation before recognizing. Default `0`.

## Events

- rotate, together with all of below
- rotatestart
- rotatemove
- rotateend
- rotatecancel

## Source

https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/rotate.ts
