import Card from '../game-engine/Card';
import _ from '../../utils/common';

class PrettyPrint {
  card(card) {
    return Card.list[card].desc;
  }

  cards(cards) {
    return cards.map(this.card);
  }

  depth(depth) {
    return new Array(depth).fill(' ').join('');
  }

  percent(x) {
    return _.percent(x) + '%';
  }
}

export default new PrettyPrint();
