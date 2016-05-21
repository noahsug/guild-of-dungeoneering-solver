import FastSearch from './fast-search';
import CardMover from './card-mover';
import FastHash from './fast-hash';
import CardOrder from './card-order';
import fs from './fast-state';
import gs from '../game-engine/game-state';
import CardResolver from '../game-engine/card-resolver';
import GameStateFactory from '../game-state-factory';
import _ from '../../utils/common';

export default class FastSolver {
  init(player, enemy) {
    const initState = GameStateFactory.create(player, enemy);
    this.prevStates_ = [];
    this.depth_ = 0;
    this.count = 0;
    this.averageResult_ = _.simpleMovingAverage(200);
    this.record = [];

    this.mover_ = new CardMover();
    this.order_ = new CardOrder();
    this.order_.initState = initState;
    this.hasher_ = new FastHash();
    this.hasher_.order = this.order_;
    this.resolver_ = new CardResolver();
    this.resolver_.setInitialState(initState);
    this.search_ = new FastSearch();
    this.search_.order = this.order_;
    this.search_.hasher = this.hasher_;
    this.search_.initState = initState;

    this.states = this.mover_.getStartingStates(initState);
  }

  next() {
    const index = this.count % this.states.length;
    this.count++;
    if (index == 0) _.shuffleInPlace(this.states);
    this.order_.randomize();
    const state = this.states[index];
    _.time('search');
    const result = this.search_.solve(state, this.depth_);
    window.stats.search += _.time('search');
    this.averageResult_.add(result);
    if (this.count % (this.states.length * 5) == 0) {
      this.averageResult_.period += this.states.length;
    }

    this.record.push({
      state,
      result,
      enemyCard: this.order_.enemyDraws[this.depth_],
    });
  }

  get result() {
    return this.averageResult_.value;
  }

  play(state, playerCard, enemyCard) {
    const resolvedState = fs.clone(state);
    const result = this.resolver_.resolve(resolvedState, playerCard, enemyCard);
    if (result != undefined) return;
    this.order_.enemyPlayed(enemyCard);
    this.prevStates_.push(this.states);
    this.depth_++;
    const playerCardIndex = state.player.hand.indexOf(playerCard);
    this.states = this.mover_.getNextStates(resolvedState, playerCardIndex);
  }
}
