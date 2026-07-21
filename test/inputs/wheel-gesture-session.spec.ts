// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {InputEvent} from 'mjolnir.js';
import {
  WheelGestureSession,
  type WheelGestureSessionEvent
} from 'mjolnir.js/inputs/wheel-gesture-session';
import {spy} from '../test-utils/spy';
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

test('WheelGestureSession#passive listener lifecycle', (t) => {
  const element = createEventTarget();
  const addELSpy = spy(element, 'addEventListener');
  const removeELSpy = spy(element, 'removeEventListener');
  const session = new WheelGestureSession(element);

  t.equal(addELSpy.callCount, 1, 'registers the passive wheel listener immediately');

  const unsubscribe = session.on(() => {});
  unsubscribe();
  t.equal(removeELSpy.callCount, 0, 'keeps the passive wheel listener without subscribers');

  session.destroy();
  t.equal(removeELSpy.callCount, 1, 'removes the passive wheel listener when destroyed');

  element.remove();
  t.end();
});

test('WheelGestureSession#disabled without subscribers', async (t) => {
  const session = createSession();
  const event = createWheelEvent({deltaY: 1});

  t.equal(session.handleEvent(event), 'unknown', 'does not classify without subscribers');
  t.equal(event.preventDefaultCallCount, 0, 'does not prevent the default behavior');

  await wait(TEST_END_DELAY + 5);
  t.equal(session.device, 'unknown', 'does not start a session');
});

test('WheelGestureSession#trackpad pinch lifecycle', async (t) => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  session.on((event) => events.push(event));

  const wheelEvent = createWheelEvent({
    ctrlKey: true,
    deltaY: -2,
    timeStamp: 10
  });
  t.equal(session.handleEvent(wheelEvent), 'trackpad', 'classifies pinch immediately');
  t.deepEquals(
    events.map((event) => event.eventType),
    [InputEvent.Start, InputEvent.Move],
    'starts a continuous session'
  );
  t.equal(events[0].deltaY, 0, 'start has no accumulated movement');
  t.equal(events[0].isFirst, true, 'marks start as the first input');
  t.equal(events[1].deltaY, -2, 'reports accumulated movement');
  t.equal(wheelEvent.preventDefaultCallCount, 0, 'does not prevent default');

  await wait(TEST_END_DELAY + 5);
  t.deepEquals(
    events.map((event) => event.eventType),
    [InputEvent.Start, InputEvent.Move, InputEvent.End],
    'ends after inactivity'
  );
  t.equal(events[2].isFinal, true, 'marks end as the final input');
  t.equal(session.device, 'unknown', 'resets classification after ending');
});

test('WheelGestureSession#physical Control key', async (t) => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  const unsubscribe = session.on((event) => events.push(event));

  const eventWindow = document.defaultView!;
  eventWindow.dispatchEvent(
    new eventWindow.KeyboardEvent('keydown', {code: 'ControlLeft', key: 'Control'})
  );
  t.equal(
    session.handleEvent(createWheelEvent({ctrlKey: true, deltaY: -2, timeStamp: 10})),
    'unknown',
    'does not treat physical Control+wheel as an immediate pinch'
  );

  await wait(TEST_CLASSIFICATION_DELAY + 5);
  t.equal(events[0].device, 'mouse', 'classifies physical Control+wheel as mouse');

  eventWindow.dispatchEvent(
    new eventWindow.KeyboardEvent('keyup', {code: 'ControlLeft', key: 'Control'})
  );
  unsubscribe();
});

test('WheelGestureSession#rapid vertical trackpad sequence', (t) => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  session.on((event) => events.push(event));

  t.equal(
    session.handleEvent(createWheelEvent({deltaY: 2, timeStamp: 10})),
    'unknown',
    'first ambiguous event remains unknown'
  );
  t.equal(
    session.handleEvent(createWheelEvent({deltaY: 3, timeStamp: 20})),
    'trackpad',
    'classifies a rapid sequence of small deltas as trackpad'
  );
  t.deepEquals(
    events.map((event) => event.eventType),
    [InputEvent.Start, InputEvent.Move],
    'replays buffered movement as one move'
  );
  t.equal(events[1].deltaY, 5, 'aggregates buffered deltas');
  t.equal(events[1].velocityY, 0.5, 'calculates interval velocity');
  t.equal(events[1].overallVelocityY, 0.5, 'calculates overall velocity');
  session.destroy();
  t.end();
});

test('WheelGestureSession#mouse classification', (t) => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  session.on((event) => events.push(event));

  const wheelEvent = createWheelEvent({
    deltaMode: 1,
    deltaY: 3,
    timeStamp: 10
  });
  t.equal(session.handleEvent(wheelEvent), 'mouse', 'classifies line deltas as mouse');
  t.equal(wheelEvent.preventDefaultCallCount, 0, 'does not prevent default');
  t.equal(events[1].deltaY, 120, 'normalizes line deltas');
  session.destroy();
  t.end();
});

test('WheelGestureSession#unsubscribe', async (t) => {
  const events: WheelGestureSessionEvent[] = [];
  const session = createSession();
  const unsubscribe = session.on((event) => events.push(event));

  session.handleEvent(createWheelEvent({deltaY: 1}));
  unsubscribe();
  t.notOk(session.hasSubscribers, 'removes subscriber');

  await wait(TEST_END_DELAY + 5);
  t.deepEquals(events, [], 'discards pending classification');
  t.equal(session.device, 'unknown', 'resets pending state');
});
