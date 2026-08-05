// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {expect, test} from 'vitest';
import {global, window, document, userAgent} from 'mjolnir.js/utils/globals';

test('globals', () => {
  expect(global, 'global is an object').toBeTruthy();
  expect(window, 'window is an object').toBeTruthy();
  expect(document, 'document is an object').toBeTruthy();
  expect(typeof userAgent, 'userAgent is a string').toBe('string');
});
