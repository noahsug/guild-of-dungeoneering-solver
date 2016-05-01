import CardResolver from './card-resolver';
import gs from './game-state';
import GameStateEnumerator from './game-state-enumerator';
import _ from '../../utils/common';

export default class Simulator {
  constructor() {
    this.cardResolver_ = new CardResolver();
    this.stateEnumerator_ = new GameStateEnumerator();
  }

  getInitialStates(initialState) {
    this.cardResolver_.setInitialState(initialState);

    this.stateEnumerator_.setInitialState(initialState);
    this.stateEnumerator_.setState(initialState);
    this.stateEnumerator_.draw(
        gs.STARTING_HAND_SIZE + initialState.player.extraHandSizeEffect, 1);
    return this.stateEnumerator_.getStates();
  }

  get accuracy() {
    return this.stateEnumerator_.accuracyFactor_;
  }

  getMoves(state) {
    const visited = {};
    const moves = [];
    if (state.playerDraw != -1) {
      const card = state.player.deck[state.playerDraw];
      if (!visited[card]) {
        visited[card] = true;
        moves.push(card);
      }
    }
    const len = state.player.hand.length;
    for (let i = 0; i < len; i++) {
      const card = state.player.hand[i];
      if (!visited[card]) {
        visited[card] = true;
        moves.push(card);
      }
    }
    return moves;
  }

  getStates(state, move, optimize) {
    state = gs.newTurnClone(state);

    // TODO: Implement conceal.
    const a = performance.now();
    const gameOver = this.cardResolver_.resolve(
        state, move, state.enemy.hand[0]);
    const b = performance.now();
    window.stats.resolve += b - a;

    // Shortcut: If the game is over, don't generate states.
    if (gameOver) return [state];

    return this.getPossibleStates_(state, move, optimize);
  }

  getPossibleStates_(clonedState, move, optimize) {
    //const a = performance.now();
    const player = clonedState.player;
    const enemy = clonedState.enemy;
    this.stateEnumerator_.optimize = optimize;
    this.stateEnumerator_.setClonedState(clonedState);
    // TODO: Implement clone.
    this.stateEnumerator_.putInPlay(move);
    this.stateEnumerator_.steal(enemy.stealEffect);
    this.stateEnumerator_.cycle(player.cycleEffect);
    this.stateEnumerator_.draw(player.drawEffect);
    // TODO: Implement enemyDiscardEffect, the card not discarded is played next
    // by the enemy (put into enemy hand).
    this.stateEnumerator_.discard(player.discardEffect);
    this.stateEnumerator_.endTurn();
    //const b = performance.now();
    //window.stats.enumerate += b - a;
    return this.stateEnumerator_.getStates();
  }
}
