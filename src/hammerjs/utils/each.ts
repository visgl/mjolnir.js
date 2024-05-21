/**
 * walk objects and arrays
 */
export default function each(
  obj: any,
  iterator: (item: any, index: number | string, data: object) => void,
  context?: any
) {
  if (!obj) {
    return;
  }

  if (obj.forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length !== undefined) {
    let i = 0;
    while (i < obj.length) {
      iterator.call(context, obj[i], i, obj);
      i++;
    }
  } else {
    for (const i in obj) {
      obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
    }
  }
}
