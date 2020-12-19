const parseRule = (line: string) => {
  const r0 = line.split(': ');
  const r1 = r0[1].split(' | ');

  return {
    number: Number(r0[0]),
    options: r1.map(v => {
      if (v.startsWith('"')) {
        return [v.slice(1, -1)];
      }
      return v.split(' ').map(Number);
    }),
  };
};

type Rule = (string[] | number[])[];
type Rules = Map<number, Rule>;
const parseInput = (inputLines: string[]) => {
  let blank = false;
  const rules: Rules = new Map();
  const passwords: string[] = [];
  for (let line of inputLines) {
    if (line === '') {
      blank = true;
      continue;
    }
    if (!blank) {
      const {number, options} = parseRule(line);
      rules.set(number, options);
    } else {
      passwords.push(line);
    }
  }
  return {rules, passwords};
};

const prepareRules = (rules: Rules) => {
  const solver = new Map<number, (psw: string) => number[]>();

  for (let [id, rule] of rules.entries()) {
    solver.set(id, psw =>
      rule
        .map(option => {
          let lengths: number[] = [0];
          for (let opt of option) {
            if (typeof opt === 'string') {
              if (psw.startsWith(opt)) {
                return [opt.length];
              }
              return [];
            }
            let newLengths: number[] = [];
            for (let l of lengths) {
              const optLengths = solver.get(opt)!(psw.slice(l));
              newLengths = [
                ...newLengths,
                ...optLengths.map(length => l + length),
              ];
            }
            lengths = newLengths;
          }
          return lengths.filter(l => l > 0);
        })
        .filter(res => res.length)
        .flat()
    );
  }

  return solver;
};

const solution1 = (inputLines: string[]) => {
  const {rules, passwords} = parseInput(inputLines);
  const preparedRules = prepareRules(rules);
  return passwords.filter(psw =>
    preparedRules.get(0)!(psw).some(v => psw.length === v)
  ).length;
};

//150
const solution2 = (inputLines: string[]) => {
  const {rules, passwords} = parseInput(inputLines);
  rules.set(8, [[42], [42, 8]]);
  rules.set(11, [
    [42, 31],
    [42, 11, 31],
  ]);
  const preparedRules = prepareRules(rules);
  return passwords.filter(psw =>
    preparedRules.get(0)!(psw).some(v => psw.length === v)
  ).length;
};

export {solution1, solution2};
