interface ListNode {
  value: number;
  next: ListNode;
  prev: ListNode;
}

const getNodeAt = (list: ListNode, length: number) => {
  let node = list;
  for (let i = 0; i < length; i++) {
    node = node.next;
  }
  return node;
};
const readList = (
  list: ListNode,
  length: number = Number.POSITIVE_INFINITY
) => {
  const result = [list.value];
  let node = list.next;
  for (let i = 0; i < length - 1 && node !== list; i++) {
    result.push(node.value);
    node = node.next;
  }
  return result;
};
const findNode = (list: ListNode, value: number) => {
  let node = list.next;
  while (node.value !== value && node !== list) {
    node = node.next;
  }
  if (node.value === value) {
    return node;
  }
  return null;
};

const nextDestinationValue = (value: number, N: number) => {
  value--;
  if (value < 1) {
    return N;
  }
  return value;
};

const getNodeLookup = (list: ListNode) => {
  const nodeLookup: ListNode[] = [];
  nodeLookup[list.value] = list;
  let node = list.next;
  while (node !== list) {
    nodeLookup[node.value] = node;
    node = node.next;
  }
  return nodeLookup;
};

const solution1 = (inputLines: string[]) => {
  const cupNums = inputLines[0].split('').map(Number);
  let cup: ListNode = {
    value: cupNums[0],
  } as any;
  let currentCup = cup;
  cupNums.slice(1).forEach(num => {
    let cup2: ListNode = {
      value: num,
      prev: cup,
    } as any;
    cup.next = cup2;
    cup = cup2;
  });
  cup.next = currentCup;
  currentCup.prev = cup;

  for (let i = 0; i < 100; i++) {
    const pickedUp = currentCup.next;
    const next = getNodeAt(pickedUp, 3);
    currentCup.next = next;
    next.prev = currentCup;
    let destination: ListNode | null;
    let destinationValue = nextDestinationValue(
      currentCup.value,
      cupNums.length + 1
    );
    while (!(destination = findNode(currentCup, destinationValue))) {
      destinationValue = nextDestinationValue(
        destinationValue,
        cupNums.length + 1
      );
    }

    const tail = getNodeAt(pickedUp, 2);
    tail.next = destination.next;
    tail.next.prev = tail;
    destination.next = pickedUp;
    pickedUp.prev = destination;

    currentCup = currentCup.next;
  }

  const node = findNode(currentCup, 1)!;

  return readList(node)
    .join('')
    .slice(1);
};

const solution2 = (inputLines: string[]) => {
  const N = 1_000_000;
  const LOOPS = 10_000_000;

  const cupNums = inputLines[0].split('').map(Number);
  let cup: ListNode = {
    value: cupNums[0],
  } as any;
  let currentCup = cup;
  cupNums.slice(1).forEach(num => {
    let cup2: ListNode = {
      value: num,
      prev: cup,
    } as any;
    cup.next = cup2;
    cup = cup2;
  });
  for (let i = cupNums.length + 1; i <= N; i++) {
    let cup2: ListNode = {
      value: i,
      prev: cup,
    } as any;
    cup.next = cup2;
    cup = cup2;
  }
  cup.next = currentCup;
  currentCup.prev = cup;

  const nodeLookup = getNodeLookup(currentCup);

  for (let i = 0; i < LOOPS; i++) {
    const pickedUp = currentCup.next;
    const forbiddenValues = readList(pickedUp, 3);
    const next = getNodeAt(pickedUp, 3);

    currentCup.next = next;
    next.prev = currentCup;
    let destinationValue = nextDestinationValue(currentCup.value, N);
    while (forbiddenValues.includes(destinationValue)) {
      destinationValue = nextDestinationValue(destinationValue, N);
    }
    let destination = nodeLookup[destinationValue];

    const tail = getNodeAt(pickedUp, 2);
    tail.next = destination.next;
    tail.next.prev = tail;
    destination.next = pickedUp;
    pickedUp.prev = destination;

    currentCup = currentCup.next;
  }

  return nodeLookup[1].next.value * nodeLookup[1].next.next.value;
};

export {solution1, solution2};
