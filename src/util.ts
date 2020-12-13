import {sort} from 'optimized-quicksort';
import extgcd from 'extgcd';

// Input
export const readGrid = (inputLines: string[]) =>
  inputLines.map(line => line.split(''));

export const numberSplit = (text: string, separator = ',') =>
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

// Grid
export const gridNeighbours = (
  pos: number[],
  {min, max}: {min?: number[]; max?: number[]} = {}
) => {
  const p = new Array(pos.length).fill(0).map((_, i) => i);
  return [
    ...p.map(i => {
      const ret = new Array(pos.length).fill(0);
      ret[i] = 1;
      return ret;
    }),
    ...p.map(i => {
      const ret = new Array(pos.length).fill(0);
      ret[i] = -1;
      return ret;
    }),
  ]
    .map(v => pos.map((p, i) => p + v[i]))
    .filter(newPos => {
      if (min && !newPos.every((p, i) => min[i] <= p)) {
        return false;
      }
      if (max && !newPos.every((p, i) => max[i] > p)) {
        return false;
      }
      return true;
    });
};

// Maths
export const Modulo = {
  sub: <T extends number | bigint>(a: T, b: T, N: T): T => {
    const zero: any = typeof a === 'bigint' ? 0n : 0;
    const res: any = a - b;
    if (res < zero) {
      return N + res;
    }
    return (res % N) as T;
  },
  multiply: (a: number, b: number, N: number) => {
    let result = 0;
    while (b > 0) {
      if (b % 2 === 1) {
        result = (result + a) % N;
      }
      a = (a * 2) % N;
      b = Math.floor(b / 2);
    }
    return result;
  },
  invert: (a: number, N: number) => {
    let {x} = extgcd(a, N);
    if (x < 0) {
      x += N;
    }
    return x;
  },
};

// Permutations
export function* combinations<T>(elements: T[], n: number) {
  if (n > elements.length || n < 1) {
    throw new Error('Invalid n');
  }
  let permutation = new Array(n).fill(0).map((_, i) => i);
  const isValidPerm = (permutation: number[]) =>
    permutation.every(
      (v, i) => (i === 0 || v > permutation[i - 1]) && v < elements.length
    );

  while (true) {
    yield permutation.map(i => elements[i]);

    let i = permutation.length - 1;
    do {
      permutation[i]++;
      for (let j = i + 1; j < permutation.length; j++) {
        permutation[j] = permutation[j - 1] + 1;
      }
      i--;
    } while (i >= 0 && !isValidPerm(permutation));

    if (!isValidPerm(permutation)) {
      break;
    }
  }
}

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
  const tasks = new PriorityQueue<{path: T[]; weight: number}>(v => -v.weight);
  tasks.push({
    path: [root],
    weight: 0,
  });

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
    tasks.pushMany(
      result
        .map(edge => (Array.isArray(edge) ? edge : ([edge, 1] as const)))
        .filter(([node]) => !weights.has(getId(node)))
        .map(([node, edgeWeight]) => ({
          path: [...path, node],
          weight: weight + edgeWeight,
        }))
    );
  }
  return [weights] as const;
}

interface PQNode<T> {
  payload: T;
  next: PQNode<T> | null;
}
export class PriorityQueue<T> {
  public length = 0;

  private head: PQNode<T> | null = null;
  private unsorted: Array<T> | null = null;
  private prioritySelector: (v: T) => number;

  constructor(prio: keyof T | ((v: T) => number)) {
    if (typeof prio === 'function') {
      this.prioritySelector = prio;
    } else {
      this.prioritySelector = v => v[prio] as any;
    }
  }

  push(value: T) {
    if (!this.unsorted) {
      this.unsorted = [value];
    } else {
      this.unsorted.push(value);
    }
    this.length++;
  }
  pushMany(values: Array<T>) {
    if (!this.unsorted) {
      this.unsorted = [...values];
    } else {
      this.unsorted = this.unsorted.concat(values);
    }
    this.length += values.length;
  }

  peek() {
    this.sortUnsorted();
    return this.head?.payload;
  }

  pop() {
    this.sortUnsorted();
    if (!this.head) {
      return undefined;
    }
    const {payload} = this.head;
    this.head = this.head.next;
    this.length--;
    return payload;
  }

  private sortUnsorted() {
    if (!this.unsorted || !this.unsorted.length) return;
    sort(
      this.unsorted,
      (a: any, b: any) => this.prioritySelector(b) - this.prioritySelector(a)
    );

    if (!this.head) {
      this.head = {
        payload: this.unsorted[0],
        next: null,
      };
      let node = this.head;
      for (let i = 1; i < this.unsorted.length; i++) {
        const newNode: PQNode<T> = {
          payload: this.unsorted[i],
          next: null,
        };
        node.next = newNode;
        node = newNode;
      }
    } else {
      let prevNode: PQNode<T> | null = null;
      let node: PQNode<T> | null = this.head;
      for (let i = 0; i < this.unsorted.length; i++) {
        const newNode: PQNode<T> = {
          payload: this.unsorted[i],
          next: null,
        };
        while (
          node &&
          this.prioritySelector(node.payload) >=
            this.prioritySelector(this.unsorted[i])
        ) {
          prevNode = node;
          node = node.next;
        }

        if (!prevNode) {
          // Takes first position
          this.head = newNode;
          newNode.next = node;
          prevNode = newNode;
        } else if (!node) {
          // Takes last position
          prevNode.next = newNode;
          prevNode = newNode;
        } else {
          prevNode.next = newNode;
          newNode.next = node;
          prevNode = newNode;
        }
      }
    }

    this.unsorted = null;
  }
}
