import _ from '../utils/common';

export default class GameState {
  static create(state) {
    return _.defaults(state, {
      playerHealth: 5,
      playerDeck: [],
      playerHand: [],
      playerDiscard: [],
      enemyHealth: 5,
      enemyDeck: [],
      enemyHand: [],
      enemyDiscard: [],
    });
  }
}
