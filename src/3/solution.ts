import {readGrid} from '../util';

const countTrees = (grid: string[][], ir: number, ic: number) => {
  let trees = 0;
  let c = 0;
  for (let r = 0; r < grid.length; r += ir) {
    if (grid[r][c] === '#') trees++;
    c = (c + ic) % grid[r].length;
  }

  return trees;
};

const solution1 = (inputLines: string[]) => {
  const grid = readGrid(inputLines);

  return countTrees(grid, 1, 3);
};

const solution2 = (inputLines: string[]) => {
  const grid = readGrid(inputLines);
  return [
    [1, 1],
    [1, 3],
    [1, 5],
    [1, 7],
    [2, 1],
  ]
    .map(([ir, ic]) => countTrees(grid, ir, ic))
    .reduce((a, b) => a * b);
};

export {solution1, solution2};
