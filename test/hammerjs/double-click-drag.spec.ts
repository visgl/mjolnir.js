// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {DoubleClickDrag} from 'mjolnir.js';
import {InputEvent, RecognizerState} from '../../src/hammerjs/index';

import type {HammerInput, Point} from '../../src/hammerjs/input/types';

type EmittedEvent = {
  name: string;
  input: HammerInput;
};

function createRecognizer() {
  const recognizer = new DoubleClickDrag();
  const events: EmittedEvent[] = [];

  recognizer.manager = {
    emit: (name: string, input: HammerInput) => events.push({name, input}),
    touchAction: {update: () => {}}
  } as any;

  return {recognizer, events};
}

function createInput({
  eventType,
  center,
  timeStamp,
  deltaTime = 0,
  deltaX = 0,
  deltaY = 0,
  distance = Math.hypot(deltaX, deltaY),
  pointerId = 1
}: {
  eventType: InputEvent;
  center: Point;
  timeStamp: number;
  deltaTime?: number;
  deltaX?: number;
  deltaY?: number;
  distance?: number;
  pointerId?: number;
}): HammerInput {
  const srcEvent = {
    clientX: center.x,
    clientY: center.y,
    pointerId,
    pointerType: 'mouse'
  } as PointerEvent;

  return {
    pointers: [srcEvent],
    changedPointers: [srcEvent],
    pointerType: 'mouse',
    srcEvent,
    eventType,
    timeStamp,
    deltaTime,
    center,
    deltaX,
    deltaY,
    angle: 0,
    distance,
    scale: 1,
    rotation: 0,
    direction: 0,
    offsetDirection: 0,
    velocity: 0,
    velocityX: 0,
    velocityY: 0,
    overallVelocity: 0,
    overallVelocityX: 0,
    overallVelocityY: 0,
    maxPointers: 1,
    target: document.body,
    additionalEvent: ''
  };
}

test('DoubleClickDrag emits start/move/end after a valid second-tap drag', (t) => {
  const {recognizer, events} = createRecognizer();

  recognizer.recognize(
    createInput({eventType: InputEvent.Start, center: {x: 10, y: 20}, timeStamp: 0})
  );
  recognizer.recognize(
    createInput({
      eventType: InputEvent.End,
      center: {x: 10, y: 20},
      timeStamp: 100,
      deltaTime: 100
    })
  );

  recognizer.recognize(
    createInput({eventType: InputEvent.Start, center: {x: 12, y: 22}, timeStamp: 250})
  );
  recognizer.recognize(
    createInput({
      eventType: InputEvent.Move,
      center: {x: 12, y: 21.5},
      timeStamp: 260,
      deltaTime: 10,
      deltaY: -0.5,
      distance: 0.5
    })
  );
  t.deepEqual(events, [], 'drag remains silent until the threshold is crossed');

  recognizer.recognize(
    createInput({
      eventType: InputEvent.Move,
      center: {x: 12, y: 10},
      timeStamp: 280,
      deltaTime: 30,
      deltaY: -12,
      distance: 12
    })
  );
  recognizer.recognize(
    createInput({
      eventType: InputEvent.Move,
      center: {x: 12, y: 2},
      timeStamp: 300,
      deltaTime: 50,
      deltaY: -20,
      distance: 20
    })
  );
  recognizer.recognize(
    createInput({
      eventType: InputEvent.End,
      center: {x: 12, y: 2},
      timeStamp: 320,
      deltaTime: 70,
      deltaY: -20,
      distance: 20
    })
  );

  t.deepEqual(
    events.map((event) => event.name),
    [
      'doubleclickdragstart',
      'doubleclickdrag',
      'doubleclickdragmove',
      'doubleclickdrag',
      'doubleclickdrag',
      'doubleclickdragend'
    ],
    'drag emits the full lifecycle once active'
  );
  t.equal(recognizer.state, RecognizerState.Ended, 'recognizer ends after pointer up');
  t.ok(events[0].input.scale > 1, 'emitted event includes the computed zoom scale');
  t.end();
});

test('DoubleClickDrag fails if the second tap is released before dragging starts', (t) => {
  const {recognizer, events} = createRecognizer();

  recognizer.recognize(
    createInput({eventType: InputEvent.Start, center: {x: 0, y: 0}, timeStamp: 0})
  );
  recognizer.recognize(
    createInput({eventType: InputEvent.End, center: {x: 0, y: 0}, timeStamp: 80, deltaTime: 80})
  );
  recognizer.recognize(
    createInput({eventType: InputEvent.Start, center: {x: 1, y: 1}, timeStamp: 160})
  );
  recognizer.recognize(
    createInput({eventType: InputEvent.End, center: {x: 1, y: 1}, timeStamp: 220, deltaTime: 60})
  );

  t.deepEqual(events, [], 'no gesture events are emitted without an active drag');
  t.equal(recognizer.state, RecognizerState.Failed, 'recognizer fails cleanly');
  t.end();
});

test('DoubleClickDrag ignores taps that are outside the recognition interval', (t) => {
  const {recognizer, events} = createRecognizer();

  recognizer.recognize(
    createInput({eventType: InputEvent.Start, center: {x: 5, y: 5}, timeStamp: 0})
  );
  recognizer.recognize(
    createInput({eventType: InputEvent.End, center: {x: 5, y: 5}, timeStamp: 100, deltaTime: 100})
  );
  recognizer.recognize(
    createInput({eventType: InputEvent.Start, center: {x: 5, y: 5}, timeStamp: 700})
  );
  recognizer.recognize(
    createInput({
      eventType: InputEvent.Move,
      center: {x: 5, y: -50},
      timeStamp: 720,
      deltaTime: 20,
      deltaY: -55,
      distance: 55
    })
  );

  t.deepEqual(events, [], 'late taps do not activate the drag recognizer');
  t.equal(recognizer.state, RecognizerState.Failed, 'recognizer remains failed');
  t.end();
});
