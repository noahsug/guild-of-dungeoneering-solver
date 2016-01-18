import CardResolver from './card-resolver';
import GameStateAccessor from './game-state-accessor';
import GameStateEnumerator from './game-state-enumerator';
import _ from '../utils/common';

const STARTING_HAND_SIZE = 3;

export default class Simulator {
  constructor() {
    this.cardResolver_ = new CardResolver();
    this.stateEnumerator_ = new GameStateEnumerator();
    this.accessor_ = new GameStateAccessor();
  }

  getInitialStates(initialState) {
    this.cardResolver_.setInitialState(initialState);
    const player = this.accessor_.setState(initialState).player;
    const state = this.cloneState(initialState);

    this.stateEnumerator_.setClonedState(state);
    this.stateEnumerator_.draw(STARTING_HAND_SIZE +
                               player.extraHandSizeEffect, 1);
    return this.stateEnumerator_.getStates();
  }

  getMoves(state) {
    return _.unique(state.playerHand);
  }

  getStates(state, move) {
    this.accessor_.setState(state);
    state = this.accessor_.newTurnClone();
    this.accessor_.setState(state);

    // TODO: Implement conceal.
    const gameOver = this.cardResolver_.resolve(
        state, move, this.accessor_.enemy.hand[0]);

    // Shortcut: If the game is over, don't generate states.
    if (gameOver) return [state];

    return this.getPossibleStates_(state, move);
  }

  getPossibleStates_(clonedState, move) {
    const {player, enemy} = this.accessor_;
    this.stateEnumerator_.setClonedState(clonedState);
    this.stateEnumerator_.putInPlay(move);
    // TODO: Implement steal and clone.
    this.stateEnumerator_.cycle(player.cycleEffect);
    this.stateEnumerator_.draw(player.drawEffect);
    this.stateEnumerator_.discard(player.discardEffect);
    this.stateEnumerator_.endTurn();
    return this.stateEnumerator_.getStates();
  }

  getResult(state) {
    return GameStateAccessor.instance.setState(state).result;
  }

  cloneState(state) {
    return GameStateAccessor.clone(state);
  }
}
