import gameData from './game-data.js';
import _ from '../utils/common.js';

export default class Card {
  constructor(desc) {
    this.desc = desc;
    const attrs = desc.split('/');
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

  static list = [];

  static getSet(set) {
    return Card.cardIndexesInSets[set];
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
    return desc.split('/').sort().join('/');
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
