export default class GameState {
  static create({playerDeck, playerHealth = 5, enemyDeck, enemyHealth = 5}) {
    return {
      playerHealth: playerHealth,
      playerDeck: playerDeck.slice(),
      playerHand: [],
      playerDiscard: [],
      enemyHealth: enemyHealth,
      enemyDeck: enemyDeck.slice(),
      enemyHand: [],
      enemyDiscard: [],
    };
  }
}
