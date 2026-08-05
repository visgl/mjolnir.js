// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {expect, test} from 'vitest';
import {EventRegistrar} from 'mjolnir.js/utils/event-registrar';
import {createEventTarget} from '../test-utils/dom';

/* eslint-disable max-statements */
test('EventRegistrar#add, remove', () => {
  const eventRegistrar = new EventRegistrar(null, 'test');
  const handler1 = () => {};
  const handler2 = () => {};
  const handler3 = () => {};
  const handler4 = () => {};

  expect(eventRegistrar.handlers, 'event handler is created').toBeTruthy();
  expect(eventRegistrar.isEmpty(), 'event handler is empty').toBeTruthy();
  expect(eventRegistrar.handlersByElement.size, 'event elements map is empty').toBe(0);

  eventRegistrar.add('click', handler1);

  expect(eventRegistrar.isEmpty(), 'event handler is not empty').toBeFalsy();
  expect(eventRegistrar.handlers.length, 'event handler is added').toBe(1);
  expect(eventRegistrar.handlers[0], 'event handler is added').toEqual({
    type: 'click',
    handler: handler1,
    srcElement: 'root',
    priority: 0
  });
  expect(eventRegistrar.handlersByElement.get('root'), 'event elements map is updated').toEqual([
    {type: 'click', handler: handler1, srcElement: 'root', priority: 0}
  ]);

  eventRegistrar.add('click', handler2, {srcElement: 'child-0'});

  expect(eventRegistrar.handlers.length, 'event handler is added').toBe(2);
  expect(eventRegistrar.handlers[1], 'event handler is added').toEqual({
    type: 'click',
    handler: handler2,
    srcElement: 'child-0',
    priority: 0
  });
  expect(eventRegistrar.handlersByElement.get('child-0'), 'event elements map is updated').toEqual([
    {type: 'click', handler: handler2, srcElement: 'child-0', priority: 0}
  ]);

  eventRegistrar.add('click', handler3, {srcElement: 'child-0'}, false, true);
  eventRegistrar.add('click', handler4, {srcElement: 'child-0', priority: 1});

  expect(eventRegistrar.handlersByElement.get('child-0'), 'event elements map is updated').toEqual([
    {type: 'click', handler: handler4, srcElement: 'child-0', priority: 1},
    {type: 'click', handler: handler2, srcElement: 'child-0', priority: 0},
    {type: 'click', handler: handler3, srcElement: 'child-0', priority: 0, passive: true}
  ]);

  eventRegistrar.remove('click', handler1);

  expect(eventRegistrar.handlers.length, 'event handler is removed').toBe(3);
  expect(eventRegistrar.handlers[0], 'event handler is removed').toEqual({
    type: 'click',
    handler: handler2,
    srcElement: 'child-0',
    priority: 0
  });
  expect(eventRegistrar.handlersByElement.has('root'), 'event elements map is updated').toBeFalsy();

  eventRegistrar.remove('click', handler2);
  eventRegistrar.remove('click', handler4);

  expect(eventRegistrar.isEmpty(), 'event handler is empty').toBeTruthy();

  eventRegistrar.remove('click', handler3);

  expect(
    eventRegistrar.handlersByElement.has('child-0'),
    'event elements map is updated'
  ).toBeFalsy();
});

test('EventRegistrar#normalizeEvent', () => {
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
  eventRegistrar.add('foo', (evt) => {
    normalizedEvent = evt;
  });

  eventRegistrar.handleEvent(eventMock);

  expect(normalizedEvent.rootElement, 'rootElement is set').toBe(root);
  expect(normalizedEvent.center, 'center is populated').toBeTruthy();
  expect(normalizedEvent.offsetCenter, 'offsetCenter is populated').toBeTruthy();
  expect(normalizedEvent.handled, 'event marked as not handled').toBe(false);
  expect(typeof normalizedEvent.stopPropagation, 'event.stopPropagation is a function').toBe(
    'function'
  );
  expect(
    typeof normalizedEvent.stopImmediatePropagation,
    'event.stopImmediatePropagation is a function'
  ).toBe('function');
});

test('EventRegistrar#propagation', () => {
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

  expect(
    () =>
      eventRegistrar.handleEvent({
        type: 'foo',
        srcEvent: {
          target: rootNode
        }
      }),
    'event without handlers'
  ).not.toThrow();

  const handlerCalls = [];

  const fooHandler =
    (message: string, stopPropagation = false, stopImmediatePropagation = false) =>
    (evt) => {
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
  expect(handlerCalls, 'propagated correctly').toEqual([
    'foo@grandchild-00',
    'foo@child-0',
    'foo@child-0:2'
  ]);

  handlerCalls.length = 0; // clean
  eventRegistrar.handleEvent({
    type: 'foo',
    srcEvent: {
      target: grandchildNodes[0]
    }
  });
  expect(handlerCalls, 'propagated correctly, one-time callback is removed').toEqual([
    'foo@child-0',
    'foo@child-0:2'
  ]);

  handlerCalls.length = 0; // clean
  eventRegistrar.handleEvent({
    type: 'foo',
    srcEvent: {
      target: rootNode
    }
  });
  expect(handlerCalls, 'propagated correctly').toEqual(['foo@root']);

  handlerCalls.length = 0; // clean
  eventRegistrar.handleEvent({
    type: 'foo',
    srcEvent: {
      target: rootNode
    }
  });
  expect(handlerCalls, 'propagated correctly, one-time callback is removed').toEqual([
    'foo@root:2'
  ]);
});
