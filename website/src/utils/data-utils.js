export function joinPath(base, path) {
  if (path.match(/^\w+:\/\//)) {
    // has protocol
    return path;
  }
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
