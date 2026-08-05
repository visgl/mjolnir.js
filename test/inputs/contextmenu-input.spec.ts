// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {expect, test, vi} from 'vitest';
import {ContextmenuInput} from 'mjolnir.js/inputs/contextmenu-input';
import {createEventTarget} from '../test-utils/dom';

test('contextmenuInput#only listens while enabled', () => {
  const element = createEventTarget();
  const addELSpy = vi.spyOn(element, 'addEventListener');
  const removeELSpy = vi.spyOn(element, 'removeEventListener');
  const contextmenuInput = new ContextmenuInput(element, () => {}, {enable: false});

  expect(addELSpy, 'does not add a listener when disabled').toHaveBeenCalledTimes(0);

  contextmenuInput.enableEventType('contextmenu', true);
  expect(addELSpy, 'adds the listener when enabled').toHaveBeenCalledTimes(1);
  contextmenuInput.enableEventType('contextmenu', true);
  expect(addELSpy, 'does not add the listener again when already enabled').toHaveBeenCalledTimes(1);

  removeELSpy.mockClear();
  contextmenuInput.enableEventType('contextmenu', false);
  expect(removeELSpy, 'removes the listener when disabled').toHaveBeenCalledTimes(1);
  contextmenuInput.enableEventType('contextmenu', false);
  expect(
    removeELSpy,
    'does not remove the listener again when already disabled'
  ).toHaveBeenCalledTimes(1);

  contextmenuInput.destroy();
  element.remove();
});
