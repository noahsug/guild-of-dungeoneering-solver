import _ from '../../../utils/common';

jest.dontMock('../card-order');
jest.dontMock('../../game-engine/game-state');

describe('card order', () => {
  const CardOrder = require('../card-order');
  const enemyCards = _.range(20);
  let order;

  beforeEach(() => {
    order = new CardOrder();
    order.setInitialState({
      enemy: {deck: enemyCards.slice(), hand: [], discard: []},
    });
    order.randomize();
  });

  it('provides enemy draws', () => {
    expect(order.enemyDraws).toContainValues(enemyCards);
  });

  it('randomizes enemy draws', () => {
    function enemyDrawsAreDifferent() {
      const enemyDraws = order.enemyDraws.slice();
      order.randomize();
      return !_.isEqual(enemyDraws, order.enemyDraws);
    }
    expect(enemyDrawsAreDifferent).toEventuallyBe(true);
  });

  it('maintains a card cycle', () => {
    const len = enemyCards.length;
    let cards = order.enemyDraws.slice(0, len);
    expect(cards.sort()).toEqual(enemyCards.sort());
    cards = order.enemyDraws.slice(len, 2 * len);
    expect(cards.sort()).toEqual(enemyCards.sort());
  });

  it('creates draw values', () => {
    function drawsAreDifferent() {
      const draws = order.drawValues.slice();
      order.randomize();
      return !_.isEqual(draws, order.drawValues);
    }
    expect(drawsAreDifferent).toEventuallyBe(true);
  });
});
