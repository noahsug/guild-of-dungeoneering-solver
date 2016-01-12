import GameStateAccessor from './game-state-accessor';
import _ from '../utils/common';

export default class Simulator {
  constructor() {
    this.accessor_ = new GameStateAccessor();
  }

  setState(state) {
    this.setClonedState(GameStateAccessor.clone(state));
  }

  setClonedState(state) {
    this.states_ = [state];
    this.states_.actualLen = 1;
  }

  getStates() {
    return this.states_;
  }

  putInPlay(playerCard) {
    this.accessor_.setState(this.states_[0]);
    this.playerPlay_(this.accessor_.player, playerCard);
    this.playerPlay_(this.accessor_.enemy, this.accessor_.enemy.hand[0]);
  }

  playerPlay_(player, card) {
    const cardIndex = player.hand.indexOf(card);
    player.inPlay = player.putInPlay(cardIndex);
  }

  endTurn() {
    this.playerEndTurn_(this.accessor_.player);
    this.playerEndTurn_(this.accessor_.enemy);
  }

  playerEndTurn_(player) {
    this.forEachState_(this.stateEndTurn_.bind(this, player));
    this.playerDrawOne_(player);
    delete player.inPlay;
  }

  stateEndTurn_(player) {
    player.removeFromPlay(player.inPlay);
    player.discardEffect = 0;
    player.drawEffect = 0;
    player.cycleEffect = 0;
    player.stealEffect = 0;
  }

  draw(playerCount, enemyCount = 0) {
    if (playerCount) this.playerDraw_(this.accessor_.player, playerCount);
    if (enemyCount) this.playerDraw_(this.accessor_.enemy, enemyCount);
  }

  playerDrawOne_(player) {
    player.state = this.states_[0];
    player.prepDraw();
    const numChoices = player.deck.length;
    this.states_.length *= numChoices;
    this.forEachStateCallNTimes_(player.draw.bind(player), numChoices);
  }

  playerDraw_(player, count) {
    player.state = this.states_[0];
    if (count >= player.deck.length) {
      if (!player.deck.length) {
        if (!player.discardPile.length) return;
        player.prepDraw();
        this.playerDraw_(player, count);
        return;
      }
      count -= player.deck.length;
      this.forEachState_(player.drawAll.bind(player));
      if (!player.discardPile.length || !count) return;
      player.prepDraw();
    }

    const numChoices = player.deck.length;
    this.states_.length *= _.factorial(numChoices) /
        _.factorial(numChoices - count);
    for (let i = 0; i < count; i++) {
      this.forEachStateCallNTimes_(player.draw.bind(player), numChoices - i);
    }
  }

  discard(count) {
    if (!count) return;
    const player = this.accessor_.player;
    player.state = this.states_[0];
    if (player.hand.length <= count) {
      if (!player.hand.length) return;
      player.discardAll();
      return;
    }

    const numChoices = player.hand.length;
    this.states_.length *= _.factorial(numChoices) /
        _.factorial(numChoices - count);
    for (let i = 0; i < count; i++) {
      this.forEachStateCallNTimes_(player.discard.bind(player), numChoices - i);
    }
  }

  cycle(count) {
    if (!count) return;
    const player = this.accessor_.player;
    player.state = this.states_[0];
    count = Math.min(count, player.hand.length);
    this.discard(count);
    this.playerDraw_(player, count);
  }

  forEachState_(changeStateFn) {
    const numStates = this.states_.length;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      this.accessor_.setState(this.states_[stateIndex]);
      changeStateFn();
    }
  }

  forEachStateCallNTimes_(changeStateFn, numChoices) {
    //_.assert(numChoices != 0);
    const numStates = this.states_.actualLen;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      this.addStates_(stateIndex, changeStateFn, numChoices);
    }
  }

  addStates_(stateIndex, changeStateFn, numChoices) {
    this.accessor_.setState(this.states_[stateIndex]);
    for (let i = 1; i < numChoices; i++) {
      const state = this.accessor_.clone();
      this.accessor_.setState(state);
      changeStateFn(i);
      this.states_[this.states_.actualLen++] = state;
      this.accessor_.setState(this.states_[stateIndex]);
    }
    changeStateFn(0);
  }
}
