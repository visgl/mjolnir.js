// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

export type SpyFunction = Function & {
  callCount: number;
  called: boolean;
  reset: () => void;
  restore: () => void;
};

// Inspired by https://github.com/popomore/spy
export function spy(obj?: object, methodName?: string): SpyFunction {
  if (!obj || !methodName) {
    obj = {
      noop: () => {}
    };
    methodName = 'noop';
  }

  const func = obj[methodName] as Function | SpyFunction;

  // will not wrap more than once
  if ('restore' in func) {
    return func;
  }

  // @ts-ignore
  const spy: SpyFunction = function (...args) {
    spy.callCount++;
    spy.called = true;
    /* eslint-disable no-invalid-this */
    return func.apply(this, args);
  };

  spy.callCount = 0;
  spy.called = false;
  spy.reset = () => {
    spy.callCount = 0;
    spy.called = false;
  };
  spy.restore = () => {
    obj[methodName] = func;
  };

  obj[methodName] = spy;
  return spy;
}
