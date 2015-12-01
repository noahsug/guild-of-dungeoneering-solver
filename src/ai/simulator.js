import _ from '../utils/common';
import CardResolver from './card-resolver';
import GameState from './game-state';
import GameStateAccessor from './game-state-accessor';

export default class Simulator {
  constructor() {
    this.cardResolver_ = new CardResolver();
    this.access_ = new GameStateAccessor();
  }

  getInitialStateGenerator(initialState) {
    const generator = function*() {
      const cache = {};
      const handIterator = _.combinate(_.shuffle(initialState.playerDeck), 4);
      for (const playerHand of handIterator) {
        const enemyDeck = _.shuffle(initialState.enemyDeck);
        for (let i = 0; i < enemyDeck.length; i++) {
          const enemyDraw = enemyDeck[i];
          const id = playerHand.reduce((p, c) => {
            return p + Math.pow(5, c);
          }, Math.pow(5, 10) * enemyDraw);

          // DEBUGGING
          const debugState = this.cloneState(initialState);
          debugState.playerHand = playerHand;
          debugState.playerDeck = _.remove(
              debugState.playerDeck, ...playerHand);
          debugState.enemyHand = [enemyDraw];
          debugState.enemyDeck = _.remove(debugState.enemyDeck, enemyDraw);
          debugState.id = id;
          _.forEach(cache, (cachedState, cachedId) => {
            if (this.stateEquals(debugState, cachedState) != id === cachedId) {
              debugState.parent = null;
              cachedState.parent = null;
              throw new Error(`State cache failed - state: ${id} ${debugState} `
                              `cached: ${cachedId} ${cachedState}`);
            }
          });

          // TODO: Combine with getStateGenerator() logic.
          if (!cache[id]) {
            const state = this.cloneState(initialState);
            state.playerHand = playerHand;
            state.playerDeck = _.remove(state.playerDeck, ...playerHand);
            state.enemyHand = [enemyDraw];
            state.enemyDeck = _.remove(state.enemyDeck, enemyDraw);
            state.id = id;
            cache[id] = state;
          }
          yield cache[id];
        }
      }
    }.call(this);
    generator.length =
        _.binomialCoefficient(initialState.playerDeck.length, 4) *
        initialState.enemyDeck.length;
    return generator;
  }

  getMoves(state) {
    return _.unique(state.playerHand);
  }

  play(state, move) {
    const nextState = this.getStateGenerator(state, move).next().value;
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

  stateEquals(state1, state2) {
    return state1.playerHealth === state2.playerHealth &&
        _.valuesEqual(state1.playerDeck = state2.playerDeck) &&
        _.valuesEqual(state1.playerHand = state2.playerHand) &&
        _.valuesEqual(state1.playerDiscard = state2.playerDiscard) &&
        state1.enemyHealth === state2.enemyHealth &&
        _.valuesEqual(state1.enemyDeck = state2.enemyDeck) &&
        _.valuesEqual(state1.enemyHand = state2.enemyHand) &&
        _.valuesEqual(state1.enemyDiscard = state2.enemyDiscard);
  }

  getStateGenerator(state, move) {
    const nextState = this.cloneState(state);
    const result = this.cardResolver_.resolve(nextState,
                                              move,
                                              state.enemyHand[0]);

    // Shortcut: If the game is over, don't generate states.
    if (result) return _.iterator(nextState);

    this.discardAndPrepDraw_(nextState.playerDeck,
                             nextState.playerHand,
                             nextState.playerDiscard,
                             move);
    this.discardAndPrepDraw_(nextState.enemyDeck,
                             nextState.enemyHand,
                             nextState.enemyDiscard,
                             state.enemyHand[0]);

    const generator = function*() {
      const cache = {};
      nextState.playerDeck = _.shuffle(nextState.playerDeck);
      for (let playerDraw = 0; playerDraw < nextState.playerDeck.length;
           playerDraw++) {
        nextState.enemyDeck = _.shuffle(nextState.enemyDeck);
        for (let enemyDraw = 0; enemyDraw < nextState.enemyDeck.length;
           enemyDraw++) {
          const id = nextState.playerDeck[playerDraw] +
              nextState.enemyDeck[enemyDraw] * 31;

          // DEBUGGING
          const debugState = this.cloneState(nextState);
          this.draw_(debugState.playerDeck, debugState.playerHand, playerDraw);
          this.draw_(debugState.enemyDeck, debugState.enemyHand, enemyDraw);
          _.forEach(cache, (cachedState, cachedId) => {
            if (this.stateEquals(debugState, cachedState) != id === cachedId) {
              debugState.parent = null;
              cachedState.parent = null;
              throw new Error(`State cache failed - state: ${id} ${debugState} `
                              `cached: ${cachedId} ${cachedState}`);
            }
          });

          if (!cache[id]) {
            const state = this.cloneState(nextState);
            this.draw_(state.playerDeck, state.playerHand, playerDraw);
            this.draw_(state.enemyDeck, state.enemyHand, enemyDraw);
            state.id = id;
            cache[id] = state;
          }
          yield cache[id];
        }
      }
    }.call(this);
    generator.length = nextState.playerDeck.length * nextState.enemyDeck.length;
    return generator;
  }

  discardAndPrepDraw_(deck, hand, discard, move) {
    discard.push(move);
    hand.splice(hand.indexOf(move), 1);
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
    return this.cardResolver_.getResult(state);
  }
}
