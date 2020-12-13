import lcm from 'lcm';

const solution1 = (inputLines: string[]) => {
  const ts = Number(inputLines[0]);
  const ids = inputLines[1]
    .split(',')
    .filter(v => v !== 'x')
    .map(Number);

  const minutesNext = ids.map(id => (ts % id === 0 ? 0 : id - (ts % id)));

  const minIdx = minutesNext.reduce(
    (acc, v, i) => (v < acc.min ? {min: v, idx: i} : acc),
    {min: Number.POSITIVE_INFINITY, idx: -1}
  ).idx;

  return ids[minIdx] * minutesNext[minIdx];
};

const inverse = (n: number, mod: number) => {
  for (let r = 1; true; r++) {
    if ((n * r) % mod === 1) return r;
  }
};

const solution2 = (inputLines: string[]) => {
  const ids = inputLines[1]
    .split(',')
    .map((v, i) => (v === 'x' ? null : [Number(v), i])!)
    .filter(v => !!v);

  const refV = ids[0][0];
  const inverses = ids.slice(1).map(([id, offset]) => {
    // x*refV = (id - offset) mod id
    // x = (id - offset) * inv(refV) mod id
    let diff = id - offset;
    while (diff < 0) {
      diff += id;
    }
    return (diff * inverse(refV, id)) % id;
  });

  // it's not 1143196560
  return inverses.reduce((acc, v) => lcm(acc, v)) * refV;
};

export {solution1, solution2};
