import gameData from './game-data.js';
import _ from '../../utils/common.js';

export default class Card {
  constructor(desc) {
    this.desc = desc;
    const attrs = desc.split(Card.DELIMITER);
    this.validateAttrs_(attrs);

    const groups = _.groupBy(attrs);
    _.each(gameData.CARD_ATTRS, (name, shortcut) => {
      this[name] = (groups[shortcut] || []).length;
    });
  }

  validateAttrs_(attrs) {
    attrs.forEach(a => {
      if (!gameData.CARD_ATTRS[a]) {
        throw new Error('Bad card attr: ' + a + ' in ' + this.desc);
      }
    });
  }

  static DELIMITER = '/';

  static list = [0];

  static getSet(set) {
    const indexes = Card.cardIndexesInSets[set];
    _.assert(indexes, 'Missing set ' + set);
    return indexes;
  }

  static get(desc) {
    return Card.descToIndex[desc];
  }

  static create(desc) {
    desc = Card.sortDesc(desc);
    if (Card.descToIndex[desc] != undefined) return Card.descToIndex[desc];
    const index = Card.list.length;
    Card.list.push(new Card(desc));
    Card.descToIndex[desc] = index;
    return index;
  }

  static sortDesc(desc) {
    return desc.split(Card.DELIMITER).sort().join(Card.DELIMITER);
  }

  static initCardList() {
    Card.descToIndex = {};
    Card.cardIndexesInSets = _.mapObject(gameData.sets, (set) => {
      return _.map(set, (desc) => {
        return Card.create(desc);
      });
    });
  }
}

Card.initCardList();
