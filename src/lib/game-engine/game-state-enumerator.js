import GameStateAccessor from './game-state-accessor';
import _ from '../../utils/common';

export default class Simulator {
  constructor() {
    this.accessor_ = new GameStateAccessor();
    this.player_ = this.accessor_.player;
    this.enemy_ = this.accessor_.enemy;
    this.accuracyFactor_ = 30;
    this.optimize = false;
  }

  setInitialState(state) {
    this.initialState_ = state;
    this.accessor_.setState(state);
    const complexity = this.player_.cards.length * this.enemy_.cards.length;
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
    console.log('complexity', complexity, ', speed', this.accuracyFactor_);
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
    this.playerPlay_(this.player_, playerCard);
    this.playerPlay_(this.enemy_, this.enemy_.hand[0]);
  }

  playerPlay_(player, card) {
    const cardIndex = player.hand.indexOf(card);
    player.inPlay = player.putInPlay(cardIndex);
  }

  endTurn() {
    const numStates = this.states_.length;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      this.accessor_.setState(this.states_[stateIndex]);
      this.player_.removeFromPlay(this.player_.inPlay);
      this.player_.prepDraw();
      this.enemy_.removeFromPlay(this.enemy_.inPlay);
      this.enemy_.prepDraw();
    }
    delete this.player_.inPlay;
    delete this.enemy_.inPlay;
    this.playerDrawAtEndOfTurn_(this.player_);
    this.playerDrawAtEndOfTurn_(this.enemy_);
  }

  playerDrawAtEndOfTurn_(player) {
    player.state = this.states_[0];
    const numChoices = this.optimize ?
          Math.min(player.deck.length, this.accuracyFactor_) :
          player.deck.length;
    if (numChoices == 0) return;
    const numStates = this.states_.length;
    let lastStateIndex = numStates - 1;
    this.states_.length *= numChoices;
    for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
      this.accessor_.setState(this.states_[stateIndex]);
      player.indicateDraw(0);
      for (let i = 1; i < numChoices; i++) {
        player.state = this.accessor_.shallowClone();
        player.indicateDraw(i);
        this.states_[lastStateIndex + i] = player.state;
      }
      lastStateIndex += numChoices - 1;
    }
  }

  draw(playerCount, enemyCount = 0) {
    if (playerCount) this.playerDraw_(this.player_, playerCount);
    if (enemyCount) this.playerDraw_(this.enemy_, enemyCount);
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
    const player = this.player_;
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
    const player = this.player_;
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
