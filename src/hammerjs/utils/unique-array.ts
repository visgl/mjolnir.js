/**
 * @private
 * unique array with objects based on a key (like 'id') or just by the array's value
 */
export default function uniqueArray<T>(
  src: T[],
  /** key used to determine uniqueness */
  key?: keyof T,
  /** sort the result */
  sort?: boolean
): T[] {
  const values: Map<T | T[keyof T], T> = new Map();

  for (let i = 0; i < src.length; i++) {
    const val = key ? src[i][key] : src[i];
    if (!values.has(val)) {
      values.set(val, src[i]);
    }
  }

  let results = Array.from(values.values());
  if (sort) {
    if (!key) {
      results = results.sort();
    } else {
      results = results.sort((a: T, b: T) => {
        return a[key] > b[key] ? 1 : -1;
      });
    }
  }

  return results;
}
