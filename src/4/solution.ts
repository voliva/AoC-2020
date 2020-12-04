const parsePassports = (inputLines: string[]) => {
  const passports: Array<any> = [];

  let passport: any = {};
  for (let line of inputLines) {
    if (line === '') {
      passports.push(passport);
      passport = {};
      continue;
    }
    passport = {
      ...passport,
      ...Object.fromEntries(line.split(' ').map(v => v.split(':'))),
    };
  }
  passports.push(passport);

  return passports;
};

const solution1 = (inputLines: string[]) => {
  const passports = parsePassports(inputLines);
  const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  return passports.filter(p => requiredFields.every(field => !!p[field]))
    .length;
};

const solution2 = (inputLines: string[]) => {
  const passports = parsePassports(inputLines);
  const validations = {
    byr: value => Number(value) >= 1920 && Number(value) <= 2002,
    iyr: value => Number(value) >= 2010 && Number(value) <= 2020,
    eyr: value => Number(value) >= 2020 && Number(value) <= 2030,
    hgt: (value: string) => {
      const num = Number(value.slice(0, -2));
      if (value.endsWith('cm')) {
        return num >= 150 && num <= 193;
      }
      if (value.endsWith('in')) {
        return num >= 59 && num <= 76;
      }
      return false;
    },
    hcl: value => /^#[0-9a-f]{6}$/.test(value),
    ecl: value =>
      ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value),
    pid: value => /^[0-9]{9}$/.test(value),
  };
  const validationsArr = Object.entries(validations);
  return passports.filter(p =>
    validationsArr.every(
      ([field, validator]) => p[field] && validator(p[field])
    )
  ).length;
};

export {solution1, solution2};
