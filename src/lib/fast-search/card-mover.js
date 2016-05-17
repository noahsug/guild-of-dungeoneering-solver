import gs from '../game-engine/game-state';
import fs from './fast-state';
import _ from '../../utils/common';


export default class CardMover {
  moveCards(state, playerCardIndex, depth) {
    const played = state.player.hand.splice(playerCardIndex, 1)[0];
    // TODO: Implement steal, enemy discard (card not discarded is played next),
    // and clone.
    if (state.player.cycleEffect && state.player.hand.length) {
      const discardValue = this.order.cycleDiscardValues[depth];
      const drawValue = this.order.cycleDrawValues[depth];
      const numCycled = Math.min(
          state.player.cycleEffect, state.player.hand.length);
      fs.discard(state.player, discardValue, numCycled);
      fs.draw(state.player, drawValue, numCycled);
    }

    if (state.player.drawEffect) {
      const drawValue = this.order.drawValues[depth];
      fs.draw(state.player, drawValue, state.player.drawEffect);
    }

    if (state.player.discardEffect) {
      const discardValue = this.order.discardValues[depth];
      fs.discard(state.player, discardValue, state.player.discardEffect);
    }

    state.player.discard.push(played);
    fs.drawOne(state.player, this.order.endTurnDrawValues[depth]);
  }

  getStartingStates(state) {
    const handSize =
        state.player.extraHandSizeEffect + gs.STARTING_HAND_SIZE;
    const numStates = _.choose(state.player.deck.length, handSize);
    const states = new Array(numStates);
    const playerHandGen = _.combinationsGenerator(
        state.player.deck, handSize);
    let i = 0;
    for (const playerHand of playerHandGen) {
      const nextState = fs.cloneStats(state);
      nextState.player.deck = _.removeAll(state.player.deck, playerHand);
      nextState.player.hand = playerHand.slice();
      nextState.player.discard = [];
      _.shuffleInPlace(nextState.player.deck);
      states[i++] = nextState;
    }
    return states;
  }

  getNextStates(state, playerCardIndex) {
    const played = state.player.hand.splice(playerCardIndex, 1)[0];
    let states = [state];
    if (state.player.cycleEffect && state.player.hand.length) {
      const numCycled = Math.min(
          state.player.cycleEffect, state.player.hand.length);
      states = this.discard_(states, numCycled);
      states = this.draw_(states, numCycled);
    }

    if (state.player.drawEffect) {
      states = this.draw_(states, state.player.drawEffect);
    }

    if (state.player.discardEffect) {
      states = this.discard_(states, state.player.discardEffect);
    }

    this.discardPlayedCard_(states, played);
    return this.draw_(states, 1);
  }

  draw_(states, count) {
    const player = states[0].player;
    const numStates = states.length;
    let deckLen = player.deck.length;
    let discardLen = player.discard.length;
    if (!deckLen) {
      if (!discardLen) return states;
      for (let i = 0; i < numStates; i++) {
        gs.prepDraw(states[i].player);
      }
      deckLen = player.deck.length;
      discardLen = 0;
    }

    const newStates = [];
    for (let i = 0; i < numStates; i++) {
      const state = states[i];
      const gen = _.combinationsGenerator(_.range(deckLen), count);
      for (const draws of gen) {
        const clone = fs.incrementalClone(state);
        newStates.push(clone);
        const drawLen = draws.length;
        for (let di = 0; di < drawLen; di++) {
          gs.draw(clone.player, draws[di] - di);
        }
      }
    }

    if (count > deckLen && discardLen) {
      return this.draw_(newStates, count - deckLen);
    }
    return newStates;
  }

  discard_(states, count) {
    const player = states[0].player;
    const newStates = [];
    const numStates = states.length;
    for (let i = 0; i < numStates; i++) {
      const state = states[i];
      const gen = _.combinationsGenerator(_.range(player.hand.length), count);
      for (const discards of gen) {
        const clone = fs.incrementalClone(state);
        newStates.push(clone);
        const discardLen = discards.length;
        for (let di = 0; di < discardLen; di++) {
          gs.discard(clone.player, discards[di] - di);
        }
      }
    }
    return newStates;
  }

  discardPlayedCard_(states, card) {
    const numStates = states.length;
    for (let i = 0; i < numStates; i++) {
      states[i].player.discard.push(card);
    }
  }
}
