import GameStateAccessor from './game-state-accessor';

export default class CardResolver {
  resolve(state, playerCard, enemyCard) {
    state.playerHealth -= enemyCard < playerCard ? 0 : enemyCard;
    state.enemyHealth -= playerCard < enemyCard ? 0 : playerCard;
    return this.getResult(state);
  }

  getResult(state) {
    if (state.playerHealth <= 0) return -1;
    if (state.enemyHealth <= 0) return 1;
    return 0;
  }
}
