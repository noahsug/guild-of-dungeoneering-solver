import _ from '../../../utils/common';
jest.autoMockOff();

describe('fast solver', () => {
  const FastSolver = require('../fast-solver');
  const Card = require('../../game-engine/card');
  const gameData = require('../../game-engine/game-data');
  let solver;

  function getCards(descList) {
    return descList.map((d) => Card.get(d));
  }

  beforeEach(() => {
    solver = new FastSolver();
  });

  it('creates starting states', () => {
    solver.init({name: 'Chump'}, {name: 'Fire Imp'});
    expect(solver.startingStates.length).toBe(20);

    const cards = gameData.sets.Chump;
    const hand = getCards([cards[2], cards[3], cards[4]]);
    const deck = getCards([cards[0], cards[1], cards[5]]);
    let match = false;
    solver.startingStates.forEach((state) => {
      if (_.isEqual(state.player.deck.sort(), deck.sort()) &&
          _.isEqual(state.player.hand, hand) &&
          _.isEqual(state.player.discard, [])) {
        match = true;
      }
    });
    expect(match).toBe(true);
  });

  it('can solve a starting hand', () => {
    solver.init({name: 'Chump'}, {name: 'Fire Imp'});
    expect(solver.count).toBe(0);
    expect(solver.sum).toBe(0);

    solver.next();
    expect(solver.count).toBe(1);
    expect(solver.sum).toBe(1);
  });
});
