import _ from 'underscore';

jasmine.getEnv().beforeEach(function() {
  this.addMatchers({
    toContainKeys: function toContainKeys(keys) {
      var diff = _.difference(keys, Object.keys(this.actual));
      if (diff.length) {
        this.message = 'Expected object to contain key(s): ' + diff;
        return false;
      }
      return true;
    },
  });
})
