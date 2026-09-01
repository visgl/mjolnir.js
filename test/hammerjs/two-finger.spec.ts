// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {afterEach, expect, test, vi} from 'vitest';
import {EventManager, TwoFingerPan, TwoFingerPinch} from 'mjolnir.js';
import {createEventTarget} from '../test-utils/dom';

function dispatchPointerEvent(
  target: EventTarget,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  {pointerId, x, y}: {pointerId: number; x: number; y: number}
): void {
  const event = new document.defaultView!.MouseEvent(type, {
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
    button: 0,
    buttons: type === 'pointerup' ? 0 : 1
  });
  Object.defineProperties(event, {
    pointerId: {value: pointerId},
    pointerType: {value: 'touch'},
    isPrimary: {value: pointerId === 1}
  });
  target.dispatchEvent(event);
}

function createTwoFingerManager() {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [
      new TwoFingerPan({event: 'multipan', threshold: 10}),
      {
        recognizer: new TwoFingerPinch(),
        requireFailure: ['multipan']
      }
    ]
  });
  const events: string[] = [];
  for (const eventName of [
    'multipanstart',
    'multipanmove',
    'multipanend',
    'pinchstart',
    'pinchmove',
    'pinchend'
  ]) {
    eventManager.on(eventName, () => events.push(eventName));
  }
  expect(
    eventManager.manager.get('multipan')?.options.pointers,
    'TwoFingerPan defaults to two pointers'
  ).toBe(2);
  expect(
    eventManager.manager.get('pinch')?.options.threshold,
    'TwoFingerPinch defaults to a noise-resistant scale threshold'
  ).toBe(0.03);
  return {root, eventManager, events};
}

function finishGesture(
  pointerIds: [number, number],
  positions: [[number, number], [number, number]]
): void {
  dispatchPointerEvent(document.defaultView!, 'pointerup', {
    pointerId: pointerIds[0],
    x: positions[0][0],
    y: positions[0][1]
  });
  dispatchPointerEvent(document.defaultView!, 'pointerup', {
    pointerId: pointerIds[1],
    x: positions[1][0],
    y: positions[1][1]
  });
}

afterEach(() => {
  vi.useRealTimers();
});

test('TwoFinger recognizers distinguish translation, pinch, and rotation', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createTwoFingerManager();

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  for (const offset of [10, 20, 30]) {
    dispatchPointerEvent(document.defaultView!, 'pointermove', {
      pointerId: 1,
      x: 350,
      y: 250 - offset
    });
    dispatchPointerEvent(document.defaultView!, 'pointermove', {
      pointerId: 2,
      x: 450,
      y: 250 - offset
    });
    vi.advanceTimersByTime(30);
  }
  finishGesture(
    [1, 2],
    [
      [350, 220],
      [450, 220]
    ]
  );

  expect(events, 'translation claims pan').toContain('multipanstart');
  expect(events, 'translation continues after recognition').toContain('multipanmove');
  expect(events, 'translation ends cleanly').toContain('multipanend');
  expect(events, 'translation does not claim pinch').not.toContain('pinchstart');

  events.length = 0;
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 3, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 4, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 3, x: 340, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 4, x: 460, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 3, x: 330, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 4, x: 470, y: 250});
  finishGesture(
    [3, 4],
    [
      [330, 250],
      [470, 250]
    ]
  );

  expect(events, 'separation claims pinch').toContain('pinchstart');
  expect(events, 'pinch continues after recognition').toContain('pinchmove');
  expect(events, 'pinch ends cleanly').toContain('pinchend');
  expect(events, 'separation does not claim pan').not.toContain('multipanstart');

  events.length = 0;
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 5, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 6, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 5, x: 351, y: 243});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 6, x: 449, y: 257});
  finishGesture(
    [5, 6],
    [
      [351, 243],
      [449, 257]
    ]
  );

  expect(events, 'rotation claims pinch transform').toContain('pinchstart');
  expect(events, 'rotation does not claim pan').not.toContain('multipanstart');

  events.length = 0;
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 7, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 8, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 7, x: 348, y: 235});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 8, x: 452, y: 235});
  finishGesture(
    [7, 8],
    [
      [348, 235],
      [452, 235]
    ]
  );

  expect(events, 'a translating pinch claims pinch').toContain('pinchstart');
  expect(events, 'a translating pinch does not claim pan first').not.toContain('multipanstart');

  eventManager.destroy();
  root.remove();
});

test('TwoFinger recognizers ignore staggered translation scale', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createTwoFingerManager();

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 220});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 220});
  vi.advanceTimersByTime(30);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 210});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 210});
  finishGesture(
    [1, 2],
    [
      [350, 210],
      [450, 210]
    ]
  );

  expect(events, 'staggered translation claims pan').toContain('multipanstart');
  expect(events, 'transient scale does not claim pinch').not.toContain('pinchstart');

  eventManager.destroy();
  root.remove();
});

test('TwoFingerPinch recognizes a deliberately anchored pinch after a short delay', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createTwoFingerManager();

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  for (const offset of [8, 16, 24]) {
    dispatchPointerEvent(document.defaultView!, 'pointermove', {
      pointerId: 1,
      x: 350 - offset,
      y: 250
    });
    if (offset === 16) {
      expect(events, 'anchored pinch remains pending during the arbitration delay').not.toContain(
        'pinchstart'
      );
    }
    vi.advanceTimersByTime(25);
  }
  finishGesture(
    [1, 2],
    [
      [326, 250],
      [450, 250]
    ]
  );

  expect(events, 'anchored pinch is recognized after the arbitration delay').toContain(
    'pinchstart'
  );
  expect(events, 'anchored pinch does not claim pan').not.toContain('multipanstart');

  eventManager.destroy();
  root.remove();
});

test('TwoFingerPinch ignores touch transform noise until an intent threshold is crossed', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createTwoFingerManager();

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 248});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 252});

  expect(events, 'sub-threshold rotation does not claim pinch').not.toContain('pinchstart');
  expect(events, 'sub-threshold rotation does not claim pan').not.toContain('multipanstart');

  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 246});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 254});

  expect(events, 'rotation crossing the intent threshold claims pinch').toContain('pinchstart');
  expect(events, 'rotation crossing the intent threshold does not claim pan').not.toContain(
    'multipanstart'
  );

  finishGesture(
    [1, 2],
    [
      [350, 246],
      [450, 254]
    ]
  );
  eventManager.destroy();
  root.remove();
});

test('TwoFinger recognizers recover across pinch and pan gestures with reused pointers', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createTwoFingerManager();

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 340, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 460, y: 250});
  finishGesture(
    [1, 2],
    [
      [340, 250],
      [460, 250]
    ]
  );

  expect(events, 'the first gesture claims pinch').toContain('pinchstart');
  expect(events, 'the first gesture does not claim pan').not.toContain('multipanstart');

  events.length = 0;
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  for (const offset of [10, 20, 30]) {
    dispatchPointerEvent(document.defaultView!, 'pointermove', {
      pointerId: 1,
      x: 350,
      y: 250 - offset
    });
    dispatchPointerEvent(document.defaultView!, 'pointermove', {
      pointerId: 2,
      x: 450,
      y: 250 - offset
    });
    vi.advanceTimersByTime(30);
  }
  finishGesture(
    [1, 2],
    [
      [350, 220],
      [450, 220]
    ]
  );

  expect(events, 'the next gesture claims pan').toContain('multipanstart');
  expect(events, 'the next gesture does not inherit pinch state').not.toContain('pinchstart');

  events.length = 0;
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 340, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 460, y: 250});

  expect(events, 'pinch can be recognized again after pan').toContain('pinchstart');
  expect(events, 'pinch after pan does not inherit pan state').not.toContain('multipanstart');

  finishGesture(
    [1, 2],
    [
      [340, 250],
      [460, 250]
    ]
  );
  eventManager.destroy();
  root.remove();
});

test('TwoFinger recognizers preserve trackpad pan and pinch', () => {
  vi.useFakeTimers();
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [
      new TwoFingerPan({event: 'multipan', pointers: 2, threshold: 0, trackpad: true}),
      new TwoFingerPinch({trackpad: true})
    ]
  });
  const events: string[] = [];
  eventManager.on('multipanstart', () => events.push('multipanstart'));
  eventManager.on('pinchstart', () => events.push('pinchstart'));

  const WheelEvent = root.ownerDocument.defaultView!.WheelEvent;
  root.dispatchEvent(new WheelEvent('wheel', {deltaMode: 0, deltaX: 10}));
  vi.advanceTimersByTime(100);
  root.dispatchEvent(new WheelEvent('wheel', {ctrlKey: true, deltaMode: 0, deltaY: -10}));

  expect(events, 'trackpad pan is inherited').toContain('multipanstart');
  expect(events, 'trackpad pinch is inherited').toContain('pinchstart');

  eventManager.destroy();
  root.remove();
});
