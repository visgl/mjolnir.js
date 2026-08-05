import {expect, test as vitestTest} from 'vitest';

type TestCallback = (test: Test) => void | Promise<void>;

export interface Test {
  deepEqual(actual: unknown, expected: unknown, message?: string): void;
  deepEquals(actual: unknown, expected: unknown, message?: string): void;
  doesNotThrow(callback: () => unknown, message?: string): void;
  end(): void;
  equal(actual: unknown, expected: unknown, message?: string): void;
  is(actual: unknown, expected: unknown, message?: string): void;
  notOk(value: unknown, message?: string): void;
  ok(value: unknown, message?: string): void;
  test(name: string, callback: TestCallback): void;
}

class VitestTape implements Test {
  private readonly childTestPromises: Promise<void>[] = [];

  deepEqual(actual: unknown, expected: unknown, message?: string): void {
    expect(actual, message).toEqual(expected);
  }

  deepEquals(actual: unknown, expected: unknown, message?: string): void {
    this.deepEqual(actual, expected, message);
  }

  doesNotThrow(callback: () => unknown, message?: string): void {
    expect(callback, message).not.toThrow();
  }

  end(): void {}

  equal(actual: unknown, expected: unknown, message?: string): void {
    expect(actual, message).toBe(expected);
  }

  is(actual: unknown, expected: unknown, message?: string): void {
    this.equal(actual, expected, message);
  }

  notOk(value: unknown, message?: string): void {
    expect(value, message).toBeFalsy();
  }

  ok(value: unknown, message?: string): void {
    expect(value, message).toBeTruthy();
  }

  test(_name: string, callback: TestCallback): void {
    this.childTestPromises.push(new VitestTape().run(callback));
  }

  async run(callback: TestCallback): Promise<void> {
    await callback(this);
    await Promise.all(this.childTestPromises);
  }
}

type TapeTest = {
  (name: string, callback: TestCallback): ReturnType<typeof vitestTest>;
  only: (name: string, callback: TestCallback) => ReturnType<typeof vitestTest.only>;
  skip: (name: string, callback?: TestCallback) => ReturnType<typeof vitestTest.skip>;
};

function wrapTest(
  implementation: typeof vitestTest | typeof vitestTest.only
): (name: string, callback?: TestCallback) => ReturnType<typeof implementation> {
  return (name, callback) =>
    implementation(name, async () => {
      if (callback) {
        await new VitestTape().run(callback);
      }
    });
}

const test = wrapTest(vitestTest) as TapeTest;
test.only = wrapTest(vitestTest.only);
test.skip = wrapTest(vitestTest.skip);

export default test;
