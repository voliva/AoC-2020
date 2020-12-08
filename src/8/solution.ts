const solution1 = (inputLines: string[]) => {
  let acc = 0;
  let ip = 0;
  const ranInstr = new Set<number>();

  while (true) {
    if (ranInstr.has(ip)) {
      break;
    }
    ranInstr.add(ip);
    const instr = inputLines[ip].split(' ');
    switch (instr[0]) {
      case 'acc':
        acc += Number(instr[1]);
        ip++;
        break;
      case 'jmp':
        ip += Number(instr[1]);
        break;
      case 'nop':
        ip++;
        break;
    }
  }

  return acc;
};

const solution2 = (inputLines: string[]) => {
  function tryPath(
    ranInstr: Set<number>,
    ip: number,
    acc: number,
    wildcard: boolean
  ) {
    while (true) {
      if (ip === inputLines.length) {
        return [true, acc];
      }
      if (ip > inputLines.length) {
        return [false];
      }
      if (ranInstr.has(ip)) {
        return [false];
      }
      ranInstr.add(ip);
      const instr = inputLines[ip].split(' ');
      switch (instr[0]) {
        case 'acc':
          acc += Number(instr[1]);
          ip++;
          break;
        case 'jmp':
          if (wildcard) {
            // Try jmp
            const res = tryPath(
              new Set(ranInstr),
              ip + Number(instr[1]),
              acc,
              true
            );
            if (res[0]) return res;
            // Try nop
            return tryPath(new Set(ranInstr), ip + 1, acc, false);
          }

          ip += Number(instr[1]);
          break;
        case 'nop':
          if (wildcard) {
            // Try nop
            const res = tryPath(new Set(ranInstr), ip + 1, acc, true);
            if (res[0]) return res;
            // Try jmp
            return tryPath(
              new Set(ranInstr),
              ip + Number(instr[1]),
              acc,
              false
            );
          }

          ip++;
          break;
      }
    }
  }
  return tryPath(new Set<number>(), 0, 0, true);
};

export {solution1, solution2};
