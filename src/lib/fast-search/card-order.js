import _ from '../../utils/common';
import gs from '../game-engine/game-state';

// Max possible depth.
const MAX_DEPTH = 200;

export default class CardOrder {
  setInitialState(state) {
    this.enemyCards_ = gs.cards(state.enemy);
    this.enemyCardCycles_ = Math.ceil(MAX_DEPTH / this.enemyCards_.length);
    this.enemyDraws = this.createEnemyDraws_(this.enemyCards_);
    this.endTurnDrawValues = new Array(MAX_DEPTH);
    this.drawValues = new Array(MAX_DEPTH);
    this.discardValues = new Array(MAX_DEPTH);
    this.cycleDrawValues = new Array(MAX_DEPTH);
    this.cycleDiscardValues = new Array(MAX_DEPTH);
  }

  createEnemyDraws_(cards) {
    let enemyDraws = [];
    _.assert(cards.length > 0);
    while (enemyDraws.length < MAX_DEPTH) {
      enemyDraws = enemyDraws.concat(cards);
    }
    return enemyDraws;
  }

  randomize() {
    const len = this.enemyCards_.length;
    for (let i = 0; i < this.enemyCardCycles_; i++) {
      _.shuffleRange(this.enemyDraws, i * len, (i + 1) * len);
    }
    _.fill(this.endTurnDrawValues, Math.random);
    _.fill(this.drawValues, Math.random);
    _.fill(this.discardValues, Math.random);
    _.fill(this.cycleDrawValues, Math.random);
    _.fill(this.cycleDiscardValues, Math.random);
  }
}
