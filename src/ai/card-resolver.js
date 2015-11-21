import GameStateAccessor from './game-state-accessor';

export default class CardResolver {
  resolve(state, playerCard, enemyCard) {
    if (playerCard >= enemyCard) state.enemyHealth -= playerCard;
    if (enemyCard >= playerCard) state.playerHealth -= enemyCard;
  }
}
