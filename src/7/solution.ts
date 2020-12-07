import {regexParse} from '../util';

const contentRegex = /^([0-9]+) ([a-z ]+) bags?.?$/;
const parseInput = (inputLines: string[]) => {
  const parseLine = (line: string) => {
    const res = line.split(' bags contain ');
    const color = res[0];
    if (res[1] === 'no other bags.') {
      return {color, contain: []};
    }
    const content = res[1].split(', ');
    const contain = content.map(c =>
      regexParse(
        c,
        contentRegex,
        res => [Number(res[1]), res[2]] as [number, string]
      )
    );
    return {color, contain};
  };
  const result = new Map<string, Array<[number, string]>>();
  inputLines.forEach(line => {
    const {color, contain} = parseLine(line);
    result.set(color, contain);
  });
  return result;
};

const solution1 = (inputLines: string[]) => {
  const rules = parseInput(inputLines);
  const contains = new Map<string, boolean>();

  const checkContains = (color: string, target: string) => {
    if (contains.has(color)) {
      return contains.get(color)!;
    }
    const contents = rules.get(color)!;
    if (contents.find(([, c]) => c === target)) {
      contains.set(color, true);
      return true;
    }
    const found = contents.find(([, c]) => checkContains(c, target));
    contains.set(color, Boolean(found));
    return Boolean(found);
  };
  for (let key of rules.keys()) {
    checkContains(key, 'shiny gold');
  }

  return [...contains.entries()].filter(([, c]) => c).length;
};

const solution2 = (inputLines: string[]) => {
  const rules = parseInput(inputLines);

  const countBags = (color: string) => {
    const rule = rules.get(color)!;
    return rule
      .map(([quantity, c]) => quantity * (1 + countBags(c)))
      .reduce((a, b) => a + b, 0);
  };

  return countBags('shiny gold');
};

export {solution1, solution2};
