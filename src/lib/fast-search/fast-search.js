import CardMover from './card-mover';
import CardOrder from './card-order';
import FastCache from './fast-cache';
import d from './debug';
import fs from './fast-state';
import CardResolver from '../game-engine/card-resolver';

export default class FastSearch {
  constructor() {
    this.cache_ = new FastCache();
    this.cardOrder_ = new CardOrder();
    this.cardMover_ = new CardMover();
    this.cardMover_.setCardOrder(this.cardOrder_);
    this.resolver_ = new CardResolver();
  }

  setInitialState(state) {
    this.cardOrder_.setInitialState(state);
    this.resolver_.setInitialState(state);
  }

  solve(state) {
    this.cardOrder_.randomize();
    return this.getResult_(state, 0);
  }

  getResult_(state, depth) {
    // TODO: Don't clone last state, can just directly mutate it.
    // TODO: Look ahead to see if any moves result in a 1 so we can prune early.
    // TODO: Implement steal - need to keep track of enemy deck?
    const len = state.player.hand.length;
    state.id = this.cache_.hash(state);
    for (let i = 0; i < len; i++) {
      const playerCard = state.player.hand[i];
      const enemyCard = this.cardOrder_.enemyDraws[depth];
      let result = this.cache_.getResult(state, playerCard, depth);
      if (result == undefined) {
        result = this.searchForResult_(state, playerCard, enemyCard, i, depth);
      }
      if (result == 1) return 1;
    }
    return 0;
  }

  searchForResult_(state, playerCard, enemyCard, i, depth) {
    const nextState = fs.clone(state);
    let result = this.resolver_.resolve(nextState, playerCard, enemyCard);
    if (result == undefined) {
      this.cardMover_.moveCards(nextState, i, depth);
      // TODO: Check cache to see if nextState has a result?
      result = this.getResult_(nextState, depth + 1);
    }
    this.cache_.cacheResult(state, playerCard, depth, result);
    return result;
  }
}
