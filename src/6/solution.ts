const parseGroups = (inputLines: string[]) => {
  const groups: Array<Set<string>> = [];

  let group = new Set<string>();
  for (let line of inputLines) {
    if (line === '') {
      groups.push(group);
      group = new Set<string>();
      continue;
    }
    const answers = line.split('');
    answers.forEach(a => group.add(a));
  }
  groups.push(group);

  return groups;
};

const solution1 = (inputLines: string[]) => {
  const groups = parseGroups(inputLines);

  return groups.reduce((total, gr) => total + gr.size, 0);
};

const parseGroups2 = (inputLines: string[]) => {
  const groups: Array<Set<string>> = [];

  let group: any = null;
  for (let line of inputLines) {
    if (line === '') {
      groups.push(group);
      group = null;
      continue;
    }
    const answers = line.split('');
    if (group === null) {
      group = new Set<string>();
      answers.forEach(a => group.add(a));
    } else {
      for (let a of group) {
        if (!answers.includes(a)) {
          group.delete(a);
        }
      }
    }
  }
  groups.push(group);

  return groups;
};

const solution2 = (inputLines: string[]) => {
  const groups = parseGroups2(inputLines);

  return groups.reduce((total, gr) => total + gr.size, 0);
};

export {solution1, solution2};
