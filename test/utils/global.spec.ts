// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {global, window, document, userAgent} from 'mjolnir.js/utils/globals';

test('globals', (t) => {
  t.ok(global, 'global is an object');
  t.ok(window, 'window is an object');
  t.ok(document, 'document is an object');
  t.is(typeof userAgent, 'string', 'userAgent is a string');

  t.end();
});
