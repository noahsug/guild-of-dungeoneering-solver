import _ from 'underscore';

jasmine.getEnv().beforeEach(function() {
  this.addMatchers({
    toContainKeys: function toContainKeys(keys) {
      var diff = _.difference(keys, Object.keys(this.actual));
      if (diff.length) {
        return false;
      }
      return true;
    },

    toContainKVs: function toContainKVs(kvs) {
      return _.every(kvs, (v, k) => {
        return this.actual.hasOwnProperty(k) && this.actual[k] === v;
      });
    },
  });
})
