// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {EventRegistrar} from 'mjolnir.js/utils/event-registrar';
import {createEventTarget} from '../test-utils/dom';

/* eslint-disable max-statements */
test('EventRegistrar#add, remove', t => {
  const eventRegistrar = new EventRegistrar(null, 'test');
  const handler1 = () => {};
  const handler2 = () => {};
  const handler3 = () => {};
  const handler4 = () => {};

  t.ok(eventRegistrar.handlers, 'event handler is created');
  t.ok(eventRegistrar.isEmpty(), 'event handler is empty');
  t.is(eventRegistrar.handlersByElement.size, 0, 'event elements map is empty');

  eventRegistrar.add('click', handler1);

  t.notOk(eventRegistrar.isEmpty(), 'event handler is not empty');
  t.is(eventRegistrar.handlers.length, 1, 'event handler is added');
  t.deepEquals(
    eventRegistrar.handlers[0],
    {type: 'click', handler: handler1, srcElement: 'root', priority: 0},
    'event handler is added'
  );
  t.deepEquals(
    eventRegistrar.handlersByElement.get('root'),
    [{type: 'click', handler: handler1, srcElement: 'root', priority: 0}],
    'event elements map is updated'
  );

  eventRegistrar.add('click', handler2, {srcElement: 'child-0'});

  t.is(eventRegistrar.handlers.length, 2, 'event handler is added');
  t.deepEquals(
    eventRegistrar.handlers[1],
    {type: 'click', handler: handler2, srcElement: 'child-0', priority: 0},
    'event handler is added'
  );
  t.deepEquals(
    eventRegistrar.handlersByElement.get('child-0'),
    [{type: 'click', handler: handler2, srcElement: 'child-0', priority: 0}],
    'event elements map is updated'
  );

  eventRegistrar.add('click', handler3, {srcElement: 'child-0'}, false, true);
  eventRegistrar.add('click', handler4, {srcElement: 'child-0', priority: 1});

  t.deepEquals(
    eventRegistrar.handlersByElement.get('child-0'),
    [
      {type: 'click', handler: handler4, srcElement: 'child-0', priority: 1},
      {type: 'click', handler: handler2, srcElement: 'child-0', priority: 0},
      {type: 'click', handler: handler3, srcElement: 'child-0', priority: 0, passive: true}
    ],
    'event elements map is updated'
  );

  eventRegistrar.remove('click', handler1);

  t.is(eventRegistrar.handlers.length, 3, 'event handler is removed');
  t.deepEquals(
    eventRegistrar.handlers[0],
    {type: 'click', handler: handler2, srcElement: 'child-0', priority: 0},
    'event handler is removed'
  );
  t.notOk(eventRegistrar.handlersByElement.has('root'), 'event elements map is updated');

  eventRegistrar.remove('click', handler2);
  eventRegistrar.remove('click', handler4);

  t.ok(eventRegistrar.isEmpty(), 'event handler is empty');

  eventRegistrar.remove('click', handler3);

  t.notOk(eventRegistrar.handlersByElement.has('child-0'), 'event elements map is updated');

  t.end();
});

test('EventRegistrar#normalizeEvent', t => {
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

  let normalizedEvent;
  const eventRegistrar = new EventRegistrar({getElement: () => root});
  eventRegistrar.add('foo', evt => {
    normalizedEvent = evt;
  });

  eventRegistrar.handleEvent(eventMock);

  t.is(normalizedEvent.rootElement, root, 'rootElement is set');
  t.ok(normalizedEvent.center, 'center is populated');
  t.ok(normalizedEvent.offsetCenter, 'offsetCenter is populated');
  t.is(normalizedEvent.handled, false, 'event marked as not handled');
  t.is(typeof normalizedEvent.stopPropagation, 'function', 'event.stopPropagation is a function');
  t.is(
    typeof normalizedEvent.stopImmediatePropagation,
    'function',
    'event.stopImmediatePropagation is a function'
  );

  t.end();
});

test('EventRegistrar#propagation', t => {
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
  const eventRegistrar = new EventRegistrar({getElement: () => rootNode});

  t.doesNotThrow(
    () =>
      eventRegistrar.handleEvent({
        type: 'foo',
        srcEvent: {
          target: rootNode
        }
      }),
    'event without handlers'
  );

  const handlerCalls = [];

  const fooHandler =
    (message: string, stopPropagation = false, stopImmediatePropagation = false) =>
    evt => {
      handlerCalls.push(message);
      if (stopPropagation) {
        evt.stopPropagation();
      }
      if (stopImmediatePropagation) {
        evt.stopImmediatePropagation();
      }
    };

  // Should not be called (propagation stopped)
  eventRegistrar.add('foo', fooHandler('foo@root', false, true), 'root', true);
  eventRegistrar.add('foo', fooHandler('foo@root:2'));
  // Should be called
  eventRegistrar.add('foo', fooHandler('foo@child-0', true), {srcElement: childNode});
  eventRegistrar.add(
    'foo',
    fooHandler('foo@grandchild-00'),
    {srcElement: grandchildNodes[0]},
    true
  );
  eventRegistrar.add('foo', fooHandler('foo@child-0:2'), {srcElement: childNode});
  // Should not be called (not on propagation path)
  eventRegistrar.add('foo', fooHandler('foo@grandchild-01'), {srcElement: grandchildNodes[1]});

  eventRegistrar.handleEvent({
    type: 'foo',
    srcEvent: {
      target: grandchildNodes[0]
    }
  });
  t.deepEquals(
    handlerCalls,
    ['foo@grandchild-00', 'foo@child-0', 'foo@child-0:2'],
    'propagated correctly'
  );

  handlerCalls.length = 0; // clean
  eventRegistrar.handleEvent({
    type: 'foo',
    srcEvent: {
      target: grandchildNodes[0]
    }
  });
  t.deepEquals(
    handlerCalls,
    ['foo@child-0', 'foo@child-0:2'],
    'propagated correctly, one-time callback is removed'
  );

  handlerCalls.length = 0; // clean
  eventRegistrar.handleEvent({
    type: 'foo',
    srcEvent: {
      target: rootNode
    }
  });
  t.deepEquals(handlerCalls, ['foo@root'], 'propagated correctly');

  handlerCalls.length = 0; // clean
  eventRegistrar.handleEvent({
    type: 'foo',
    srcEvent: {
      target: rootNode
    }
  });
  t.deepEquals(handlerCalls, ['foo@root:2'], 'propagated correctly, one-time callback is removed');

  t.end();
});
