import _ from 'underscore';

export default class Simulator {
  getInitialStates(state) {
  }

  getMoves(state) {
  }

  play(state, move) {
  }

  getStates(state, moveIndex) {
    let nextState = _.clone(state);
    this.resolve_(nextState,
                  state.playerHand[moveIndex],
                  state.enemyHand[0]);
    const playerDraws = this.discardAndDraw_(nextState.playerDeck,
                                             nextState.playerHand,
                                             nextState.playerDiscard);
    const enemyDraws = this.discardAndDraw_(nextState.enemyDeck,
                                            nextState.enemyHand,
                                            nextState.enemyDiscard);
  }

  discardAndDraw_(deck, hand, discard) {
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
