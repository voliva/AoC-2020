const parseInput = (inputLines: string[]) => {
  const tiles = new Map<number, string[][]>();

  let currentTile: string[][] = [];
  for (let line of inputLines) {
    if (line.startsWith('Tile')) {
      currentTile = [];
      tiles.set(parseInt(line.slice('Tile '.length)), currentTile);
    } else if (line === '') {
      continue;
    } else {
      currentTile.push(line.split(''));
    }
  }

  return tiles;
};

const reverse = <T>(array: T[]) => [...array].reverse();
const getEdges = (tile: string[][]) => {
  return [
    // W/o rotation
    [
      tile[0],
      tile.map(row => row[row.length - 1]),
      tile[tile.length - 1],
      tile.map(row => row[0]),
    ],
    // 1 rotation
    [
      reverse(tile.map(row => row[0])),
      tile[0],
      reverse(tile.map(row => row[row.length - 1])),
      tile[tile.length - 1],
    ],
    // 2 rotation
    [
      reverse(tile[tile.length - 1]),
      reverse(tile.map(row => row[0])),
      reverse(tile[0]),
      reverse(tile.map(row => row[row.length - 1])),
    ],
    // 3 rotation
    [
      tile.map(row => row[row.length - 1]),
      reverse(tile[tile.length - 1]),
      tile.map(row => row[0]),
      reverse(tile[0]),
    ],
    /// Flip
    // W/o rotation
    [
      reverse(tile[0]),
      tile.map(row => row[0]),
      reverse(tile[tile.length - 1]),
      tile.map(row => row[row.length - 1]),
    ],
    // 1 rotation
    [
      reverse(tile.map(row => row[row.length - 1])),
      reverse(tile[0]),
      reverse(tile.map(row => row[0])),
      reverse(tile[tile.length - 1]),
    ],
    // 2 rotation
    [
      tile[tile.length - 1],
      reverse(tile.map(row => row[row.length - 1])),
      tile[0],
      reverse(tile.map(row => row[0])),
    ],
    // 3 rotation
    [
      tile.map(row => row[0]),
      tile[tile.length - 1],
      tile.map(row => row[row.length - 1]),
      tile[0],
    ],
  ].map(rotation => {
    // console.log(
    //   rotation.map(row => row.map(v => (v === '#' ? 1 : 0)).join(''))
    // );
    return rotation
      .map(row => row.map(v => (v === '#' ? 1 : 0)).join(''))
      .map(value => Number.parseInt(value, 2));
  });
};

const findCandidates = (
  excludeId: number,
  edgeIds: number[],
  edges: Map<number, number[][]>
) => {
  const candidates: [number, number][] = [];

  for (let [id, rotations] of edges) {
    if (id === excludeId) continue;
    const idx = edgeIds.findIndex((edgeId, i) =>
      rotations.some(rot => {
        const id = rot[(i + 2) % 4];
        return edgeId === id;
      })
    );
    if (idx >= 0) {
      candidates.push([id, idx]);
    }
  }
  return candidates;
};

const findCorners = (edges: Map<number, number[][]>) => {
  const corners: [number, number][] = [];
  for (let [id, cardRotations] of edges) {
    const candidates = findCandidates(id, cardRotations[0], edges);
    if (candidates.length === 2) {
      // Return the orientation so that it can be positioned at 0,0
      const positions = candidates
        .map(c => c[1])
        .sort()
        .join('');
      const orientation = (() => {
        switch (positions) {
          case '01':
            return 1;
          case '12':
            return 0;
          case '23':
            return 3;
          case '03':
            return 2;
          default:
            throw new Error('unknown positions ' + positions);
        }
      })();

      corners.push([id, orientation]);
    }
  }
  return corners;
};

const solution1 = (inputLines: string[]) => {
  const tiles = parseInput(inputLines);

  const edges = new Map<number, number[][]>();
  for (let [id, tile] of tiles) {
    edges.set(id, getEdges(tile));
  }

  const corners = findCorners(edges);
  if (corners.length !== 4) {
    throw new Error('you dont have 4 corners: ' + corners.join(', '));
  }
  return corners.map(c => c[0]).reduce((a, b) => a * b);
};

const findRestrictedCandidate = (
  topRestriction: number | null,
  leftRestriction: number | null,
  edges: Map<number, number[][]>
) => {
  for (let [id, rotations] of edges) {
    const rotation = rotations.find(
      rot => rot[0] === topRestriction || rot[3] === leftRestriction
    );
    if (rotation) {
      return [id, rotation, rotations.indexOf(rotation)] as const;
    }
  }
  return null;
};

const getBody = (tile: string[][], orientation: number) => {
  if (orientation >= 4) {
    tile = tile.map(row => reverse(row));
    orientation -= 4;
  }
  const body = tile.slice(1, -1).map(col => col.slice(1, -1));
  switch (orientation) {
    case 0:
      return body;
    case 1:
      return body.map((row, r) =>
        row.map((_, c) => body[body.length - 1 - c][r])
      );
    case 2:
      return body.map((row, r) =>
        row.map((_, c) => body[body.length - 1 - r][row.length - 1 - c])
      );
    case 3:
      return body.map((row, r) =>
        row.map((_, c) => body[c][row.length - 1 - r])
      );
  }
  throw new Error('unknown orientation ' + orientation);
};

const solvePuzzle = (inputLines: string[]) => {
  const tiles = parseInput(inputLines);

  const tileEdges = new Map<number, number[][]>();
  for (let [id, tile] of tiles) {
    tileEdges.set(id, getEdges(tile));
  }

  const positionedTiles = new Map<number, number[]>();

  const [[corner, orientation]] = findCorners(tileEdges);

  const grid: [number, number][][] = [[[corner, orientation]]];
  positionedTiles.set(corner, tileEdges.get(corner)![orientation]);
  tileEdges.delete(corner);

  const gaps: [number, number][] = [
    [0, 1],
    [1, 0],
  ];

  while (gaps.length) {
    const gap = gaps.pop()!;
    if (gap[0] < 0 || gap[1] < 0) continue;

    const leftRestriction = grid[gap[0]]?.[gap[1] - 1]
      ? positionedTiles.get(grid[gap[0]][gap[1] - 1][0])![1]
      : null;
    const topRestriction = grid[gap[0] - 1]?.[gap[1]]
      ? positionedTiles.get(grid[gap[0] - 1][gap[1]][0])![2]
      : null;
    // console.log({gap, leftRestriction, topRestriction});
    if (!leftRestriction && !topRestriction) continue;

    const candidate = findRestrictedCandidate(
      topRestriction,
      leftRestriction,
      tileEdges
    );
    // console.log({candidate});
    if (candidate) {
      grid[gap[0]] = grid[gap[0]] || [];
      grid[gap[0]][gap[1]] = [candidate[0], candidate[2]];
      positionedTiles.set(candidate[0], candidate[1]);
      tileEdges.delete(candidate[0]);
      gaps.push([gap[0], gap[1] + 1]);
      gaps.push([gap[0] + 1, gap[1]]);
    }
  }

  console.log(grid);

  const puzzle = grid.map(row =>
    row.map(([id, orientation]) => getBody(tiles.get(id)!, orientation))
  );
  const joined: string[][] = [];
  puzzle.forEach((row, r) => {
    row.forEach((tile, c) => {
      const jRow = r * tile.length;
      tile.forEach((tileRow, tr) => {
        joined[jRow + tr] = (joined[jRow + tr] || []).concat(tileRow);
      });
    });
  });

  return joined;
};

const solution2 = (inputLines: string[]) => {
  const solved = solvePuzzle(inputLines);

  console.log(solved.map(row => row.join('')).join('\n'));

  return;
};

export {solution1, solution2};
