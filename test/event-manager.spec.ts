// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {expect, test, vi} from 'vitest';
import {EventManager, Tap, Pan} from 'mjolnir.js';
import {createEventTarget} from './test-utils/dom';

test('eventManager#constructor', () => {
  const root = createEventTarget();

  let eventManager = new EventManager(root);
  expect(eventManager, 'EventManager created').toBeTruthy();
  expect(eventManager.manager, 'Hammer.Manager created').toBeTruthy();
  expect(eventManager.wheelSession, 'WheelGestureSession created').toBeTruthy();
  expect(eventManager.wheelInput, 'WheelInput created').toBeTruthy();
  expect(
    eventManager.wheelInput.options.wheelSession,
    'WheelInput uses the shared WheelGestureSession'
  ).toBe(eventManager.wheelSession);
  expect(eventManager.moveInput, 'MoveInput created').toBeTruthy();
  expect(eventManager.keyInput, 'MoveInput created').toBeTruthy();
  expect(eventManager.events.size, 'No events are registered').toBeFalsy();
  eventManager.destroy();

  eventManager = new EventManager(root, {
    events: {foo: () => {}},
    recognizers: [new Tap()]
  });
  expect(eventManager.events.size, 'No events are registered').toBeTruthy();
  eventManager.destroy();

  // construct without element
  eventManager = new EventManager(null, {
    recognizers: [new Tap()]
  });
  expect(eventManager, 'EventManager created').toBeTruthy();
  expect(eventManager.manager, 'Hammer.Manager should not be created').toBeFalsy();
  expect(() => eventManager.on('tap', () => {}), 'eventManager.on() does not throw').not.toThrow();
  expect(
    () => eventManager.off('tap', () => {}),
    'eventManager.off() does not throw'
  ).not.toThrow();
  eventManager.destroy();

  root.remove();
});

test('eventManager#destroy', () => {
  const root = createEventTarget();
  const eventManager = new EventManager(root);
  const {manager, moveInput, wheelInput, wheelSession, keyInput} = eventManager;

  vi.spyOn(manager, 'destroy');
  vi.spyOn(moveInput, 'destroy');
  vi.spyOn(wheelInput, 'destroy');
  vi.spyOn(wheelSession, 'destroy');
  vi.spyOn(keyInput, 'destroy');
  eventManager.destroy();

  expect(manager.destroy, 'Manager.destroy() should be called once').toHaveBeenCalledTimes(1);
  expect(moveInput.destroy, 'MoveInput.destroy() should be called once').toHaveBeenCalledTimes(1);
  expect(wheelInput.destroy, 'WheelInput.destroy() should be called once').toHaveBeenCalledTimes(1);
  expect(
    wheelSession.destroy,
    'WheelGestureSession.destroy() should be called once'
  ).toHaveBeenCalledTimes(1);
  expect(keyInput.destroy, 'KeyInput.destroy() should be called once').toHaveBeenCalledTimes(1);

  expect(
    () => eventManager.destroy(),
    'EventManager does not throw error on destroyed twice'
  ).not.toThrow();

  const emptyEventManager = new EventManager();
  emptyEventManager.destroy();
  expect(
    () => emptyEventManager.destroy(),
    'EventManager without elements can be destroyed'
  ).not.toThrow();

  root.remove();
});

test('eventManager#on', () => {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [new Tap({event: 'click'}), new Tap({event: 'dblclick', taps: 2})]
  });
  const toggleRecSpy = vi.spyOn(eventManager, '_toggleRecognizer');

  eventManager.on('dblclick', () => {});
  expect(eventManager.events.get('dblclick'), 'event dblclick is registered').toBeTruthy();
  expect(
    toggleRecSpy,
    '_toggleRecognizer should be called once when passing a single event and handler'
  ).toHaveBeenCalledTimes(1);

  toggleRecSpy.mockClear();
  eventManager.on({
    click: () => {},
    dblclick: () => {}
  });
  expect(
    toggleRecSpy,
    '_toggleRecognizer should be called once for each entry in an event:handler map'
  ).toHaveBeenCalledTimes(2);

  eventManager.destroy();
  root.remove();
});

test('eventManager#watch', () => {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [new Tap({event: 'click'}), new Tap({event: 'dblclick', taps: 2})]
  });
  const toggleRecSpy = vi.spyOn(eventManager, '_toggleRecognizer');

  eventManager.watch('dblclick', () => {});
  expect(
    toggleRecSpy,
    '_toggleRecognizer should not be called for passive handler'
  ).toHaveBeenCalledTimes(0);

  eventManager.destroy();
  root.remove();
});

test('eventManager#once', () => {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [new Tap({event: 'click'}), new Tap({event: 'dblclick', taps: 2})]
  });
  const toggleRecSpy = vi.spyOn(eventManager, '_toggleRecognizer');

  eventManager.once('dblclick', () => {});
  expect(eventManager.events.get('dblclick'), 'event doubletap is registered').toBeTruthy();
  expect(
    toggleRecSpy,
    '_toggleRecognizer should be called once when passing a single event and handler'
  ).toHaveBeenCalledTimes(1);

  toggleRecSpy.mockClear();
  eventManager.once({
    click: () => {},
    dblclick: () => {}
  });
  expect(
    toggleRecSpy,
    '_toggleRecognizer should be called once for each entry in an event:handler map'
  ).toHaveBeenCalledTimes(2);

  eventManager.destroy();
  root.remove();
});

test('eventManager#off', () => {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [new Tap({event: 'click'}), new Tap({event: 'dblclick', taps: 2}), new Pan()]
  });

  const handler1 = () => {};
  const handler2 = () => {};

  eventManager.on('click', handler1);
  eventManager.on('click', handler2);
  eventManager.on('dblclick', handler1);
  eventManager.on('panstart', handler1);
  eventManager.on('panmove', handler2);

  const toggleRecSpy = vi.spyOn(eventManager, '_toggleRecognizer');

  eventManager.off('foo', handler1);
  expect(
    toggleRecSpy,
    '_toggleRecognizer should not be called on an unrecognized event'
  ).toHaveBeenCalledTimes(0);

  eventManager.off('panstart', handler1);
  expect(
    toggleRecSpy,
    '_toggleRecognizer should not be called on an event that still has handlers'
  ).toHaveBeenCalledTimes(0);
  eventManager.off('panmove', handler2);
  expect(
    toggleRecSpy,
    '_toggleRecognizer should be called on an event that no longer has handlers'
  ).toHaveBeenCalledTimes(1);

  toggleRecSpy.mockClear();
  eventManager.off({
    click: handler1,
    dblclick: handler1
  });
  expect(
    toggleRecSpy,
    '_toggleRecognizer should be called once for each event that has no more handlers'
  ).toHaveBeenCalledTimes(1);
  toggleRecSpy.mockClear();
  eventManager.off({
    click: handler2
  });
  expect(
    toggleRecSpy,
    '_toggleRecognizer should be called once for each event that has no more handlers'
  ).toHaveBeenCalledTimes(1);

  eventManager.destroy();
  root.remove();
});

test('eventManager#eventHandling', () => {
  const root = createEventTarget();
  const eventMock = {type: 'foo'};
  const eventManager = new EventManager(root);
  const emitSpy = vi.spyOn(eventManager.manager, 'emit');

  eventManager._onOtherEvent(eventMock);
  expect(emitSpy, 'manager.emit() should be called from _onOtherEvent()...').toHaveBeenCalled();

  eventManager.destroy();
  root.remove();
});

test('eventManager#normalizeEvent', () => {
  const root = createEventTarget();
  const eventMock = {
    type: 'foo',
    center: {x: 0, y: 0},
    srcEvent: {
      clientX: 0,
      clientY: 0,
      target: {}
    }
  };
  const eventManager = new EventManager(root);

  let normalizedEvent;

  eventManager.on('foo', (evt) => {
    normalizedEvent = evt;
  });

  eventManager._onOtherEvent(eventMock);

  expect(normalizedEvent.rootElement, 'rootElement is set').toBe(root);
  expect(normalizedEvent.center, 'center is populated').toBeTruthy();
  expect(normalizedEvent.offsetCenter, 'offsetCenter is populated').toBeTruthy();
  expect(normalizedEvent.handled, 'event marked as not handled').toBe(false);

  eventManager.destroy();
  root.remove();
});

test('eventManager#propagation', () => {
  const rootNode = createEventTarget({
    id: 'root',
    children: [
      {
        id: 'child-0',
        children: [{id: 'grandchild-00'}, {id: 'grandchild-01'}]
      },
      {id: 'child-1'}
    ]
  });
  const childNode = rootNode.children[0] as HTMLDivElement;
  const grandchildNodes = Array.from(childNode.children) as HTMLDivElement[];
  const eventManager = new EventManager(rootNode);

  const handlerCalls = [];

  const fooHandler =
    (message: string, stopPropagation = false) =>
    (evt) => {
      handlerCalls.push(message);
      if (stopPropagation) {
        evt.stopPropagation();
      }
    };

  // Should not be called (propagation stopped)
  eventManager.on('foo', fooHandler('foo@root'), {srcElement: rootNode});
  // Should be called
  eventManager.on('foo', fooHandler('foo@child-0', true), {
    srcElement: childNode
  });
  eventManager.on('foo', fooHandler('foo@grandchild-00'), {
    srcElement: grandchildNodes[0]
  });
  // Should not be called (not on propagation path)
  eventManager.on('foo', fooHandler('foo@grandchild-01'), {
    srcElement: grandchildNodes[1]
  });

  eventManager.on(
    {
      // Should be called
      foo: fooHandler('foo@child-0:2'),
      // Should not be called (wrong event type)
      bar: fooHandler('bar@child-0')
    },
    {srcElement: childNode}
  );

  const eventMock = {
    type: 'foo',
    srcEvent: {
      target: grandchildNodes[0]
    }
  };
  eventManager._onOtherEvent(eventMock);

  expect(handlerCalls, 'propagated correctly').toEqual([
    'foo@grandchild-00',
    'foo@child-0',
    'foo@child-0:2'
  ]);
});
