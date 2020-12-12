const heading = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};
const turn = {
  R: d => {
    switch (d) {
      case heading.N:
        return heading.E;
      case heading.S:
        return heading.W;
      case heading.E:
        return heading.S;
      case heading.W:
        return heading.N;
    }
  },
  L: d => {
    switch (d) {
      case heading.N:
        return heading.W;
      case heading.S:
        return heading.E;
      case heading.E:
        return heading.N;
      case heading.W:
        return heading.S;
    }
  },
};

const solution1 = (inputLines: string[]) => {
  const instructions = inputLines.map(
    line => [line.slice(0, 1), Number(line.slice(1))] as const
  );

  let pos = [0, 0];
  let head = heading.E;

  instructions.forEach(([c, v]) => {
    if (c === 'F') {
      pos[0] += head[0] * v;
      pos[1] += head[1] * v;
      return;
    }
    if (c === 'L' || c === 'R') {
      for (let i = 0; i < v; i += 90) head = turn[c](head)!;
      return;
    }
    const dir = heading[c];
    pos[0] += dir[0] * v;
    pos[1] += dir[1] * v;
  });

  return Math.abs(pos[0]) + Math.abs(pos[1]);
};

const turn2 = {
  R: (w: number[]) => {
    return [-w[1], w[0]];
  },
  L: (w: number[]) => {
    return [w[1], -w[0]];
  },
};

const solution2 = (inputLines: string[]) => {
  const instructions = inputLines.map(
    line => [line.slice(0, 1), Number(line.slice(1))] as const
  );

  let pos = [0, 0];
  let waypoint = [10, -1];

  instructions.forEach(([c, v]) => {
    if (c === 'F') {
      pos[0] += waypoint[0] * v;
      pos[1] += waypoint[1] * v;
      return;
    }
    if (c === 'L' || c === 'R') {
      for (let i = 0; i < v; i += 90) waypoint = turn2[c](waypoint)!;
      return;
    }
    const dir = heading[c];
    waypoint[0] += dir[0] * v;
    waypoint[1] += dir[1] * v;
  });

  return Math.abs(pos[0]) + Math.abs(pos[1]);
};

export {solution1, solution2};
