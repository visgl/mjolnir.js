// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {ContextmenuInput} from 'mjolnir.js/inputs/contextmenu-input';
import {spy} from '../test-utils/spy';
import {createEventTarget} from '../test-utils/dom';

test('contextmenuInput#only listens while enabled', (t) => {
  const element = createEventTarget();
  const addELSpy = spy(element, 'addEventListener');
  const removeELSpy = spy(element, 'removeEventListener');
  const contextmenuInput = new ContextmenuInput(element, () => {}, {enable: false});

  t.equal(addELSpy.callCount, 0, 'does not add a listener when disabled');

  contextmenuInput.enableEventType('contextmenu', true);
  t.equal(addELSpy.callCount, 1, 'adds the listener when enabled');
  contextmenuInput.enableEventType('contextmenu', true);
  t.equal(addELSpy.callCount, 1, 'does not add the listener again when already enabled');

  removeELSpy.reset();
  contextmenuInput.enableEventType('contextmenu', false);
  t.equal(removeELSpy.callCount, 1, 'removes the listener when disabled');
  contextmenuInput.enableEventType('contextmenu', false);
  t.equal(removeELSpy.callCount, 1, 'does not remove the listener again when already disabled');

  contextmenuInput.destroy();
  element.remove();
  t.end();
});
