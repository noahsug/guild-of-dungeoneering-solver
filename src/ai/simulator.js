import _ from '../utils/common';
import CardResolver from './card-resolver';
import GameStateAccessor from './game-state-accessor';

export default class Simulator {
  constructor() {
    this.cardResolver_ = new CardResolver();
    this.access_ = new GameStateAccessor();
  }

  getInitialStates(initialState) {
    const handIterator = _.combinate(initialState.playerDeck, 4);
    const playerHands = Array.from(handIterator);
    const enemyDraws = _.unique(initialState.enemyDeck);
    const states = [];
    const combinator = _.arrayCombinate(playerHands, enemyDraws);
    for (const [playerHand, enemyDraw] of combinator) {
      const state = this.cloneState(initialState);
      state.playerHand = playerHand;
      state.playerDeck = _.remove(state.playerDeck, ...playerHand);
      state.enemyHand = [enemyDraw];
      state.enemyDeck = _.remove(state.enemyDeck, enemyDraw);
      states.push(state);
    }
    return states;
  }

  getMoves(state) {
    return _.range(state.playerHand.length);
  }

  play(state, move) {
    const nextState = _.sample(this.getStates(state, move));
    this.copyStateInto(state, nextState);
    return this.getResult(state);
  }

  copyStateInto(dest, source) {
    dest.playerHealth = source.playerHealth;
    dest.playerDeck = source.playerDeck.slice();
    dest.playerHand = source.playerHand.slice();
    dest.playerDiscard = source.playerDiscard.slice();
    dest.enemyHealth = source.enemyHealth;
    dest.enemyDeck = source.enemyDeck.slice();
    dest.enemyHand = source.enemyHand.slice();
    dest.enemyDiscard = source.enemyDiscard.slice();
  }

  cloneState(state) {
    const clone = {};
    this.copyStateInto(clone, state);
    return clone;
  }

  getStates(state, move) {
    const nextState = this.cloneState(state);
    this.cardResolver_.resolve(nextState,
                               state.playerHand[move],
                               state.enemyHand[0]);

    // Shortcut: If the game is over, don't generate states.
    if (this.getResult(nextState)) {
      return [nextState];
    }

    this.discardAndPrepDraw_(nextState.playerDeck,
                             nextState.playerHand,
                             nextState.playerDiscard,
                             move);
    this.discardAndPrepDraw_(nextState.enemyDeck,
                             nextState.enemyHand,
                             nextState.enemyDiscard,
                             0);

    const states = [];
    const combinator = _.arrayCombinate(_.range(nextState.playerDeck.length),
                                        _.range(nextState.enemyDeck.length));
    for (const [playerDraw, enemyDraw] of combinator) {
      const state = this.cloneState(nextState);
      this.draw_(state.playerDeck, state.playerHand, playerDraw);
      this.draw_(state.enemyDeck, state.enemyHand, enemyDraw);
      states.push(state);
    }
    return states;
  }

  discardAndPrepDraw_(deck, hand, discard, move) {
    discard.push(hand[move]);
    hand.splice(move, 1);
    if (deck.length == 0) {
      deck.push(...discard);
      discard.length = 0;
    }
  }

  draw_(deck, hand, index) {
    const [card] = deck.splice(index, 1);
    hand.unshift(card);
  }

  getResult(state) {
    if (state.playerHealth <= 0) return -1;
    if (state.enemyHealth <= 0) return 1;
    return 0;
  }
}
