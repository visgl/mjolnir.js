/**
 * find if a node is in the given parent
 */
export default function hasParent(node: HTMLElement, parent: HTMLElement): boolean {
  let ancester: Node | null = node;
  while (ancester) {
    if (ancester === parent) {
      return true;
    }
    ancester = node.parentNode;
  }
  return false;
}
