# Press

Recognized when the pointer is down for some time without any movement.

## Constructor

```ts
import {EventManager, Press} from 'mjolnir.js';

const eventManager = new EventManager({
  // ...
  recognizers: [
    new Press({time: 500})
  ]
});
```

* `options` (object, optional) - Options
  - `event` (string) -	Name of the event. Default `'press'`.
  - `pointers` (number) - Required pointers. Default `1`.
  - `threshold` (number) - Minimal movement that is allowed while pressing. Default `9`.
  - `time` (number) - Minimal press time in ms. Default `251`.

## Events

- press
- pressup


## Source

https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/press.ts
