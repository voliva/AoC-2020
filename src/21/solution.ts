const parseInput = (inputLines: string[]) => {
  return inputLines.map(line => {
    const r0 = line.split(' (contains ');
    const ingridients = r0[0].split(' ');
    const alergens = (r0[1].slice(0, -1) || '').split(', ');
    return {ingridients, alergens};
  });
};

const intersect = <T>(value: Set<T>, values: T[]) =>
  new Set(values.filter(v => value.has(v)));

const solution1 = (inputLines: string[]) => {
  const lines = parseInput(inputLines);

  const map = new Map<string, Set<string>>();
  // const allIngredients = new Set<string>();
  lines.forEach(({ingridients, alergens}) => {
    // ingridients.forEach(ingr => allIngredients.add(ingr));

    const ingridientsSet = new Set(ingridients);
    alergens.forEach(alergen => {
      if (map.has(alergen)) {
        const ingrSet = map.get(alergen)!;
        map.set(alergen, intersect(ingrSet, ingridients));
      } else {
        map.set(alergen, ingridientsSet);
      }
    });
  });

  const allAlergens = new Set([...map.values()].map(s => [...s]).flat());
  let count = 0;
  lines.forEach(line => {
    line.ingridients.forEach(igr => {
      if (!allAlergens.has(igr)) count++;
    });
  });

  return count;
};

const solution2 = (inputLines: string[]) => {
  const lines = parseInput(inputLines);

  const map = new Map<string, Set<string>>();
  lines.forEach(({ingridients, alergens}) => {
    const ingridientsSet = new Set(ingridients);
    alergens.forEach(alergen => {
      if (map.has(alergen)) {
        const ingrSet = map.get(alergen)!;
        map.set(alergen, intersect(ingrSet, ingridients));
      } else {
        map.set(alergen, ingridientsSet);
      }
    });
  });

  const result = new Map<string, string>();
  while (map.size > 0) {
    const entries = [...map.entries()];
    const single = entries.find(([, v]) => v.size === 1);
    if (!single) {
      console.log(map);
      throw new Error('not single');
    }
    const allergen = [...single[1]][0];
    result.set(single[0], allergen);
    entries.forEach(([id, alergens]) => {
      alergens.delete(allergen);
    });
    map.delete(single[0]);
  }

  return [...result.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)
    .join(',');
};

export {solution1, solution2};
