import FastSearch from './fast-search';
import fs from './fast-state';
import gs from '../game-engine/game-state';
import GameStateFactory from '../game-state-factory';
import _ from '../../utils/common';

export default class FastSolver {
  init(player, enemy) {
    const initialState = GameStateFactory.create(player, enemy);
    this.search_ = new FastSearch();
    this.search_.setInitialState(initialState);
    this.startingStates = this.getStartingStates_(initialState);
    this.count = 0;
    this.sum = 0;
  }

  done() {
    return this.count == this.startingStates.length;
  }

  next() {
    const state = this.startingStates[this.count];
    this.sum += this.search_.solve(state);
    this.count++;
  }

  getStartingStates_(initState) {
    const numStates = _.choose(
        initState.player.deck.length, gs.STARTING_HAND_SIZE);
    const states = new Array(numStates);
    const playerHandGen = _.combinationsGenerator(
        initState.player.deck, gs.STARTING_HAND_SIZE);
    let i = 0;
    for (const playerHand of playerHandGen) {
      const state = fs.cloneStats(initState);
      state.player.deck = _.removeAll(initState.player.deck, playerHand);
      state.player.hand = playerHand;
      state.player.discard = [];
      _.shuffleInPlace(state.player.deck);
      states[i++] = state;
    }
    _.shuffleInPlace(states);
    return states;
  }
}
