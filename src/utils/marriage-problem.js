//import _ from 'underscore';
//
//_.mixin({stabalizePairs});
//
//class Item {
//  constructor(key) {
//    this.key = key;
//    this.pair = null;
//    this.candidates_ = [];
//    this.candidateIndex_ = 0;
//  }
//
//  rank(item) {
//    for (let i = 0; i < this.candidates_.length; i++) {
//      if (this.candidates_[i] === item) return i;
//    }
//    return this.candidates_.length + 1;
//  }
//
//  prefers(item) {
//    return this.rank(item) < this.rank(this.pair);
//  }
//
//  nextCandidate() {
//    if (this.candidateIndex_ >= this.candidates_.length) return null;
//    return this.candidates_[this.candidateIndex_++];
//  }
//
//  pairWith(item) {
//    if (item.pair) item.pair.pair = null;
//    item.pair = this;
//    if (this.pair) this.pair.pair = null;
//    this.pair = item;
//  }
//}
//
//function stabalizePairs(itemsA, itemsB) {
//  let done = false;
//  while (!done) {
//    done = true;
//    for (let i = 0; i < itemsA.length; i++) {
//      let itemA = itemsA[i];
//      if (!itemA.pair) {
//        done = false;
//        let itemB = itemA.nextCandidate();
//        if (!itemB.pair || itemB.prefers(itemA))
//          itemA.pairWith(itemB);
//      }
//    }
//  }
//}
