import _ from 'underscore';

_.mixin({
  capitalize: (string) => {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  },

  // [1, 2, 1], 1 => [2, 1]
  remove: (array, ...values) => {
    const toRemove = {};
    values.forEach((v) => {
      if (!toRemove[v]) toRemove[v] = 0;
      toRemove[v]++;
    });
    return array.filter((v) => {
      if (toRemove[v]) {
        toRemove[v]--;
        return false;
      }
      return true;
    });
  },

  // [1, 2, 3], [5, 6] => [[1, 5], [1, 6], [2, 5], ...]
  arrayCombinate: (...arrays) => {
    const result = [];
    function* combinate(i) {
      for (let v = 0; v < arrays[i].length; v++) {
        result[i] = arrays[i][v];
        if (i == arrays.length - 1) {
          yield result.slice();
        } else {
          yield* combinate(i + 1);
        }
      }
    }
    return combinate(0);
  },

  // [1, 2, 3], [5, 6] => 6
  arrayCombinations: (...arrays) => {
    return arrays.reduce((prev, current) => {
      return prev * current.length;
    }, 1);
  },

  // [1, 2, 3], 2 => [[1, 2], [1, 3], [2, 3]]
  combinate: (array, size) => {
    const result = [];
    function* combinate(i, r) {
      if (size >= array.length) {
        yield array.slice();
        return;
      }
      for (let v = i; v < array.length; v++) {
        result[r] = array[v];
        if (r == size - 1) {
          yield result.slice();
        } else {
          yield* combinate(v + 1, r + 1);
        }
      }
    }
    return combinate(0, 0);
  },
});

export default _;
