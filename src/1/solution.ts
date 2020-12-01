import {combinations} from '../util';

const solution1 = (inputLines: string[]) => {
  const numbers = inputLines.map(v => Number(v));

  return solve(numbers, 2);
};

const solution2 = (inputLines: string[]) => {
  const numbers = inputLines.map(v => Number(v));

  return solve(numbers, 3);
};

const solve = (numbers: number[], n: number) => {
  for (let res of combinations(numbers, n))
    if (res.reduce((a, b) => a + b) === 2020)
      return res.reduce((a, b) => a * b);
};

export {solution1, solution2};
