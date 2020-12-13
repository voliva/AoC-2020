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

const inverse = (n: bigint, mod: bigint) => {
  for (let r = 1n; true; r++) {
    if ((n * r) % mod === 1n) return r;
  }
};

const solution2 = (inputLines: string[]) => {
  const ids = inputLines[1]
    .split(',')
    .map((v, i) => (v === 'x' ? null : [BigInt(Number(v)), BigInt(i)])!)
    .filter(v => !!v);

  const N = ids.reduce((acc, v) => acc * v[0], 1n);
  const Y = ids.map(([id]) => [N / id, id]);
  const Z = Y.map(([y, id]) => inverse(y, id));
  console.log({N, Y, Z});

  let x = 0n;
  for (let i = 0; i < ids.length; i++) {
    let offset = ids[i][0] - ids[i][1];
    while (offset < 0) offset += ids[i][0];

    x += offset * Y[i][0] * Z[i];
    x = x % N;
  }

  // It's less than 266204454441585
  return x;
};

export {solution1, solution2};
