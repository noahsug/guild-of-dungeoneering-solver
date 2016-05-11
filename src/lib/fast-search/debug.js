import Card from '../game-engine/Card';

class Debug {
  pcard(card) {
    return Card.list[card].desc;
  }

  pcards(cards) {
    return cards.map(this.pcard);
  }
}

export default new Debug();
