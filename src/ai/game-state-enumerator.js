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
    this.playerDraw_(player, 1);
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

  playerDraw_(player, count) {
    player.state = this.states_[0];
    count = Math.min(count, player.deck.length + player.discardPile.length);
    for (let i = 0; i < count; i++) {
      player.state = this.states_[0];
      const numChoices = player.deck.length || player.discardPile.length;
      this.forEachState_(player.draw.bind(player), numChoices);
    }
  }

  discard(count) {
    if (!count) return;
    const player = this.accessor_.player;
    player.state = this.states_[0];
    count = Math.min(count, player.hand.length);
    for (let i = 0; i < count; i++) {
      player.state = this.states_[0];
      const numChoices = player.hand.length;
      this.forEachState_(player.discard.bind(player), numChoices);
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

  forEachState_(changeStateFn, numChoices = 1, choiceStartIndex = 0) {
    if (!numChoices) return;
    const numStates = this.states_.length;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      this.addStates_(stateIndex, changeStateFn, numChoices, choiceStartIndex);
    }
  }

  addStates_(stateIndex, changeStateFn, numChoices, choiceStartIndex) {
    this.accessor_.setState(this.states_[stateIndex]);
    for (let i = choiceStartIndex + 1; i < numChoices; i++) {
      const state = this.accessor_.clone();
      this.accessor_.setState(state);
      changeStateFn(i);
      this.states_.push(state);
      this.accessor_.setState(this.states_[stateIndex]);
    }
    changeStateFn(choiceStartIndex);
  }
}
