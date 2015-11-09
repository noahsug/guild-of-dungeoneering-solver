import _ from '../common';

describe('capitalize', () => {
  it('capitalizes the first letter of a string', () => {
    expect(_.capitalize('hey')).toBe('Hey');
  });
});

describe('permutate', () => {
  it('permutates through all possible combinations of values', () => {
    const permutater = _.permutate([1, 2, 3], [5, 6]);
  });
});
