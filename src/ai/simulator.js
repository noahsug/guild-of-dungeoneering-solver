import _ from '../utils/common';

export default class Simulator {
  getInitialStates(initialState) {
    const handIterator = _.combinate(_.unique(initialState.playerDeck), 4);
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

  play(state, moveIndex) {
    const nextState = _.sample(this.getStates(state, moveIndex));
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

  getStates(state, moveIndex) {
    const nextState = this.cloneState(state);
    this.resolve_(nextState,
                  state.playerHand[moveIndex],
                  state.enemyHand[0]);

    // Shortcut: If the game is over, don't generate states.
    if (this.getResult(nextState)) {
      return [nextState];
    }

    const playerDraws = this.discardAndGetDraws_(nextState.playerDeck,
                                                 nextState.playerHand,
                                                 nextState.playerDiscard,
                                                 moveIndex);
    const enemyDraws = this.discardAndGetDraws_(nextState.enemyDeck,
                                                nextState.enemyHand,
                                                nextState.enemyDiscard,
                                                0);

    const states = [];
    const combinator = _.arrayCombinate(playerDraws, enemyDraws);
    for (const [playerDraw, enemyDraw] of combinator) {
      const state = this.cloneState(nextState);
      this.draw_(state.playerDeck, state.playerHand, playerDraw);
      this.draw_(state.enemyDeck, state.enemyHand, enemyDraw);
      states.push(state);
    }
    return states;
  }

  discardAndGetDraws_(deck, hand, discard, moveIndex) {
    discard.push(hand[moveIndex]);
    hand.splice(moveIndex, 1);
    if (deck.length == 0) {
      deck.push(...discard);
      discard.length = 0;
    }
    return _.range(deck.length);
  }

  draw_(deck, hand, moveIndex) {
    const [move] = deck.splice(moveIndex, 1);
    hand.unshift(move);
  }

  resolve_(state, playerMove, enemyMove) {
    state.playerHealth -= enemyMove;
    state.enemyHealth -= playerMove;
  }

  getResult(state) {
    if (state.playerHealth <= 0) return -1;
    if (state.enemyHealth <= 0) return 1;
    return 0;
  }
}
