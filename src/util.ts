export const readGrid = (inputLines: string[]) =>
  inputLines.map(line => line.split(''));

export const numberSplit = (text: string, separator = '') =>
  text.split(separator).map(v => Number(v));

export const regexParse = <T>(
  text: string,
  regex: RegExp,
  mapFn: (result: string[]) => T
) => {
  const result = regex.exec(text);
  if (!result) {
    throw new Error('Can\'t parse text "' + text + '"');
  }
  return mapFn(result);
};
