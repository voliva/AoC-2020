const parseInput = (inputLines: string[]) => {
  const rules = new Map<string, Array<[number, number]>>();
  let myTicket: number[] = [];
  const otherTickets: Array<number[]> = [];

  let step = 0;
  inputLines.forEach(line => {
    if (line === '') {
      step++;
      return;
    }
    switch (step) {
      case 0:
        const a = line.split(': ');
        const b = a[1].split(' or ');
        rules.set(a[0], b.map(c => c.split('-').map(Number)) as any);
        break;
      case 1:
        if (!line.includes(',')) return;
        myTicket = line.split(',').map(Number);
        break;
      case 2:
        if (!line.includes(',')) return;
        otherTickets.push(line.split(',').map(Number));
        break;
    }
  });

  return {rules, myTicket, otherTickets};
};

const validateRule = (rule: [number, number][], value: number) =>
  rule.some(([min, max]) => min <= value && value <= max);

const solution1 = (inputLines: string[]) => {
  const {rules, otherTickets} = parseInput(inputLines);
  const rulesArr = [...rules.values()];

  return otherTickets
    .flatMap(ticket =>
      ticket.filter(value => !rulesArr.some(rule => validateRule(rule, value)))
    )
    .reduce((a, b) => a + b);
};

const solution2 = (inputLines: string[]) => {
  const {rules, otherTickets, myTicket} = parseInput(inputLines);
  const rulesArr = [...rules.values()];
  const fieldNames = new Set(rules.keys());

  const validTickets = otherTickets.filter(ticket =>
    ticket.every(value => rulesArr.some(rule => validateRule(rule, value)))
  );

  const positions = new Map<number, Set<string>>();
  validTickets.forEach(ticket => {
    ticket.forEach((value, i) => {
      const namesToEval = positions.get(i) || fieldNames;
      const posibleFields = [...namesToEval].filter(fieldName =>
        validateRule(rules.get(fieldName)!, value)
      );
      if (!positions.has(i)) {
        positions.set(i, new Set(posibleFields));
      } else {
        const currentPosibilities = positions.get(i)!;
        [...currentPosibilities].forEach(field => {
          if (!posibleFields.includes(field)) {
            currentPosibilities.delete(field);
          }
        });
      }
    });
  });

  const positionsArr: string[] = new Array(fieldNames.size).fill('');
  while (positionsArr.some(v => v === '')) {
    const single = [...positions.entries()].find(([_, v]) => v.size === 1);
    if (!single) {
      console.log(positions);
      break;
    }
    positionsArr[single[0]] = single[1].values().next().value;
    for (let p of positions.values()) {
      p.delete(positionsArr[single[0]]);
    }
  }

  return myTicket
    .map((value, i) => [positionsArr[i], value] as const)
    .filter(([name]) => name.startsWith('departure'))
    .map(([_, v]) => v)
    .reduce((a, b) => a * b);
};

export {solution1, solution2};
