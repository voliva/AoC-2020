import {combinations} from '../util';

const solution1 = (inputLines: string[]) => {
  const numbers = inputLines.map(Number);

  for (let i = 25; i < numbers.length; i++) {
    const slice = numbers.slice(i - 25, i);
    let found = false;
    for (let res of combinations(slice, 2)) {
      if (res[0] + res[1] === numbers[i]) {
        found = true;
        break;
      }
    }
    if (!found) {
      return numbers[i];
    }
  }

  return false;
};

const K = 25;
const getFaultyIndex = (input: number[]) => {
  for (let i = K; i < input.length; i++) {
    const slice = input.slice(i - K, i);
    let found = false;
    for (let res of combinations(slice, 2)) {
      if (res[0] + res[1] === input[i]) {
        found = true;
        break;
      }
    }
    if (!found) {
      return i;
    }
  }

  return false;
};

const solution2 = (inputLines: string[]) => {
  const numbers = inputLines.map(Number);
  const idx = getFaultyIndex(numbers);
  if (!idx) return false;
  const missingNum = numbers[idx];

  let prev = 0;
  const sums = numbers.slice(0, idx).map(v => {
    const sum = v + prev;
    prev = sum;
    return sum;
  });

  for (let res of combinations(sums, 2)) {
    if (res[1] - res[0] === missingNum) {
      const iA = sums.indexOf(res[0]) + 1;
      const iB = sums.indexOf(res[1]);
      const max = numbers.slice(iA, iB).reduce((a, b) => Math.max(a, b));
      const min = numbers.slice(iA, iB).reduce((a, b) => Math.min(a, b));
      return max + min;
    }
  }

  return false;
};

export {solution1, solution2};
