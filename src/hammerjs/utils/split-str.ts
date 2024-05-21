/**
 * @private
 * split string on whitespace
 * @returns {Array} words
 */
export default function splitStr(str: string): string[] {
  return str.trim().split(/\s+/g);
}
