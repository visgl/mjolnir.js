// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {EventManager, Tap, Pan} from 'mjolnir.js';
import {spy} from './test-utils/spy';
import {createEventTarget} from './test-utils/dom';

test('eventManager#constructor', (t) => {
  const root = createEventTarget();

  let eventManager = new EventManager(root);
  t.ok(eventManager, 'EventManager created');
  t.ok(eventManager.manager, 'Hammer.Manager created');
  t.ok(eventManager.wheelInput, 'WheelInput created');
  t.ok(eventManager.moveInput, 'MoveInput created');
  t.ok(eventManager.keyInput, 'MoveInput created');
  t.notOk(eventManager.events.size, 'No events are registered');
  eventManager.destroy();

  eventManager = new EventManager(root, {
    events: {foo: () => {}},
    recognizers: [new Tap()]
  });
  t.ok(eventManager.events.size, 'No events are registered');
  eventManager.destroy();

  // construct without element
  eventManager = new EventManager(null, {
    recognizers: [new Tap()]
  });
  t.ok(eventManager, 'EventManager created');
  t.notOk(eventManager.manager, 'Hammer.Manager should not be created');
  t.doesNotThrow(() => eventManager.on('tap', () => {}), 'eventManager.on() does not throw');
  t.doesNotThrow(() => eventManager.off('tap', () => {}), 'eventManager.off() does not throw');
  eventManager.destroy();

  root.remove();
  t.end();
});

test('eventManager#destroy', (t) => {
  const root = createEventTarget();
  const eventManager = new EventManager(root);
  const {manager, moveInput, wheelInput, keyInput} = eventManager;

  spy(manager, 'destroy');
  spy(moveInput, 'destroy');
  spy(wheelInput, 'destroy');
  spy(keyInput, 'destroy');
  eventManager.destroy();

  t.equal(manager.destroy.callCount, 1, 'Manager.destroy() should be called once');
  t.equal(moveInput.destroy.callCount, 1, 'MoveInput.destroy() should be called once');
  t.equal(wheelInput.destroy.callCount, 1, 'WheelInput.destroy() should be called once');
  t.equal(keyInput.destroy.callCount, 1, 'KeyInput.destroy() should be called once');

  t.doesNotThrow(
    () => eventManager.destroy(),
    'EventManager does not throw error on destroyed twice'
  );

  const emptyEventManager = new EventManager();
  emptyEventManager.destroy();
  t.doesNotThrow(
    () => emptyEventManager.destroy(),
    'EventManager without elements can be destroyed'
  );

  root.remove();
  t.end();
});

test('eventManager#on', (t) => {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [new Tap({event: 'click'}), new Tap({event: 'dblclick', taps: 2})]
  });
  const toggleRecSpy = spy(eventManager, '_toggleRecognizer');

  eventManager.on('dblclick', () => {});
  t.ok(eventManager.events.get('dblclick'), 'event dblclick is registered');
  t.equal(
    toggleRecSpy.callCount,
    1,
    '_toggleRecognizer should be called once when passing a single event and handler'
  );

  toggleRecSpy.reset();
  eventManager.on({
    click: () => {},
    dblclick: () => {}
  });
  t.equal(
    toggleRecSpy.callCount,
    2,
    '_toggleRecognizer should be called once for each entry in an event:handler map'
  );

  eventManager.destroy();
  root.remove();
  t.end();
});

test('eventManager#watch', (t) => {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [new Tap({event: 'click'}), new Tap({event: 'dblclick', taps: 2})]
  });
  const toggleRecSpy = spy(eventManager, '_toggleRecognizer');

  eventManager.watch('dblclick', () => {});
  t.equal(toggleRecSpy.callCount, 0, '_toggleRecognizer should not be called for passive handler');

  eventManager.destroy();
  root.remove();
  t.end();
});

test('eventManager#once', (t) => {
  const root = createEventTarget();
  const eventManager = new EventManager(root, {
    recognizers: [new Tap({event: 'click'}), new Tap({event: 'dblclick', taps: 2})]
  });
  const toggleRecSpy = spy(eventManager, '_toggleRecognizer');

  eventManager.once('dblclick', () => {});
  t.ok(eventManager.events.get('dblclick'), 'event doubletap is registered');
  t.equal(
    toggleRecSpy.callCount,
    1,
    '_toggleRecognizer should be called once when passing a single event and handler'
  );

  toggleRecSpy.reset();
  eventManager.once({
    click: () => {},
    dblclick: () => {}
  });
  t.equal(
    toggleRecSpy.callCount,
    2,
    '_toggleRecognizer should be called once for each entry in an event:handler map'
  );

  eventManager.destroy();
  root.remove();
  t.end();
});

test('eventManager#off', (t) => {
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

  const toggleRecSpy = spy(eventManager, '_toggleRecognizer');

  eventManager.off('foo', handler1);
  t.equal(
    toggleRecSpy.callCount,
    0,
    '_toggleRecognizer should not be called on an unrecognized event'
  );

  eventManager.off('panstart', handler1);
  t.equal(
    toggleRecSpy.callCount,
    0,
    '_toggleRecognizer should not be called on an event that still has handlers'
  );
  eventManager.off('panmove', handler2);
  t.equal(
    toggleRecSpy.callCount,
    1,
    '_toggleRecognizer should be called on an event that no longer has handlers'
  );

  toggleRecSpy.reset();
  eventManager.off({
    click: handler1,
    dblclick: handler1
  });
  t.equal(
    toggleRecSpy.callCount,
    1,
    '_toggleRecognizer should be called once for each event that has no more handlers'
  );
  toggleRecSpy.reset();
  eventManager.off({
    click: handler2
  });
  t.equal(
    toggleRecSpy.callCount,
    1,
    '_toggleRecognizer should be called once for each event that has no more handlers'
  );

  eventManager.destroy();
  root.remove();
  t.end();
});

test('eventManager#eventHandling', (t) => {
  const root = createEventTarget();
  const eventMock = {type: 'foo'};
  const eventManager = new EventManager(root);
  const emitSpy = spy(eventManager.manager, 'emit');

  eventManager._onOtherEvent(eventMock);
  t.ok(emitSpy.called, 'manager.emit() should be called from _onOtherEvent()...');

  eventManager.destroy();
  root.remove();
  t.end();
});

test('eventManager#normalizeEvent', (t) => {
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

  t.is(normalizedEvent.rootElement, root, 'rootElement is set');
  t.ok(normalizedEvent.center, 'center is populated');
  t.ok(normalizedEvent.offsetCenter, 'offsetCenter is populated');
  t.is(normalizedEvent.handled, false, 'event marked as not handled');

  eventManager.destroy();
  root.remove();
  t.end();
});

test('eventManager#propagation', (t) => {
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
  eventManager.on('foo', fooHandler('foo@child-0', true), {srcElement: childNode});
  eventManager.on('foo', fooHandler('foo@grandchild-00'), {srcElement: grandchildNodes[0]});
  // Should not be called (not on propagation path)
  eventManager.on('foo', fooHandler('foo@grandchild-01'), {srcElement: grandchildNodes[1]});

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

  t.deepEquals(
    handlerCalls,
    ['foo@grandchild-00', 'foo@child-0', 'foo@child-0:2'],
    'propagated correctly'
  );
  t.end();
});
