function superscriptToNumber(superscript: string): number {
  const superscriptMap = {
    '⁰': '0',
    '¹': '1',
    '²': '2',
    '³': '3',
    '⁴': '4',
    '⁵': '5',
    '⁶': '6',
    '⁷': '7',
    '⁸': '8',
    '⁹': '9',
  } as any;

  const res = superscript
    .split('')
    .map((char) => superscriptMap[char] || char)
    .join('');
  return parseInt(res);
}

export { superscriptToNumber };
