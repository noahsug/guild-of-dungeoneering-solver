import _ from '../common';

describe('capitalize', () => {
  it('capitalizes the first letter of a string', () => {
    expect(_.capitalize('hey')).toBe('Hey');
  });
});

describe('remove', () => {
  it('removes first instance of each value', () => {
    expect(_.remove([1, 2, 1], 1)).toEqual([2, 1]);
  });
});

describe('arrayCombinations', () => {
  it('returns the number of combinations from arrays', () => {
    const arrays = [[1, 2, 3], [5, 6], [8]];
    expect(_.arrayCombinations(...arrays)).toBe(6);
  });
});

describe('arrayCombinate', () => {
  it('iterates through all possible combinations of values from arrays', () => {
    const combinator = _.arrayCombinate([1, 2, 3], [5, 6]);
    const expected = [[1, 5], [1, 6], [2, 5], [2, 6], [3, 5], [3, 6]];
    expected.forEach((value) => {
      expect(combinator.next().value).toEqual(value);
    });
  });
});

describe('combinate', () => {
  it('iterates through all possible combinations of values', () => {
    const combinator = _.combinate([1, 2, 3], 2);
    expect(Array.from(combinator)).toEqual([[1, 2], [1, 3], [2, 3]]);
  });
});

describe('sum', () => {
  it('sums an array of values', () => {
    expect(_.sum([1, 2, 3, 4])).toEqual(10);
  });
});

describe('avg', () => {
  it('computes the average over an array of values', () => {
    expect(_.avg([1, 2, 3, 4])).toEqual(10 / 4);
  });

  it('can be passed an iteratee', () => {
    const iteratee = (v) => v * 2;
    expect(_.avg([1, 2, 3, 4], iteratee)).toEqual(20 / 4);
  });
});

describe('decimals', () => {
  it('sets the number of decimals', () => {
    expect(_.decimals(Math.PI, 2)).toEqual(3.14);
  });
});
