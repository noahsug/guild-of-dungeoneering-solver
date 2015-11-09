export default class Node {
  constructor(gameState, type = '', result = 0) {
    this.gameState = gameState;
    this.type = type;
    this.result = result;

    this.parent = null;
    this.children = null;
    this.losses = this.wins = 0;
  }
}
