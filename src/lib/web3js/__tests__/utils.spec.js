import { max, bg } from '../indexV2';

describe('utils', () => {
  test('max()', () => {
    const input = [bg(11), bg(3)];
    const output = bg(11);
    expect(max(...input)).toEqual(output);
  });
});
