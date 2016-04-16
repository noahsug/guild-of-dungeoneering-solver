import CardResolver from './card-resolver';
import GameStateAccessor from './game-state-accessor';
import GameStateEnumerator from './game-state-enumerator';
import _ from '../../utils/common';

export default class Simulator {
  constructor() {
    this.cardResolver_ = new CardResolver();
    this.stateEnumerator_ = new GameStateEnumerator();
    this.accessor_ = new GameStateAccessor();
  }

  getInitialStates(initialState) {
    this.cardResolver_.setInitialState(initialState);
    const player = this.accessor_.setState(initialState).player;
    const state = this.accessor_.clone();

    this.stateEnumerator_.setInitialState(initialState);
    this.stateEnumerator_.setClonedState(state);
    this.stateEnumerator_.draw(GameStateAccessor.STARTING_HAND_SIZE +
                               player.extraHandSizeEffect, 1);
    return this.stateEnumerator_.getStates();
  }

  getMoves(state) {
    const visited = {};
    const moves = [];
    if (state.playerDraw != undefined) {
      const card = state.playerDeck[state.playerDraw];
      if (!visited[card]) {
        visited[card] = true;
        moves.push(card);
      }
    }
    const len = state.playerHand.length;
    for (let i = 0; i < len; i++) {
      const card = state.playerHand[i];
      if (!visited[card]) {
        visited[card] = true;
        moves.push(card);
      }
    }
    return moves;
  }

  getStates(state, move, optimize) {
    state = this.accessor_.setState(state).newTurnClone();
    this.accessor_.setState(state);

    // TODO: Implement conceal.
    const a = performance.now();
    const gameOver = this.cardResolver_.resolve(
        state, move, this.accessor_.enemy.hand[0]);
    const b = performance.now();
    window.stats.resolve += b - a;

    // Shortcut: If the game is over, don't generate states.
    if (gameOver) return [state];

    return this.getPossibleStates_(state, move, optimize);
  }

  getPossibleStates_(clonedState, move, optimize) {
    const a = performance.now();
    const {player, enemy} = this.accessor_;
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
    const b = performance.now();
    window.stats.enumerate += b - a;
    return this.stateEnumerator_.getStates();
  }

  getResult(state) {
    return GameStateAccessor.instance.setState(state).result;
  }
}
