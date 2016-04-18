import gs from './game-state';
import _ from '../../utils/common';

export default class Simulator {
  constructor() {
    this.accuracyFactor_ = 30;
    this.optimize = false;
  }

  setInitialState(state) {
    this.initialState_ = state;
    const complexity = gs.cards(state.player).length *
          gs.cards(state.enemy).length;
    if (complexity > 69) {
      this.accuracyFactor_ = 2;
    } else if (complexity > 65) {
      this.accuracyFactor_ = 3;
    } else if (complexity > 55) {
      this.accuracyFactor_ = 4;
    } else if (complexity > 50) {
      this.accuracyFactor_ = 5;
    } else if (complexity > 47) {
      this.accuracyFactor_ = 12;
    } else {
      this.accuracyFactor_ = 30;
    }
    this.accuracyFactor_ = 300;
    console.log('complexity', complexity, ', speed', this.accuracyFactor_);
  }

  setState(state) {
    this.setClonedState(gs.clone(state));
  }

  setClonedState(state) {
    this.states_ = [state];
    this.states_.actualLen = 1;
  }

  getStates() {
    return this.states_;
  }

  putInPlay(playerCard) {
    const state = this.states_[0];
    this.playerInPlay_ = playerCard;
    const len = state.player.hand.length;
    const index = state.player.hand.indexOf(playerCard);
    state.player.hand[index] = state.player.hand[len - 1];
    state.player.hand.length = len - 1;

    this.enemyInPlay_ = state.enemy.hand[0];
    state.enemy.hand = [];
  }

  endTurn() {
    const numStates = this.states_.length;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      const state = this.states_[stateIndex];
      state.player.discard.push(this.playerInPlay_);
      gs.prepDraw(state.player);
      state.enemy.discard.push(this.enemyInPlay_);
      gs.prepDraw(state.enemy);
    }

    this.playerDrawAtEndOfTurn_();
    this.enemyDrawAtEndOfTurn_();
  }

  playerDrawAtEndOfTurn_() {
    const player = this.states_[0].player;
    const deckLen = player.deck.length;
    const numChoices = this.optimize ?
        Math.min(deckLen, this.accuracyFactor_) : deckLen;
    if (numChoices == 0) return;
    const startingIndex = Math.floor(Math.random() * deckLen);
    const numStates = this.states_.length;
    let lastStateIndex = numStates - 1;
    this.states_.length *= numChoices;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      const state = this.states_[stateIndex];
      state.playerDraw = startingIndex;
      for (let i = 1; i < numChoices; i++) {
        const clone = gs.shallowClone(state);
        clone.playerDraw = (startingIndex + i) % deckLen;
        this.states_[lastStateIndex + i] = clone;
      }
      lastStateIndex += numChoices - 1;
    }
  }

  enemyDrawAtEndOfTurn_() {
    const enemy = this.states_[0].enemy;
    const deckLen = enemy.deck.length;
    const numChoices = this.optimize ?
        Math.min(deckLen, this.accuracyFactor_) : deckLen;
    if (numChoices == 0) return;
    const startingIndex = Math.floor(Math.random() * deckLen);
    const numStates = this.states_.length;
    let lastStateIndex = numStates - 1;
    this.states_.length *= numChoices;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      const state = this.states_[stateIndex];
      state.enemyDraw = startingIndex;
      for (let i = 1; i < numChoices; i++) {
        const clone = gs.shallowClone(state);
        clone.enemyDraw = (startingIndex + i) % deckLen;
        this.states_[lastStateIndex + i] = clone;
      }
      lastStateIndex += numChoices - 1;
    }
  }

  draw(playerCount, enemyCount = 0) {
    if (playerCount) this.playerDraw_('player', playerCount);
    if (enemyCount) this.playerDraw_('enemy', enemyCount);
  }

  playerDraw_(type, count) {
    const player = this.states_[0][type];
    if (count >= player.deck.length) {
      if (!player.deck.length) {
        if (!player.discard.length) return;
        this.forEachState_(state => gs.prepDraw(state[type]));
        this.playerDraw_(type, count);
        return;
      }
      count -= player.deck.length;
      this.forEachState_(state => gs.drawAll(state[type]));
      if (!player.discard.length || !count) return;
      this.forEachState_(state => gs.prepDraw(state[type]));
      this.playerDraw_(type, count);
      return;
    }

    const numChoices = player.deck.length;
    this.states_.length *= _.factorial(numChoices) /
        _.factorial(numChoices - count);
    for (let i = 0; i < count; i++) {
      this.forEachStateCallNTimes_((state, i) => {
        gs.draw(state[type], i);
      }, numChoices - i);
    }
  }

  discard(count) {
    if (!count) return;
    const player = this.states_[0].player;
    if (player.hand.length <= count) {
      if (!player.hand.length) return;
      gs.discardAll(player);
      return;
    }

    const numChoices = player.hand.length;
    this.states_.length *= _.factorial(numChoices) /
        _.factorial(numChoices - count);
    for (let i = 0; i < count; i++) {
      this.forEachStateCallNTimes_((state, i) => {
        gs.discard(state.player, i);
      }, numChoices - i);
    }
  }

  cycle(count) {
    if (!count) return;
    const player = this.states_[0].player;
    count = Math.min(count, player.hand.length);
    this.discard(count);
    this.playerDraw_('player', count);
  }

  steal(count) {
    if (!count) return;
    const player = this.states_[0].player;
    const enemy = this.states_[0].enemy;
    count = Math.min(count, player.hand.length);
    if (!count) return;

    const numChoices = player.hand.length;
    this.states_.length *= _.factorial(numChoices) /
        _.factorial(numChoices - count);
    for (let i = 0; i < count; i++) {
      this.forEachStateCallNTimes_((state, i) => {
        gs.steal(state.enemy, state.player, i);
      }, numChoices - i);
    }
  }

  forEachState_(changeStateFn) {
    const numStates = this.states_.length;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      changeStateFn(this.states_[stateIndex]);
    }
  }

  forEachStateCallNTimes_(changeStateFn, numChoices) {
    const numStates = this.states_.actualLen;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      this.addStates_(stateIndex, changeStateFn, numChoices);
    }
  }

  addStates_(stateIndex, changeStateFn, numChoices) {
    const state = this.states_[stateIndex];
    for (let i = 1; i < numChoices; i++) {
      const clone = gs.clone(state);
      changeStateFn(clone, i);
      this.states_[this.states_.actualLen++] = clone;
    }
    changeStateFn(state, 0);
  }
}
