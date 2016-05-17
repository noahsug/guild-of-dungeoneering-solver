import _ from 'underscore';

_.mixin({
  simpleMovingAverage: (period) => {
    return new SMA(period);
  },
});

class SMA {
  constructor(period) {
    this.prevValues_ = new Array(period);
    this.index_ = 0;
    this.sum_ = 0;
    this.count_ = 0;
  }

  get period() {
    return this.prevValues_.length;
  }

  set period(period) {
    const diff = period - this.prevValues_.length;
    if (diff < 0) _.fail('unimplemented');
    this.prevValues_ = this.prevValues_.slice(0, this.index_)
        .concat(new Array(diff))
        .concat(this.prevValues_.slice(this.index_));
  }

  get value() {
    return this.sum_ / this.count_;
  }

  add(value) {
    let prevValue = this.prevValues_[this.index_];
    if (prevValue == undefined) {
      this.count_++;
      prevValue = 0;
    }
    this.sum_ += value - prevValue;
    this.prevValues_[this.index_] = value;
    this.index_ = (this.index_ + 1) % this.prevValues_.length;
  }

  get variance() {
    const avg = this.value;
    let sum = 0;
    let count = 0;
    const increment = this.count_ > 12 ? 4 : 1;
    for (let i = 0; i < this.count_; i += increment) {
      const value = this.prevValues_[i];
      if (value == undefined) continue;
      sum += Math.pow(value - avg, 2);
      count++;
    }
    return sum / count;
  }
}
