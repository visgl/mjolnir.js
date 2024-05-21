# Types

## InputDirection Enum

- None
- Left
- Right
- Up
- Down
- Horizontal
- Vertical
- All

## InputEvent Enum

- Start
- Move
- End
- Cancel

## MjolnirEvent

- `type` (string) - The event type to which the event handler is subscribed, e.g. `'click'` or `'pointermove'`
- `center` (Point) - The center of the event location (e.g. the centroid of a touch) relative to the browser's viewport (basically, [`clientX/Y`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX))
- `offsetCenter` (Point) - The center of the event location (e.g. the centroid of a touch) relative to the root element
- `target` (TargetElement) - The immediate target of the event, as specified by the original `srcEvent`
- `rootElement` (HTMLElement) - The root element of the `EventManager`
- `srcEvent` (Event) - The original event object dispatched by the browser to the JS runtime
- `preventDefault` (() => void) - Equivalent to `srcEvent.preventDefault`.
- `stopPropagation` (() => void) - Do not invoke handlers registered for any ancestors in the DOM tree.
- `stopImmediatePropagation` (() => void) - Do not invoke any other handlers registered for the same element or its ancestors.


### MjolnirPointerEvent

Emitted by `pointer*` events. Extends `MjolnirEvent` with the following fields:

- `leftButton` (boolean) - Flag indicating whether the left mouse button is involved during the event
- `middleButton` (boolean) - Flag indicating whether the middle mouse button is involved during the event
- `rightButton` (boolean) - Flag indicating whether the right mouse button is involved during the event
- `pointerType` (string) - A string indicating the type of input (e.g. `'mouse'`, `'touch'`, `'pen'`)


### MjolnirGestureEvent

Emitted by recognizers (`Pan`, `Rotate` etc.). Extends `MjolnirEvent` with the following fields:

- `eventType` (InputEvent) - type of this event (start, move, end) in the gesture lifecycle
- `timeStamp` (number) - Timestamp of the event
- `deltaTime` (number) - Total time since the first input
- `deltaX` (number) - Movement along the X axis
- `deltaY` (number) - Movement along the Y axis
- `angle` (number) - Angle moved, in degrees
- `distance` (number) - Distance moved
- `scale` (number) - Scaling that has been done with multi-touch. 1 on a single touch.
- `rotation` (number) - Rotation (in degrees) that has been done with multi-touch. 0 on a single touch.
- `direction` (InputDirection) - Direction moved.
- `offsetDirection` (InputDirection) - Direction moved from its starting point.
- `velocity` (number) - Highest velocityX/Y value.
- `velocityX` (number) - Velocity along the X axis, in px/ms
- `velocityY` (number) - Velocity along the Y axis, in px/ms
- `leftButton` (boolean) - Flag indicating whether the left mouse button is involved during the event
- `middleButton` (boolean) - Flag indicating whether the middle mouse button is involved during the event
- `rightButton` (boolean) - Flag indicating whether the right mouse button is involved during the event


### MjolnirWheelEvent

Emitted by the `wheel` event. Extends `MjolnirEvent` with the following fields:

- `delta` (number) - The scroll magnitude/distance of a wheel event

### MjolnirKeyEvent

Emitted by the `key*` events. Extends `MjolnirEvent` with the following fields:

- `key` (string) - The [key value](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) associated with the keyboard event.
