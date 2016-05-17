import gs from './game-state';
import _ from '../../utils/common';

export default class Simulator {
  constructor() {
    this.accuracyFactor_ = 30;
    this.depth = 0;

    // Used with optimization, controls which cards are chosen based on depth,
    // essentially fixes the deck order.
    this.startingIndexes_ = {
      playerDrawEndTurn: this.getStartingIndexes_(),
      enemyDrawEndTurn: this.getStartingIndexes_(),
      draw: {
        player: this.getStartingIndexes_(),
        enemy: this.getStartingIndexes_(),
      },
      discard: this.getStartingIndexes_(),
      steal: this.getStartingIndexes_(),
    };
  }

  getStartingIndexes_() {
    return _.range(300).map(i => Math.random());
  }

  setInitialState(state) {
    this.depth = 0;
    const complexity = gs.cards(state.player).length *
        gs.cards(state.enemy).length;
    if (complexity < 55) {
      this.optimizedAccuracyFactor_ = 12;
    } else if (complexity < 70) {
      this.optimizedAccuracyFactor_ = 3;
    } else {
      this.optimizedAccuracyFactor_ = 1;
    }
    //this.accuracyFactor_ = 300;
    //this.accuracyFactor_ = 3;
    //this.optimizedAccuracyFactor_ = 1;
    this.optimizedAccuracyFactor_ = 6;
    console.log('complexity', complexity,
                ', accuracy', this.optimizedAccuracyFactor_);
  }

  set optimize(optimize) {
    if (optimize) {
      this.accuracyFactor_ = this.optimizedAccuracyFactor_;
    } else {
      this.accuracyFactor_ = 300;
    }
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

  shuffleDecks() {
    this.states_.forEach(state => {
      state.player.deck = _.shuffle(state.player.deck);
      state.enemy.deck = _.shuffle(state.enemy.deck);
    });
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
    const numChoices = Math.min(deckLen, this.accuracyFactor_);
    if (numChoices == 0) return;
    // FIXME
    //const startingIndex = Math.floor(Math.random() * deckLen);
    const startingIndex = Math.floor(
        this.startingIndexes_.playerDrawEndTurn[this.depth] * deckLen);
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
    const numChoices = Math.min(deckLen, this.accuracyFactor_);
    if (numChoices == 0) return;
    // FIXME
    //const startingIndex = Math.floor(Math.random() * deckLen);
    const startingIndex = Math.floor(
        this.startingIndexes_.enemyDrawEndTurn[this.depth] * deckLen);
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

    if (this.accuracyFactor_ <= 5) {
      // FIXME
      //const startingIndex = Math.floor(Math.random() * player.deck.length);
      const startingIndex = Math.floor(
          this.startingIndexes_.draw[type][this.depth] *
          player.deck.length);
      const numStates = this.states_.length;
      for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
        const state = this.states_[stateIndex];
        for (let i = 0; i < count; i++) {
          gs.draw(state[type], startingIndex % player.deck.length);
        }
      }
    } else {
      const numChoices = player.deck.length;
      this.states_.length *= _.factorial(numChoices) /
          _.factorial(numChoices - count);
      for (let i = 0; i < count; i++) {
        this.forEachStateCallNTimes_((state, i) => {
          gs.draw(state[type], i);
        }, numChoices - i);
      }
    }
  }

  discard(count) {
    if (!count) return;
    const player = this.states_[0].player;
    if (player.hand.length <= count) {
      if (!player.hand.length) return;
      const numStates = this.states_.length;
      for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
        gs.discardAll(this.states_[stateIndex].player);
      }
      return;
    }

    if (this.accuracyFactor_ <= 5) {
      // FIXME
      //const startingIndex = Math.floor(Math.random() * player.hand.length);
      const startingIndex = Math.floor(
          this.startingIndexes_.discard[this.depth] * player.hand.length);
      const numStates = this.states_.length;
      for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
        const state = this.states_[stateIndex];
        for (let i = 0; i < count; i++) {
          gs.discard(state.player, startingIndex % player.hand.length);
        }
      }
    } else {
      const numChoices = player.hand.length;
      this.states_.length *= _.factorial(numChoices) /
          _.factorial(numChoices - count);
      for (let i = 0; i < count; i++) {
        this.forEachStateCallNTimes_((state, i) => {
          gs.discard(state.player, i);
        }, numChoices - i);
      }
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

    if (this.accuracyFactor_ <= 5) {
      // FIXME
      //const startingIndex = Math.floor(Math.random() * player.hand.length);
      const startingIndex = Math.floor(
          this.startingIndexes_.steal[this.depth] * player.hand.length);
      const numStates = this.states_.length;
      for (let stateIndex = 0; stateIndex < numStates; stateIndex++) {
        const state = this.states_[stateIndex];
        for (let i = 0; i < count; i++) {
          gs.steal(
              state.enemy, state.player, startingIndex % player.hand.length);
        }
      }
    } else {
      const numChoices = player.hand.length;
      this.states_.length *= _.factorial(numChoices) /
          _.factorial(numChoices - count);
      for (let i = 0; i < count; i++) {
        this.forEachStateCallNTimes_((state, i) => {
          gs.steal(state.enemy, state.player, i);
        }, numChoices - i);
      }
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
