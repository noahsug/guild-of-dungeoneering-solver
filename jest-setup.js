import _ from 'underscore';

jasmine.getEnv().beforeEach(function() {
  this.addMatchers({
    toContainKeys: function(keys) {
      var diff = _.difference(keys, Object.keys(this.actual));
      if (diff.length) {
        return false;
      }
      return true;
    },

    toContainKVs: function(kvs) {
      return _.every(kvs, (v, k) => {
        return this.actual.hasOwnProperty(k) && this.actual[k] === v;
      });
    },

    toEqualValues: function(values) {
      return _.valuesEqual(this.actual, values);
    },

    toContainValues: function(values) {
      return _.difference(_.values(values), _.values(this.actual)).length == 0;
    },
  });
})
