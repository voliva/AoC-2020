import {regexParse} from '../util';

const solution1 = (inputLines: string[]) => {
  const instructions = inputLines.map(line => {
    const [op, val] = line.split(' = ');
    if (op === 'mask') {
      return {
        op: 'mask' as const,
        and: Number.parseInt(
          '0' +
            val
              .split('')
              .map(v => (v === '0' ? '0' : '1'))
              .join(''),
          2
        ),
        or: Number.parseInt(
          '0' +
            val
              .split('')
              .map(v => (v === '1' ? '1' : '0'))
              .join(''),
          2
        ),
      };
    }
    const pos = regexParse(op, /mem\[([0-9]+)\]/, res => Number(res[1]));
    return {
      op: 'mem' as const,
      pos,
      val: Number(val),
    };
  });

  const mem = new Map<number, number>();
  let mask = instructions[0] as {op: string; and: number; or: number};
  for (let i = 1; i < instructions.length; i++) {
    const instr = instructions[i];
    if (instr.op === 'mask') {
      mask = instr;
      continue;
    }
    const {pos, val} = instr;
    const masked = (BigInt(val) & BigInt(mask.and)) | BigInt(mask.or);
    mem.set(pos, Number(masked));
  }

  return [...mem.values()].reduce((a, b) => a + b);
};

const solution2 = (inputLines: string[]) => {
  const instructions = inputLines.map(line => {
    const [op, val] = line.split(' = ');
    if (op === 'mask') {
      const floating = val.split('').filter(v => v === 'X').length;

      let posibles = floating ? [] : [val.replace(/0/g, '#')];
      for (let i = 0; i < Math.pow(2, floating); i++) {
        let result = val.replace(/0/g, '#');
        let n = i;
        for (let f = 0; f < floating; f++) {
          result = result.replace('X', String(n & 0x01));
          n = n >>> 1;
        }
        posibles.push(result);
      }

      return {
        op: 'mask' as const,
        apply: (address: number) =>
          posibles.map(pos => {
            const and = Number.parseInt(pos.replace(/#/g, '1'), 2);
            const or = Number.parseInt(pos.replace(/#/g, '0'), 2);
            return Number((BigInt(address) | BigInt(or)) & BigInt(and));
          }),
      };
    }
    const pos = regexParse(op, /mem\[([0-9]+)\]/, res => Number(res[1]));
    return {
      op: 'mem' as const,
      pos,
      val: Number(val),
    };
  });

  const mem = new Map<number, number>();
  let mask = instructions[0] as {op: string; apply: (v: number) => number[]};
  for (let i = 1; i < instructions.length; i++) {
    const instr = instructions[i];
    if (instr.op === 'mask') {
      mask = instr;
      continue;
    }
    const {pos, val} = instr;
    mask.apply(pos).forEach(addr => {
      mem.set(addr, val);
    });
  }

  // console.log(...mem.entries());
  // It's not 3738219591, 43618222164
  return [...mem.values()].reduce((a, b) => a + b);
};

export {solution1, solution2};
