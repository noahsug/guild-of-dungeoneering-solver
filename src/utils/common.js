import _ from 'underscore';

_.mixin({
  capitalize: (string) => {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  },

  permutate: (...arrays) => {
    const a = function*() { yield 5; };
    //function* permutate(arrays, result = [], i = 0) {
    //  //arrays[i].forEach((v) => {
    //  //  result[i] = v;
    //  //  if (i == arrays.length - 1) {
    //  //    yield result.slice();
    //  //  } else {
    //  //    permutate(result, arrays, i + 1);
    //  //  }
    //  //});
    //  //yield 5;
    //  return 5;
    //}
    //return permutate(arrays);
  },
});

export default _;
