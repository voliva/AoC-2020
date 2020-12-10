const solution1 = (inputLines: string[]) => {
  const joltRatings = inputLines.map(Number);
  joltRatings.sort((a, b) => a - b);
  const distribution: number[] = [];

  for (let i = 0; i < joltRatings.length; i++) {
    const diff = i === 0 ? joltRatings[i] : joltRatings[i] - joltRatings[i - 1];
    distribution[diff] = distribution[diff] ? distribution[diff] + 1 : 1;
  }
  distribution[3] = distribution[3] + 1;

  return distribution[1] * distribution[3];
};

const solution2 = (inputLines: string[]) => {
  const joltRatings = inputLines.map(Number);
  joltRatings.sort((a, b) => a - b);

  joltRatings.unshift(0);
  joltRatings.push(joltRatings[joltRatings.length - 1] + 3);

  const posibilities: number[] = [];
  posibilities[joltRatings.length - 1] = 1;
  for (let i = joltRatings.length - 2; i >= 0; i--) {
    const joltR = joltRatings[i];
    let pos = 0;
    let j = i + 1;
    while (j < joltRatings.length && joltRatings[j] <= joltR + 3) {
      pos += posibilities[j];
      j++;
    }
    posibilities[i] = pos;
  }

  return posibilities[0];
};

export {solution1, solution2};
