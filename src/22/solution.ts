interface QueueNode {
  next: QueueNode | null;
  value: number;
}

const readInput = (inputLines: string[]) => {
  const players: {
    head: QueueNode | null;
    tail: QueueNode | null;
  }[] = [];

  let deck: QueueNode | null = null;
  for (let line of inputLines) {
    if (line.includes(':')) {
      continue;
    }
    if (line === '') {
      if (deck) {
        players[players.length - 1].tail = deck;
      }
      deck = null;
    } else {
      const card: QueueNode = {
        next: null,
        value: Number(line),
      };
      if (deck) {
        deck.next = card;
        deck = card;
      } else {
        deck = card;
        players.push({head: deck, tail: null});
      }
    }
  }
  players[players.length - 1].tail = deck;

  return players;
};

const solution1 = (inputLines: string[]) => {
  const players = readInput(inputLines);

  while (players.every(deck => !!deck.head)) {
    const cards = players.map(deck => deck.head!);
    players.forEach((deck, i) => (players[i].head = deck.head!.next));
    const winningCard = cards
      .map((card, i) => [card, i] as const)
      .reduce((cardA, cardB) =>
        cardA[0].value > cardB[0].value ? cardA : cardB
      );

    cards
      .sort(({value: a}, {value: b}) => b - a)
      .forEach(card => {
        card.next = null;
        players[winningCard[1]].tail!.next = card;
        players[winningCard[1]].tail = card;
      });
  }

  const winningPlayer = players[0].head ? players[0] : players[1];

  let cards: QueueNode[] = [];
  for (let i = 0; winningPlayer.head; i++) {
    const card = winningPlayer.head;
    cards.push(card);
    winningPlayer.head = card.next;
  }

  // 34958
  return cards.reduce((a, c, i) => a + c.value * (cards.length - i), 0);
};

const readInput2 = (inputLines: string[]) => {
  const players: number[][] = [];

  let deck: number[] = [];
  for (let line of inputLines) {
    if (line.includes(':')) {
      players.push(deck);
      continue;
    }
    if (line === '') {
      deck = [];
    } else {
      deck.push(Number(line));
    }
  }

  return players;
};

const getDeckId = (deck: number[]) => deck.join(',');
// deck.reduce((acc, v, i) => acc + BigInt(v) * (BigInt(v) >> BigInt(i)), 0n);
const getPlayId = (decks: number[][]) =>
  decks.map(deck => getDeckId(deck)).join('|');

const round = (
  decks: number[][],
  roundCache: Set<string>,
  gameId: number,
  id: number
): [number, number[][], boolean] => {
  // console.log();
  // console.log(`-- Round ${id} (Game ${gameId}) --`);
  // decks.forEach((deck, i) =>
  //   console.log(`Player ${i + 1}'s deck: ` + deck.join(', '))
  // );

  const playId = getPlayId(decks);
  if (roundCache.has(playId)) {
    return [0, decks, true];
  }
  roundCache.add(playId);

  const cards = decks.map((deck, i) => {
    const [card, ...rest] = deck;
    decks[i] = rest;
    return card;
  });
  // cards.forEach((card, i) => console.log(`Player ${i + 1} plays: ` + card));

  let result: number;
  if (cards.every((card, i) => decks[i].length >= card)) {
    const res = game(
      decks.map((v, i) => v.slice(0, cards[i])),
      gameId + 1
    );
    result = res[0];
  } else {
    const winningCard = cards
      .map((card, i) => [card, i] as const)
      .reduce((cardA, cardB) => (cardA[0] > cardB[0] ? cardA : cardB));
    result = winningCard[1];
  }
  // console.log(`Player ${result + 1} wins round ${id} of game ${gameId}!`);

  [cards[result], cards[1 - result]].forEach(card => {
    decks[result].push(card);
  });
  return [result, decks, false];
};

const game = (decks: number[][], id: number): [number, number[]] => {
  const roundCache = new Set<string>();
  // console.log();
  // console.log(`=== Game ${id} ===`);
  let winning: number = -1;
  let i = 0;
  while (decks.every(deck => deck.length)) {
    const result = round(decks, roundCache, id, ++i);
    winning = result[0];
    decks = result[1];
    if (result[2]) break;
  }

  return [winning, decks[winning]];
};

const solution2 = (inputLines: string[]) => {
  let decks = readInput2(inputLines);

  const [, deck] = game(decks, 1);

  // 9400
  return deck.reduce((a, c, i) => a + c * (deck.length - i), 0);
};

export {solution1, solution2};
