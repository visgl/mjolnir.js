// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
