const decodeLine = (line: string) => {
  return {
    row: Number.parseInt(
      line
        .slice(0, 7)
        .split('')
        .map(v => (v === 'F' ? '0' : '1'))
        .join(''),
      2
    ),
    col: Number.parseInt(
      line
        .slice(7)
        .split('')
        .map(v => (v === 'L' ? '0' : '1'))
        .join(''),
      2
    ),
  };
};

const solution1 = (inputLines: string[]) => {
  const seats = inputLines.map(decodeLine);

  return seats.reduce((max, line) => Math.max(max, line.row * 8 + line.col), 0);
};

const solution2 = (inputLines: string[]) => {
  const seats = inputLines.map(decodeLine);
  const allSeats = new Set(new Array(1024).fill(0).map((_, i) => i));

  seats.forEach(seat => allSeats.delete(seat.row * 8 + seat.col));
  const reaminingSeats = [...allSeats];
  let prev = reaminingSeats[0];
  let i = 1;
  while (prev + 1 === reaminingSeats[i]) {
    prev = reaminingSeats[i];
    i++;
  }

  return reaminingSeats[i];
};

export {solution1, solution2};
