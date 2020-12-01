const solution1 = (inputLines: string[]) => {
  const numbers = inputLines.map(v => Number(v));

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === 2020) {
        return numbers[i] * numbers[j];
      }
    }
  }
  return null;
};

const solution2 = (inputLines: string[]) => {
  const numbers = inputLines.map(v => Number(v));

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > 2020) continue;
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] > 2020) continue;
      for (let k = j + 1; k < numbers.length; k++) {
        if (numbers[i] + numbers[j] + numbers[k] === 2020) {
          return numbers[i] * numbers[j] * numbers[k];
        }
      }
    }
  }
  return null;
};

export {solution1, solution2};
