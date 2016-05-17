import _ from '../../utils/common';
import gs from '../game-engine/game-state';
import fs from './fast-state';
import p from './pretty-print';

export default class CardOrder {
  set initState(state) {
    this.depth_ = 0;
    this.enemyCards_ = gs.cards(state.enemy);
    this.enemyCardCycles_ = Math.ceil(fs.MAX_DEPTH / this.enemyCards_.length);
    this.enemyDraws = this.createEnemyDraws_(this.enemyCards_);
    this.endTurnDrawValues = new Array(fs.MAX_DEPTH);
    this.drawValues = new Array(fs.MAX_DEPTH);
    this.discardValues = new Array(fs.MAX_DEPTH);
    this.cycleDrawValues = new Array(fs.MAX_DEPTH);
    this.cycleDiscardValues = new Array(fs.MAX_DEPTH);
  }

  createEnemyDraws_(cards) {
    let enemyDraws = [];
    _.assert(cards.length > 0);
    while (enemyDraws.length < fs.MAX_DEPTH) {
      enemyDraws = enemyDraws.concat(cards);
    }
    return enemyDraws;
  }

  enemyPlayed(enemyCard) {
    const toSwap = this.enemyDraws.indexOf(enemyCard);
    this.enemyDraws[toSwap] = this.enemyDraws[this.depth_];
    this.enemyDraws[this.depth_] = enemyCard;
    this.depth_++;
  }

  randomize() {
    const len = this.enemyCards_.length;
    _.shuffleRange(this.enemyDraws, this.depth_, len);
    for (let i = 1; i < this.enemyCardCycles_; i++) {
      _.shuffleRange(this.enemyDraws, i * len, (i + 1) * len);
    }
    _.fill(this.endTurnDrawValues, Math.random);
    _.fill(this.drawValues, Math.random);
    _.fill(this.discardValues, Math.random);
    _.fill(this.cycleDrawValues, Math.random);
    _.fill(this.cycleDiscardValues, Math.random);
  }
}
