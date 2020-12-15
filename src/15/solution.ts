const solution1 = (inputLines: string[]) => {
  const nums = inputLines[0].split(',').map(Number);

  const spokenNums = new Map<number, number[]>();
  nums.slice(0).forEach((num, i) => spokenNums.set(num, [i]));
  let turn = nums.length;
  let lastNum = nums[turn - 1];
  while (turn < 2020) {
    const turnsSpken = spokenNums.get(lastNum)!;
    const num =
      turnsSpken.length > 1
        ? turnsSpken[turnsSpken.length - 1] - turnsSpken[turnsSpken.length - 2]
        : 0;
    nums.push(num);
    if (spokenNums.has(num)) {
      spokenNums.get(num)!.push(turn);
    } else {
      spokenNums.set(num, [turn]);
    }
    lastNum = num;
    turn++;
  }

  return lastNum;
};

const solution2 = (inputLines: string[]) => {
  const nums = inputLines[0].split(',').map(Number);

  const spokenNums = new Map<number, number[]>();
  nums.slice(0).forEach((num, i) => spokenNums.set(num, [i]));
  let turn = nums.length;
  let lastNum = nums[turn - 1];
  while (turn < 30000000) {
    const turnsSpken = spokenNums.get(lastNum)!;
    const num = turnsSpken.length === 2 ? turnsSpken[1] - turnsSpken[0] : 0;
    nums.push(num);
    if (spokenNums.has(num)) {
      const arr = spokenNums.get(num)!;
      if (arr.length === 2) {
        arr[0] = arr[1];
        arr[1] = turn;
      } else {
        arr.push(turn);
      }
    } else {
      spokenNums.set(num, [turn]);
    }
    lastNum = num;

    if (Number(String(turn).slice(1)) === 0) {
      console.log(turn);
    }
    turn++;
  }

  return lastNum;
};

export {solution1, solution2};
