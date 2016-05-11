import d from './debug';
import gs from '../game-engine/game-state';
import fs from './fast-state';
import _ from '../../utils/common';


export default class CardMover {
  setCardOrder(order) {
    this.order_ = order;
  }

  moveCards(state, playerCardIndex, depth) {
    const played = state.player.hand.splice(playerCardIndex, 1)[0];
    // TODO: Implement steal, enemy discard (card not discarded is played next),
    // and clone.
    if (state.player.cycleEffect && state.player.hand.length) {
      const discardValue = this.order_.cycleDiscardValues[depth];
      const drawValue = this.order_.cycleDrawValues[depth];
      const numCycled = Math.min(state.player.cycleEffect, state.player.hand);
      fs.discard(state.player, discardValue, numCycled);
      fs.draw(state.player, drawValue, numCycled);
    }

    if (state.player.drawEffect) {
      const drawValue = this.order_.drawValues[depth];
      fs.draw(state.player, drawValue, state.player.drawEffect);
    }

    if (state.player.discardEffect) {
      const discardValue = this.order_.discardValues[depth];
      fs.discard(state.player, discardValue, state.player.discardEffect);
    }

    state.player.discard.push(played);
    fs.drawOne(state.player, this.order_.endTurnDrawValues[depth]);
  }
}
