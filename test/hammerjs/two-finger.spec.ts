// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {afterEach, expect, test, vi} from 'vitest';
import {EventManager, Pan, Pinch} from 'mjolnir.js';
import type {InputCoherenceCondition, MjolnirGestureEvent} from 'mjolnir.js';
import {createEventTarget} from '../test-utils/dom';

const PINCH_COHERENCE: InputCoherenceCondition[] = [
  {movementDeltaTime: 40, distance: 2, scale: 0.03},
  {movementDeltaTime: 40, distance: 2, rotation: 3},
  {distancePerPointer: 1, scale: 0.03},
  {distancePerPointer: 1, rotation: 3}
];

const PAN_COHERENCE: InputCoherenceCondition[] = [{distancePerPointer: 1}];

function dispatchPointerEvent(
  target: EventTarget,
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  {pointerId, x, y}: {pointerId: number; x: number; y: number}
): void {
  const event = new document.defaultView!.MouseEvent(type, {
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
    button: 0,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1
  });
  Object.defineProperties(event, {
    clientX: {value: x},
    clientY: {value: y},
    pointerId: {value: pointerId},
    pointerType: {value: 'touch'},
    isPrimary: {value: pointerId === 1}
  });
  target.dispatchEvent(event);
}

function createCoherentManager({
  trackpad = false,
  panThreshold = 10
}: {
  trackpad?: boolean;
  panThreshold?: number;
} = {}) {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [
      new Pinch({coherent: PINCH_COHERENCE, trackpad}),
      {
        recognizer: new Pan({
          event: 'multipan',
          pointers: 2,
          threshold: panThreshold,
          coherent: PAN_COHERENCE,
          trackpad
        }),
        requireFailure: ['pinch']
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

test('coherent Pan and Pinch distinguish translation, pinch, and rotation', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createCoherentManager();

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  for (const offset of [11, 20, 30]) {
    vi.advanceTimersByTime(30);
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

test('coherent Pan claims translation first and blocks later pinch conditions', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createCoherentManager();

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  vi.advanceTimersByTime(30);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 220});

  expect(events, 'initial staggered movement remains pending').toEqual([]);

  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 220});

  expect(events, 'pan claims the first coherent threshold crossing').toEqual(['multipanstart']);

  vi.advanceTimersByTime(30);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 210});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 210});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 330, y: 210});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 470, y: 210});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 250});
  finishGesture(
    [1, 2],
    [
      [350, 250],
      [450, 250]
    ]
  );

  expect(events, 'staggered translation claims pan').toContain('multipanstart');
  expect(events, 'scale and rotation after pan recognition do not claim pinch').not.toContain(
    'pinchstart'
  );
  expect(events, 'pan continues even after returning below its coherence threshold').toContain(
    'multipanend'
  );

  eventManager.destroy();
  root.remove();
});

test('coherent Pinch can claim later movement while Pan remains below its threshold', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createCoherentManager();

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 245});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 245});

  expect(events, 'sub-threshold translation remains pending').toEqual([]);

  vi.advanceTimersByTime(30);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 239});

  expect(events, 'established pointer coherence lets the next rotation claim pinch').toEqual([
    'pinchstart'
  ]);

  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 239});

  expect(
    events,
    'pinch continues when the rotation returns below its starting threshold'
  ).toContain('pinchmove');
  expect(events, 'pan cannot take over after crossing its threshold').not.toContain(
    'multipanstart'
  );

  finishGesture(
    [1, 2],
    [
      [350, 239],
      [450, 239]
    ]
  );
  eventManager.destroy();
  root.remove();
});

test('coherent Pinch recognizes a deliberately anchored pinch after a short delay', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createCoherentManager();

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

test('coherent Pinch does not begin when a delayed condition matures on pointerup', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createCoherentManager();
  eventManager.on('pinch', () => events.push('pinch'));

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 326, y: 250});
  vi.advanceTimersByTime(50);
  dispatchPointerEvent(document.defaultView!, 'pointerup', {pointerId: 1, x: 326, y: 250});

  expect(events, 'pointerup cannot begin a coherent pinch lifecycle').toEqual([]);

  dispatchPointerEvent(document.defaultView!, 'pointerup', {pointerId: 2, x: 450, y: 250});
  eventManager.destroy();
  root.remove();
});

test('coherent Pinch ignores touch transform noise until an intent threshold is crossed', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createCoherentManager();

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

test('coherent Pan and Pinch recover across gestures with reused pointers', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createCoherentManager();

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
  for (const offset of [11, 20, 30]) {
    vi.advanceTimersByTime(30);
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

test('coherent Pan and Pinch preserve trackpad pan and pinch', () => {
  vi.useFakeTimers();
  const {root, eventManager, events} = createCoherentManager({
    trackpad: true,
    panThreshold: 0
  });

  const WheelEvent = root.ownerDocument.defaultView!.WheelEvent;
  root.dispatchEvent(new WheelEvent('wheel', {deltaMode: 0, deltaX: 10}));
  vi.advanceTimersByTime(100);
  root.dispatchEvent(new WheelEvent('wheel', {ctrlKey: true, deltaMode: 0, deltaY: -10}));

  expect(events, 'trackpad pan is inherited').toContain('multipanstart');
  expect(events, 'trackpad pinch is inherited').toContain('pinchstart');

  eventManager.destroy();
  root.remove();
});

test('an ignored trackpad gesture does not reset an active pointer gesture', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const {root, eventManager, events} = createCoherentManager({trackpad: true});

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  vi.advanceTimersByTime(30);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 239});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 239});
  vi.advanceTimersByTime(30);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 230});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 450, y: 230});

  expect(events, 'pointer translation starts pan').toContain('multipanstart');

  const WheelEvent = root.ownerDocument.defaultView!.WheelEvent;
  root.dispatchEvent(new WheelEvent('wheel', {ctrlKey: true, deltaMode: 0, deltaY: -10}));
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 220});

  expect(events, 'the active pointer pan continues').toContain('multipanmove');
  expect(events, 'the overlapping trackpad pinch remains blocked').not.toContain('pinchstart');

  finishGesture(
    [1, 2],
    [
      [350, 220],
      [450, 230]
    ]
  );
  eventManager.destroy();
  root.remove();
});

test('pointer input reports cumulative per-pointer movement and movement time', () => {
  vi.useFakeTimers();
  vi.setSystemTime(100);
  const root = createEventTarget();
  const eventManager = new EventManager(root);
  const inputs: MjolnirGestureEvent[] = [];
  eventManager.on('pointermove', (event) => inputs.push(event as MjolnirGestureEvent));

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 355, y: 250});
  let lastInput = inputs[inputs.length - 1];

  expect(
    lastInput?.distancePerPointer,
    'tracks each pointer from where the pointer set was established'
  ).toEqual([5, 0]);
  expect(lastInput?.movementDeltaTime, 'starts timing on the first movement').toBe(0);

  vi.advanceTimersByTime(40);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 455, y: 250});
  lastInput = inputs[inputs.length - 1];

  expect(lastInput?.distancePerPointer, 'movement remains cumulative').toEqual([5, 5]);
  expect(lastInput?.movementDeltaTime, 'reports time since movement began').toBe(40);

  vi.advanceTimersByTime(10);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 360, y: 250});
  lastInput = inputs[inputs.length - 1];

  expect(lastInput?.distancePerPointer, 'origins stay fixed after every pointer moved').toEqual([
    10, 5
  ]);
  expect(lastInput?.movementDeltaTime, 'the movement timer keeps running').toBe(50);

  vi.advanceTimersByTime(10);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 250});
  lastInput = inputs[inputs.length - 1];
  expect(lastInput?.distancePerPointer, 'distance is displacement, not total path length').toEqual([
    0, 5
  ]);
  expect(lastInput?.movementDeltaTime, 'returning to the origin does not reset time').toBe(60);

  finishGesture(
    [1, 2],
    [
      [350, 250],
      [455, 250]
    ]
  );
  eventManager.destroy();
  root.remove();
});

test('Pan and Pinch retain their default recognition without coherence conditions', () => {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [new Pan({event: 'multipan', pointers: 2, threshold: 10}), new Pinch()]
  });
  const events: string[] = [];
  eventManager.on('pinchstart', () => events.push('pinchstart'));

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 340, y: 250});

  expect(events, 'an unconfigured pinch keeps its existing immediate recognition').toContain(
    'pinchstart'
  );

  finishGesture(
    [1, 2],
    [
      [340, 250],
      [450, 250]
    ]
  );
  eventManager.destroy();
  root.remove();
});

test('pointer movement metrics preserve fractional coordinates', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const root = createEventTarget();
  const eventManager = new EventManager(root);
  const inputs: MjolnirGestureEvent[] = [];
  eventManager.on('pointermove', (event) => inputs.push(event as MjolnirGestureEvent));

  dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350.49, y: 250});
  dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450.49, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 351.01, y: 250});
  vi.advanceTimersByTime(10);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 451.01, y: 250});

  let lastInput = inputs[inputs.length - 1];
  expect(lastInput?.distancePerPointer[0], 'does not round the first pointer origin').toBeCloseTo(
    0.52
  );
  expect(lastInput?.distancePerPointer[1], 'does not round the second pointer origin').toBeCloseTo(
    0.52
  );

  expect(lastInput?.movementDeltaTime, 'subpixel movement starts the timer').toBe(10);

  vi.advanceTimersByTime(10);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 351.53, y: 250});
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 451.53, y: 250});
  lastInput = inputs[inputs.length - 1];

  expect(lastInput?.distancePerPointer[0], 'subpixel updates accumulate to one pixel').toBeCloseTo(
    1.04
  );
  expect(lastInput?.distancePerPointer[1], 'both pointers accumulate displacement').toBeCloseTo(
    1.04
  );

  vi.advanceTimersByTime(10);
  dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 352.05, y: 250});
  lastInput = inputs[inputs.length - 1];
  expect(
    lastInput?.distancePerPointer[0],
    'later movement keeps the original fractional origin'
  ).toBeCloseTo(1.56);
  expect(
    lastInput?.distancePerPointer[1],
    'the stationary pointer retains its displacement'
  ).toBeCloseTo(1.04);
  expect(lastInput?.movementDeltaTime, 'crossing one pixel does not reset time').toBe(30);

  finishGesture(
    [1, 2],
    [
      [352.05, 250],
      [451.53, 250]
    ]
  );
  eventManager.destroy();
  root.remove();
});

test.each([0.25, 2, 4.5])('Pan and Pinch accept a %s pixel per-pointer threshold', (threshold) => {
  for (const gesture of ['pan', 'pinch']) {
    const root = createEventTarget();
    const coherent: InputCoherenceCondition[] = [{distancePerPointer: threshold}];
    const eventManager = new EventManager(root, {
      recognizers: [
        gesture === 'pan' ? new Pan({pointers: 2, threshold: 0, coherent}) : new Pinch({coherent})
      ]
    });
    const events: string[] = [];
    eventManager.on(`${gesture}start`, () => events.push('start'));

    dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350.25, y: 250});
    dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450.25, y: 250});
    const direction = gesture === 'pan' ? 1 : -1;
    dispatchPointerEvent(document.defaultView!, 'pointermove', {
      pointerId: 1,
      x: 350.25 + (direction * threshold) / 2,
      y: 250
    });
    dispatchPointerEvent(document.defaultView!, 'pointermove', {
      pointerId: 2,
      x: 450.25 + threshold / 2,
      y: 250
    });
    expect(events, `${gesture} waits below the configured threshold`).toEqual([]);

    dispatchPointerEvent(document.defaultView!, 'pointermove', {
      pointerId: 1,
      x: 350.25 + direction * threshold,
      y: 250
    });
    expect(events, `${gesture} waits for both pointers to reach the threshold`).toEqual([]);

    dispatchPointerEvent(document.defaultView!, 'pointermove', {
      pointerId: 2,
      x: 450.25 + threshold,
      y: 250
    });
    expect(events, `${gesture} starts at the configured threshold`).toEqual(['start']);

    finishGesture(
      [1, 2],
      [
        [350.25 + direction * threshold, 250],
        [450.25 + threshold, 250]
      ]
    );
    eventManager.destroy();
    root.remove();
  }
});

test.each(['pointerup', 'pointercancel'] as const)(
  'pointer movement resets on addition, %s, and replacement',
  (terminalEvent) => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const root = createEventTarget();
    const eventManager = new EventManager(root);
    const inputs: MjolnirGestureEvent[] = [];
    for (const eventName of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) {
      eventManager.on(eventName, (event) => inputs.push(event as MjolnirGestureEvent));
    }
    const expectMetrics = (distances: number[], time: number) => {
      const lastInput = inputs[inputs.length - 1];
      expect(lastInput?.distancePerPointer).toEqual(distances);
      expect(lastInput?.movementDeltaTime).toBe(time);
    };

    dispatchPointerEvent(root, 'pointerdown', {pointerId: 1, x: 350, y: 250});
    vi.advanceTimersByTime(20);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 350, y: 250});
    expectMetrics([0], 0);
    vi.advanceTimersByTime(20);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 351, y: 250});
    expectMetrics([1], 0);
    vi.advanceTimersByTime(20);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 354, y: 250});
    expectMetrics([4], 20);

    dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 450, y: 250});
    expectMetrics([0, 0], 0);
    vi.advanceTimersByTime(20);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 355, y: 250});
    expectMetrics([1, 0], 0);
    vi.advanceTimersByTime(20);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 452, y: 250});
    expectMetrics([1, 2], 20);

    dispatchPointerEvent(document.defaultView!, terminalEvent, {pointerId: 2, x: 452, y: 250});
    expectMetrics([1, 2], 20);
    vi.advanceTimersByTime(20);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 358, y: 250});
    expectMetrics([3], 0);
    vi.advanceTimersByTime(20);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 359, y: 250});
    expectMetrics([4], 20);

    dispatchPointerEvent(root, 'pointerdown', {pointerId: 2, x: 460, y: 250});
    expectMetrics([0, 0], 0);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 2, x: 462, y: 250});
    vi.advanceTimersByTime(20);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 1, x: 361, y: 250});
    expectMetrics([2, 2], 20);

    dispatchPointerEvent(document.defaultView!, terminalEvent, {pointerId: 2, x: 462, y: 250});
    dispatchPointerEvent(root, 'pointerdown', {pointerId: 3, x: 470, y: 250});
    expectMetrics([0, 0], 0);
    vi.advanceTimersByTime(20);
    dispatchPointerEvent(document.defaultView!, 'pointermove', {pointerId: 3, x: 473, y: 250});
    expectMetrics([0, 3], 0);

    finishGesture(
      [1, 3],
      [
        [361, 250],
        [473, 250]
      ]
    );
    eventManager.destroy();
    root.remove();
  }
);
