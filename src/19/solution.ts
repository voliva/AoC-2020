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

const passwordIsValidRec = (
  password: string,
  id: number,
  rules: Rules
): readonly [boolean, number] => {
  const rule = rules.get(id)!;

  loop1: for (let option of rule) {
    let optionPsw = password;
    for (let seq of option) {
      if (typeof seq === 'string') {
        console.log(id, seq, optionPsw.charAt(0));
        return [optionPsw.charAt(0) === seq, 1] as const;
      }

      const [isInnerValid, length] = passwordIsValidRec(optionPsw, seq, rules);
      console.log(id, seq, isInnerValid, length, optionPsw);
      if (!isInnerValid) continue loop1;
      optionPsw = optionPsw.slice(length);
    }
    console.log(id, 'ret true');
    return [true, password.length - optionPsw.length];
  }
  console.log(id, 'ret false');
  return [false, 0];
};
const passwordIsValid = (password: string, id: number, rules: Rules) => {
  const [isValid, length] = passwordIsValidRec(password, id, rules);
  console.log(password, isValid, password.length, length);
  return isValid && length === password.length;
};

const solution1 = (inputLines: string[]) => {
  const {rules, passwords} = parseInput(inputLines);
  // passwordIsValidRec('aaaabbb', 0, rules);
  return passwords.filter(line => passwordIsValid(line, 0, rules)).length;
};

//150
const solution2 = (inputLines: string[]) => {
  const {rules, passwords} = parseInput(inputLines);
  rules.set(8, [[42], [42, 8]]);
  rules.set(11, [
    [42, 31],
    [42, 11, 31],
  ]);
  return passwordIsValid('aaaaabbaabaaaaababaa', 0, rules);
  return passwords.filter(line => passwordIsValid(line, 0, rules));
};

export {solution1, solution2};
