import _ from 'underscore';

jasmine.getEnv().beforeEach(function() {
  window.crypto = {
    getRandomValues: function(array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.random() * Math.pow(2, 32);
      }
    }
  };

  window.performance = {
    now: function() { return Date.now(); },
  };

  window.stats = {};

  this.addMatchers({
    toBeBetween: function(a, b) {
      return this.actual >= a && this.actual <= b;
    },

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

    toEqualFloat: function(value, fudge) {
      return Math.abs(this.actual - value) < fudge;
    },

    toEventuallyBe: function(value) {
      for (let i = 0; i < 1000; i++) {
        if (this.actual() == value) return true;
      }
      return false;
    },

    toEventuallyEqual: function(value) {
      for (let i = 0; i < 1000; i++) {
        if (_.isEqual(this.actual(), value)) return true;
      }
      return false;
    },

    toContainValidValue: function(isValid) {
      return _.some(this.actual, (v, k) => {
        return isValid(v, k);
      });
    },

    toContainOnlyValidValues: function(isValid) {
      return _.every(this.actual, (v, k) => {
        return isValid(v, k);
      });
    },
  });
})
