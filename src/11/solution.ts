import {readGrid} from '../util';

function* adjacent(r: number, c: number, maxR: number, maxC: number) {
  for (let ir = -1; ir <= 1; ir++) {
    if (r + ir >= maxR || r + ir < 0) continue;
    for (let ic = -1; ic <= 1; ic++) {
      if (c + ic >= maxC || c + ic < 0) continue;
      if (ir === 0 && ic === 0) continue;
      yield [r + ir, c + ic] as const;
    }
  }
}

const solution1 = (inputLines: string[]) => {
  let grid = readGrid(inputLines);

  let newState: typeof grid;
  let changed = true;
  while (changed) {
    newState = grid.map(v => new Array(v.length));
    changed = false;

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === '.' || !grid[r][c]) continue;

        let occupied = 0;
        for (let [ar, ac] of adjacent(r, c, grid.length, grid[r].length)) {
          if (grid[ar][ac] === '#') occupied++;
        }

        if (grid[r][c] === 'L') {
          newState[r][c] = occupied === 0 ? '#' : 'L';
          changed = changed || occupied === 0;
        } else if (grid[r][c] === '#') {
          newState[r][c] = occupied >= 4 ? 'L' : '#';
          changed = changed || occupied >= 4;
        }
      }
    }
    grid = newState;
  }

  return grid.reduce(
    (acc, row) => acc + row.reduce((acc, v) => acc + (v === '#' ? 1 : 0), 0),
    0
  );
};

const solution2 = (inputLines: string[]) => {
  let grid = readGrid(inputLines);

  const visibleCoordinates = new Map<string, Array<[number, number]>>();
  const getVisibleCoordinates = (
    r: number,
    c: number,
    maxR: number,
    maxC: number
  ) => {
    const key = [r, c].join(',');
    if (visibleCoordinates.has(key)) return visibleCoordinates.get(key)!;
    const getVisible = (dr: number, dc: number) => {
      for (
        let ir = r + dr, ic = c + dc;
        ir >= 0 && ir < maxR && ic >= 0 && ic < maxC;
        ir += dr, ic += dc
      ) {
        if (grid[ir][ic] !== '.') {
          return [ir, ic] as [number, number];
        }
      }
      return null;
    };

    const visible = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]
      .map(([dr, dc]) => getVisible(dr, dc)!)
      .filter(v => Boolean(v));
    visibleCoordinates.set(key, visible);
    return visible;
  };

  let newState: typeof grid;
  let changed = true;
  while (changed) {
    newState = grid.map(v => new Array(v.length));
    changed = false;

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === '.' || !grid[r][c]) continue;

        let occupied = 0;
        for (let [ar, ac] of getVisibleCoordinates(
          r,
          c,
          grid.length,
          grid[r].length
        )) {
          if (grid[ar][ac] === '#') occupied++;
        }

        if (grid[r][c] === 'L') {
          newState[r][c] = occupied === 0 ? '#' : 'L';
          changed = changed || occupied === 0;
        } else if (grid[r][c] === '#') {
          newState[r][c] = occupied >= 5 ? 'L' : '#';
          changed = changed || occupied >= 5;
        }
      }
    }
    grid = newState;
  }

  return grid.reduce(
    (acc, row) => acc + row.reduce((acc, v) => acc + (v === '#' ? 1 : 0), 0),
    0
  );
};

export {solution1, solution2};
