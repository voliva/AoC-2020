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
  getId: (value: T) => any = value => value
) {
  const visited = new Set<T>();
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
    visited.add(node);
    if (found(node, path)) return [node, path] as [T, T[]];

    getEdges(node, path)
      .map(edge => (Array.isArray(edge) ? edge : ([edge, 1] as const)))
      .filter(([node]) => !visited.has(getId(node)))
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
  return null;
}
