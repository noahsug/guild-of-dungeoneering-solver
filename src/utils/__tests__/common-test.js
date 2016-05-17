import _ from '../common';

describe('remove', () => {
  it('removes first instance of each value', () => {
    expect(_.remove([1, 2, 1], 1)).toEqual([2, 1]);
  });
});

describe('numArrayCombinations', () => {
  it('returns the number of combinations from arrays', () => {
    const arrays = [[1, 2, 3], [5, 6], [8]];
    expect(_.numArrayCombinations(...arrays)).toBe(6);
  });
});

describe('tuplesCombinationsGenerator', () => {
  it('iterates through all possible combinations of values from arrays', () => {
    const combinator = _.tuplesCombinationsGenerator([1, 2, 3], [5, 6]);
    const expected = [[1, 5], [1, 6], [2, 5], [2, 6], [3, 5], [3, 6]];
    expected.forEach((value) => {
      expect(combinator.next().value).toEqual(value);
    });
  });
});

describe('combinationsGenerator', () => {
  it('iterates through all possible combinations of values', () => {
    const combinator = _.combinationsGenerator([1, 2, 3], 2);
    const values = [];
    for (const value of combinator) values.push(value.slice());
    expect(values).toEqual([[1, 2], [1, 3], [2, 3]]);
  });
});

describe('sum', () => {
  it('sums an array of values', () => {
    expect(_.sum([1, 2, 3, 4])).toEqual(10);
  });

  it('can take an iteratee', () => {
    const list = [{age: 2}, {age: 5}, {age: 1}];
    const result = _.sum(list, _.iteratee('age'));
    expect(result).toBe(8);
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

describe('iterator', () => {
  it('iterates over the given values ', () => {
    const i = _.iterator(1, 2, 3);
    expect(i.next().value).toBe(1);
    expect(i.next().value).toBe(2);
    expect(i.next().value).toBe(3);
    expect(i.next().done).toBe(true);
  });

  it('provides a length', () => {
    const i = _.iterator(1, 2, 3);
    expect(i.length).toBe(3);
  });
});

describe('fastRemoveAt', () => {
  it('removes a value at a given index ', () => {
    const a = [1, 2, 3, 4, 5];
    const removed = _.fastRemoveAt(a, 2);
    expect(removed).toBe(3);
    expect(a).toEqualValues([1, 2, 4, 5]);
  });
});

describe('expand', () => {
  it('expands an array ', () => {
    const a = [1, 2, 3];
    const fn = item => item.toString().repeat(item).split('');
    const result = _.expand(a, fn);
    expect(result).toEqual(['1', '2', '2', '3', '3', '3']);
  });
});

describe('shuffleRange', () => {
  it('Shuffles range of values between [startIndex, endIndex)', () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8];
    const shuffled = a.slice();
    _.shuffleRange(shuffled, 2, 6);  // [3, 4, 5, 6]
    expect(shuffled.slice(0, 2)).toEqual(a.slice(0, 2));
    expect(shuffled.slice(2, 6)).toContainValues(a.slice(2, 6));
    expect(shuffled.slice(6, 8)).toEqual(a.slice(6, 8));
  });
});
