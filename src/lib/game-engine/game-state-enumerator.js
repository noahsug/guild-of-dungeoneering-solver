import GameStateAccessor from './game-state-accessor';
import _ from '../../utils/common';

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
    const numStates = this.states_.actualLen;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      player.state = this.states_[stateIndex];
      player.removeFromPlay(player.inPlay);
    }
    this.playerDrawOne_(player);
    delete player.inPlay;
  }

  draw(playerCount, enemyCount = 0) {
    if (playerCount) this.playerDraw_(this.accessor_.player, playerCount);
    if (enemyCount) this.playerDraw_(this.accessor_.enemy, enemyCount);
  }

  playerDrawOne_(player) {
    player.state = this.states_[0];
    player.prepDraw();
    const numChoices = player.deck.length;
    if (numChoices == 0) return;
    const numStates = this.states_.length;
    let lastStateIndex = numStates - 1;
    this.states_.length *= numChoices;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      for (let i = 1; i < numChoices; i++) {
        this.accessor_.setState(this.states_[stateIndex]);
        player.state = this.accessor_.clone();
        player.draw(i);
        this.states_[lastStateIndex + i] = player.state;
      }
      lastStateIndex += numChoices - 1;
      player.state = this.states_[stateIndex];
      player.draw(0);
    }
    this.states_.actualLen = this.states_.length;
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

  steal(count) {
    if (!count) return;
    const {player, enemy} = this.accessor_.setState(this.states_[0]);
    count = Math.min(count, player.hand.length);
    if (!count) return;

    const numChoices = player.hand.length;
    this.states_.length *= _.factorial(numChoices) /
        _.factorial(numChoices - count);
    for (let i = 0; i < count; i++) {
      this.forEachStateCallNTimes_(enemy.steal.bind(enemy), numChoices - i);
    }
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
