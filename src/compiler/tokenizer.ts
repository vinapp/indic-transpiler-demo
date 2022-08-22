import { Token } from './types';

export function tokenizer(input: string): Token[] {
  const tokens: Token[] = [];

  let cursorPos = 0;
  while (cursorPos < input.length) {
    let char = input[cursorPos]!;
    // console.log("inside tokenizer "+ char)
    if (/\s/.test(char)) {
      if (char.charCodeAt(0) == 10) {
        tokens.push({ type: 'NewLineToken' });
      }
      cursorPos++; continue;
    }

    if (char === '(') {
      tokens.push({ type: 'OpenParenToken' });
      cursorPos++; continue;
    }

    if (char === ')') {
      tokens.push({ type: 'CloseParenToken' });
      cursorPos++; continue;
    }

    if (char === ';') {
      tokens.push({ type: 'SemiColonToken' });
      cursorPos++; continue;
    }

    if (char === '{') {
      tokens.push({ type: 'OpenParenCurlyToken' });
      cursorPos++; continue;
    }

    if (char === '}') {
      tokens.push({ type: 'CloseParenCurlyToken' });
      cursorPos++; continue;
    }

    if (char === '<') {
      tokens.push({ type: 'LessThanToken' });
      cursorPos++; continue;
    }

    if (char === '>') {
      tokens.push({ type: 'GreaterThanToken' });
      cursorPos++; continue;
    }

    if (char === '+') {
      tokens.push({ type: 'PlusToken' });
      cursorPos++; continue;
    }

    if (char === '-') {
      tokens.push({ type: 'MinusToken' });
      cursorPos++; continue;
    }

    if (char === '*') {
      tokens.push({ type: 'AsteriskToken' });
      cursorPos++; continue;
    }

    if (char === '/') {
      tokens.push({ type: 'SlashToken' });
      cursorPos++; continue;
    }

    if (char === '%') {
      tokens.push({ type: 'PercentToken' });
      cursorPos++; continue;
    }

    if (char === '=') {
      tokens.push({ type: 'EqualsToken' });
      cursorPos++; continue;
    }

    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char) && char != undefined) {
      let value = '';
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++cursorPos]!;
      }
      tokens.push({ type: 'NumericLiteral', value });
      continue;
    }

    // const LETTERS = /[a-z]/i;
    const SAM_LETTERS = /[\u0900-\u097F]/i;
    if (SAM_LETTERS.test(char)) {
      let value = '';
      while (SAM_LETTERS.test(char) &&  char != undefined) {
        value += char;
        char = input[++cursorPos]!;
      }
      tokens.push({ type: 'Identifier', value });
      continue;
    }

    const LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';
      while (LETTERS.test(char) &&  char != undefined) {
        value += char;
        char = input[++cursorPos]!;
      }
      tokens.push({ type: 'Identifier', value });
      continue;
    }

    throw new SyntaxError(`Unexpected token: "${char}"`);
  }

  return tokens;
}
