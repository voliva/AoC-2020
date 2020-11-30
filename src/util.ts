import Queue from 'flatqueue';

export const readGrid = (inputLines: string[]) =>
  inputLines.map(line => line.split(''));

export const numberSplit = (text: string, separator = '') =>
  text.split(separator).map(v => Number(v));

export const regexParse = <T>(
  text: string,
  regex: RegExp,
  mapFn: (result: string[]) => T
) => {
  const result = regex.exec(text);
  if (!result) {
    throw new Error('Can\'t parse text "' + text + '"');
  }
  return mapFn(result);
};

// Graph
export function findShortestPath<T>(
  root: T,
  getEdges: (node: T, path: T[]) => (T | [T, number])[],
  found: (node: T, path: T[]) => boolean,
  getId?: (value: T) => any
) {
  const [weights, node, path] = bft(
    root,
    (node, path) => {
      if (found(node, path)) {
        return true;
      }
      return getEdges(node, path);
    },
    getId
  );
  return path ? [node, weights.get(node!)!, path] : null;
}

export function bft<T>(
  root: T,
  getEdges: (node: T, path: T[]) => true | (T | [T, number])[],
  getId: (value: T) => any = value => value
) {
  const weights = new Map<T, number>();
  const tasks = new Queue();
  tasks.push(
    {
      path: [root],
      weight: 0,
    },
    0
  );

  let task;
  while ((task = tasks.pop())) {
    const {path, weight} = task;
    const node: T = path[path.length - 1];
    if (weights.has(node)) {
      continue;
    }
    weights.set(node, weight);

    const result = getEdges(node, path);
    if (result === true) {
      return [weights, node, path] as const;
    }
    result
      .map(edge => (Array.isArray(edge) ? edge : ([edge, 1] as const)))
      .filter(([node]) => !weights.has(getId(node)))
      .forEach(([node, edgeWeight]) =>
        tasks.push(
          {
            path: [...path, node],
            weight: weight + edgeWeight,
          },
          weight + edgeWeight
        )
      );
  }
  return [weights] as const;
}
