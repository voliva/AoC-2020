import {regexParse} from '../util';

const solution1 = (inputLines: string[]) => {
  const validPasswords = inputLines.filter(line => {
    const result = regexParse(
      line,
      /([0-9]+)-([0-9]+) ([a-z]): ([a-z]+)/,
      v => ({
        min: Number(v[1]),
        max: Number(v[2]),
        char: v[3],
        pwd: v[4],
      })
    );

    const count = result.pwd.split('').filter(v => v === result.char).length;
    return count >= result.min && count <= result.max;
  });

  return validPasswords.length;
};

const solution2 = (inputLines: string[]) => {
  const validPasswords = inputLines.filter(line => {
    const result = regexParse(
      line,
      /([0-9]+)-([0-9]+) ([a-z]): ([a-z]+)/,
      v => ({
        positions: [v[1], v[2]].map(v => Number(v) - 1),
        char: v[3],
        pwd: v[4],
      })
    );

    const count = result.positions.filter(
      pos => result.pwd.charAt(pos) === result.char
    ).length;

    return count === 1;
  });

  return validPasswords.length;
};

export {solution1, solution2};
