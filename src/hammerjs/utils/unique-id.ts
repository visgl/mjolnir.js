/**
 * get a unique id
 */
let _uniqueId = 1;
export default function uniqueId(): number {
  return _uniqueId++;
}
