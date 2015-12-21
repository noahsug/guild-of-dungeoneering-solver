import CardResolver from './card-resolver';
import GameStateAccessor from './game-state-accessor';
import GameStateEnumerator from './game-state-enumerator';
import _ from '../utils/common';

// Base number of cards player draws at start of game.
const INITIAL_DRAW = 4;

export default class Simulator {
  constructor() {
    this.cardResolver_ = new CardResolver();
    this.stateEnumerator_ = new GameStateEnumerator();
    this.accessor_ = new GameStateAccessor();
  }

  getInitialStates(initialState) {
    this.stateEnumerator_.setState(initialState);
    this.stateEnumerator_.draw(INITIAL_DRAW, 1);
    return this.stateEnumerator_.getStates();
  }

  getMoves(state) {
    return _.unique(state.playerHand);
  }

  getStates(state, move) {
    state = this.cloneState(state);
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

  play(state, move) {
    const nextState = _.sample(this.getStates(state, move));
    GameStateAccessor.copyInto(state, nextState);
    return this.getResult(state);
  }

  cloneState(state) {
    return GameStateAccessor.clone(state);
  }
}
