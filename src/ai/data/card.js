import gameData from './game_data.js';
import _ from '../../utils/common.js';

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

  static EMPTY = new Card('?');

  validateAttrs_(attrs) {
    attrs.forEach(a => {
      if (!gameData.CARD_ATTRS[a]) {
        throw 'Bad card attr: ' + a + ' in ' + this.desc;
      }
    });
  }
}

const sortDesc = (desc) => desc.split('/').sort().join('/');
const descToIndex = {};
const cardList = [];
const cardIndexesInSets = _.mapObject(gameData.sets, (desc) => {
  desc = sortDesc(desc);
  if (descToIndex[desc]) return descToIndex[desc];
  const index = cardList.length;
  cardList.push(new Card(desc));
  descToIndex[desc] = index;
  return index;
});

Card.list = cardList;

Card.getSet = (set) => cardIndexesInSets[set];

Card.get = (desc) => descToIndex[desc];
