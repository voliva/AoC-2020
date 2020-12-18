// 2 + 6 * (4 * 5 * 8 * 7) + 3)
const calculateParens = (line: string) => {
  let result = 0;
  let op: string = '';
  for (let i = 0; i < line.length; i++) {
    const c = line.charAt(i);
    switch (c) {
      case '+':
      case '*':
        op = c;
        break;
      case ' ':
        break;
      case ')':
        return [result, i] as const;
      case '(':
        const [parensResult, length] = calculateParens(line.slice(i + 1));
        i += length + 1;
        switch (op) {
          case '+':
            result += parensResult;
            break;
          case '*':
            result *= parensResult;
            break;
          default:
            result = parensResult;
        }
        break;
      default:
        switch (op) {
          case '+':
            result += Number(c);
            break;
          case '*':
            result *= Number(c);
            break;
          default:
            result = Number(c);
        }
    }
  }
  return [result, line.length] as const;
};

const solution1 = (inputLines: string[]) => {
  return inputLines
    .map(line => calculateParens(line)[0])
    .reduce((a, b) => a + b);
};

// 2 + 6 * (4 * 5 * 8 * 7) + 3)
const calculateOp = (line: string) => {
  let result = 0;
  let op: string = '';

  for (let i = 0; i < line.length; i++) {
    const c = line.charAt(i);
    switch (c) {
      case '+':
        op = c;
        break;
      case '*':
        const [opResult1, length1] = calculateOp(line.slice(i + 1));
        i += length1;
        result = result * opResult1;
        break;
      case ' ':
        break;
      case ')':
        // console.log(`calculateOp("${line}") = [${result}, ${i}] (trunc)`);
        return [result, i] as const;
      case '(':
        const [opResult, length] = calculateOp(line.slice(i + 1));
        i += length + 1;
        switch (op) {
          case '+':
            result += opResult;
            break;
          default:
            result = opResult;
        }
        break;
      default:
        switch (op) {
          case '+':
            result += Number(c);
            break;
          default:
            result = Number(c);
        }
    }
  }
  // console.log(`calculateOp("${line}") = [${result}]`);
  return [result, line.length] as const;
};

// It's not 126438669663587
const solution2 = (inputLines: string[]) => {
  return inputLines.map(line => calculateOp(line)[0]).reduce((a, b) => a + b);
};

export {solution1, solution2};
