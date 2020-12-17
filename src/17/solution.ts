import {readGrid} from '../util';

const gridNeighbours = (pos: number[]) => {
  let res: number[][] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        res.push([pos[0] + x, pos[1] + y, pos[2] + z]);
      }
    }
  }
  return res;
};

const solution1 = (inputLines: string[]) => {
  const input = readGrid(inputLines);
  // let space = new Map<string, boolean>();
  let active = new Set<string>();
  input.forEach((row, r) =>
    row.forEach((v, c) => (v === '#' ? active.add([c, r, 0].join(',')) : null))
  );

  for (let i = 0; i < 6; i++) {
    // console.log(active);
    const newActive = new Set<string>();
    const coordConsider = new Set<string>();
    [...active].forEach(v => {
      coordConsider.add(v);
      gridNeighbours(v.split(',').map(Number)).forEach(coord =>
        coordConsider.add(coord.join(','))
      );
    });

    for (let coord of coordConsider) {
      const neigbours = gridNeighbours(coord.split(',').map(Number));
      const activeN = neigbours.filter(n => active.has(n.join(','))).length;
      // console.log(coord, activeN);
      if (active.has(coord) && (activeN === 2 || activeN === 3)) {
        newActive.add(coord);
      }
      if (!active.has(coord) && activeN === 3) {
        newActive.add(coord);
      }
    }
    active = newActive;
  }
  // console.log(active);

  return active.size;
};

const gridNeighbours2 = (pos: number[]) => {
  let res: number[][] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        for (let w = -1; w <= 1; w++) {
          if (x === 0 && y === 0 && z === 0 && w === 0) continue;
          res.push([pos[0] + x, pos[1] + y, pos[2] + z, pos[3] + w]);
        }
      }
    }
  }
  return res;
};

const solution2 = (inputLines: string[]) => {
  const input = readGrid(inputLines);
  // let space = new Map<string, boolean>();
  let active = new Set<string>();
  input.forEach((row, r) =>
    row.forEach((v, c) =>
      v === '#' ? active.add([c, r, 0, 0].join(',')) : null
    )
  );

  for (let i = 0; i < 6; i++) {
    // console.log(active);
    const newActive = new Set<string>();
    const coordConsider = new Set<string>();
    [...active].forEach(v => {
      coordConsider.add(v);
      gridNeighbours2(v.split(',').map(Number)).forEach(coord =>
        coordConsider.add(coord.join(','))
      );
    });

    for (let coord of coordConsider) {
      // if (!coord.endsWith('0,0')) continue;
      const neigbours = gridNeighbours2(coord.split(',').map(Number));
      const activeN = neigbours.filter(n => active.has(n.join(','))).length;
      if (active.has(coord) && (activeN === 2 || activeN === 3)) {
        newActive.add(coord);
      }
      if (!active.has(coord) && activeN === 3) {
        newActive.add(coord);
      }
      // console.log(
      //   coord,
      //   neigbours.filter(v => v[2] === 0 && v[3] === 0),
      //   activeN,
      //   newActive.has(coord)
      // );
    }
    active = newActive;
  }
  // console.log(active);
  // printActive(active);

  return active.size;
};

const printActive = (active: Set<string>) => {
  const coords = [...active].map(v => v.split(',').map(Number));
  const mins = coords.reduce((acc, c) =>
    acc.map((c2, i) => Math.min(c[i], c2))
  );
  const maxs = coords.reduce((acc, c) =>
    acc.map((c2, i) => Math.max(c[i], c2))
  );
  for (let w = mins[2]; w <= maxs[2]; w++) {
    for (let z = mins[3]; z <= maxs[3]; z++) {
      console.log(`z=${z}, w=${w}`);
      for (let y = mins[1]; y <= maxs[1]; y++) {
        let line = '';
        for (let x = mins[0]; x <= maxs[0]; x++) {
          line += active.has([x, y, z, w].join(',')) ? '#' : '.';
        }
        console.log(line);
      }
    }
  }
};

export {solution1, solution2};
