// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {expect, test, vi} from 'vitest';
import {InputEvent} from 'mjolnir.js';
import {
  WheelGestureSession,
  type WheelGestureSessionEvent
} from 'mjolnir.js/inputs/wheel-gesture-session';
import {createEventTarget} from '../test-utils/dom';

const TEST_CLASSIFICATION_DELAY = 5;
const TEST_END_DELAY = 20;

function createSession(): WheelGestureSession {
  return new WheelGestureSession(createEventTarget(), {
    classificationDelay: TEST_CLASSIFICATION_DELAY,
    endDelay: TEST_END_DELAY
  });
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds));
}

type WheelEventMock = WheelEvent & {
  preventDefaultCallCount: number;
};

function createWheelEvent(
  options: Partial<
    Pick<
      WheelEvent,
      | 'cancelable'
      | 'clientX'
      | 'clientY'
      | 'ctrlKey'
      | 'deltaMode'
      | 'deltaX'
      | 'deltaY'
      | 'timeStamp'
    >
  > = {}
): WheelEventMock {
  const event = {
    cancelable: true,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    deltaMode: 0,
    deltaX: 0,
    deltaY: 0,
    timeStamp: 0,
    preventDefaultCallCount: 0,
    preventDefault() {
      this.preventDefaultCallCount++;
    },
    ...options
  };
  return event as WheelEventMock;
}

test('WheelGestureSession#passive listener lifecycle', () => {
  const element = createEventTarget();
  const addELSpy = vi.spyOn(element, 'addEventListener');
  const removeELSpy = vi.spyOn(element, 'removeEventListener');
  const session = new WheelGestureSession(element);

  expect(addELSpy, 'registers the passive wheel listener immediately').toHaveBeenCalledTimes(1);

  const unsubscribe = session.on(() => {});
  unsubscribe();
  expect(removeELSpy, 'keeps the passive wheel listener without subscribers').toHaveBeenCalledTimes(
    0
  );

  session.destroy();
  expect(removeELSpy, 'removes the passive wheel listener when destroyed').toHaveBeenCalledTimes(1);

  element.remove();
});

test('WheelGestureSession#disabled without subscribers', async () => {
  const session = createSession();
  const event = createWheelEvent({deltaY: 1});

  expect(session.handleEvent(event), 'does not classify without subscribers').toBe('unknown');
  expect(event.preventDefaultCallCount, 'does not prevent the default behavior').toBe(0);

  await wait(TEST_END_DELAY + 5);
  expect(session.device, 'does not start a session').toBe('unknown');
});

test('WheelGestureSession#trackpad pinch lifecycle', async () => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  session.on((event) => events.push(event));

  const wheelEvent = createWheelEvent({
    ctrlKey: true,
    deltaY: -2,
    timeStamp: 10
  });
  expect(session.handleEvent(wheelEvent), 'classifies pinch immediately').toBe('trackpad');
  expect(
    events.map((event) => event.eventType),
    'starts a continuous session'
  ).toEqual([InputEvent.Start, InputEvent.Move]);
  expect(events[0].deltaY, 'start has no accumulated movement').toBe(0);
  expect(events[0].isFirst, 'marks start as the first input').toBe(true);
  expect(events[1].deltaY, 'reports accumulated movement').toBe(-2);
  expect(wheelEvent.preventDefaultCallCount, 'does not prevent default').toBe(0);

  await wait(TEST_END_DELAY + 5);
  expect(
    events.map((event) => event.eventType),
    'ends after inactivity'
  ).toEqual([InputEvent.Start, InputEvent.Move, InputEvent.End]);
  expect(events[2].isFinal, 'marks end as the final input').toBe(true);
  expect(session.device, 'resets classification after ending').toBe('unknown');
});

test('WheelGestureSession#physical Control key', async () => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  const unsubscribe = session.on((event) => events.push(event));

  const eventWindow = document.defaultView!;
  eventWindow.dispatchEvent(
    new eventWindow.KeyboardEvent('keydown', {code: 'ControlLeft', key: 'Control'})
  );
  expect(
    session.handleEvent(createWheelEvent({ctrlKey: true, deltaY: -2, timeStamp: 10})),
    'does not treat physical Control+wheel as an immediate pinch'
  ).toBe('unknown');

  await wait(TEST_CLASSIFICATION_DELAY + 5);
  expect(events[0].device, 'classifies physical Control+wheel as mouse').toBe('mouse');

  eventWindow.dispatchEvent(
    new eventWindow.KeyboardEvent('keyup', {code: 'ControlLeft', key: 'Control'})
  );
  unsubscribe();
});

test('WheelGestureSession#rapid vertical trackpad sequence', () => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  session.on((event) => events.push(event));

  expect(
    session.handleEvent(createWheelEvent({deltaY: 2, timeStamp: 10})),
    'first ambiguous event remains unknown'
  ).toBe('unknown');
  expect(
    session.handleEvent(createWheelEvent({deltaY: 3, timeStamp: 20})),
    'classifies a rapid sequence of small deltas as trackpad'
  ).toBe('trackpad');
  expect(
    events.map((event) => event.eventType),
    'replays buffered movement as one move'
  ).toEqual([InputEvent.Start, InputEvent.Move]);
  expect(events[1].deltaY, 'aggregates buffered deltas').toBe(5);
  expect(events[1].velocityY, 'calculates interval velocity').toBe(0.5);
  expect(events[1].overallVelocityY, 'calculates overall velocity').toBe(0.5);
  session.destroy();
});

test('WheelGestureSession#mouse classification', () => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  session.on((event) => events.push(event));

  const wheelEvent = createWheelEvent({
    deltaMode: 1,
    deltaY: 3,
    timeStamp: 10
  });
  expect(session.handleEvent(wheelEvent), 'classifies line deltas as mouse').toBe('mouse');
  expect(wheelEvent.preventDefaultCallCount, 'does not prevent default').toBe(0);
  expect(events[1].deltaY, 'normalizes line deltas').toBe(120);
  session.destroy();
});

test('WheelGestureSession#unsubscribe', async () => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  const unsubscribe = session.on((event) => events.push(event));

  session.handleEvent(createWheelEvent({deltaY: 1}));
  unsubscribe();
  expect(session.hasSubscribers, 'removes subscriber').toBeFalsy();

  await wait(TEST_END_DELAY + 5);
  expect(events, 'discards pending classification').toEqual([]);
  expect(session.device, 'resets pending state').toBe('unknown');
});
