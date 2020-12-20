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
  const candidates: number[] = [];

  for (let [id, rotations] of edges) {
    if (id === excludeId) continue;
    if (
      edgeIds.some((edgeId, i) =>
        rotations.some(rot => {
          const id = rot[(i + 2) % 4];
          return edgeId === id;
        })
      )
    ) {
      candidates.push(id);
    }
    // else if (id === 2473) {
    //   console.log(edgeIds, rotations);
    //   edgeIds.some((edgeId, i) => {
    //     return rotations.some(rot => {
    //       const id = rot[(i + 2) % 4];
    //       console.log(edgeId, i, rot, id);
    //       return edgeId === id;
    //     });
    //   });
    // }
  }
  return candidates;
};

const findCorners = (edges: Map<number, number[][]>) => {
  const corners: number[] = [];
  for (let [id, cardRotations] of edges) {
    if (findCandidates(id, cardRotations[0], edges).length === 2) {
      corners.push(id);
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
  return corners.reduce((a, b) => a * b);
};

const solution2 = (inputLines: string[]) => {
  return inputLines.length;
};

export {solution1, solution2};
