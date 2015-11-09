jest.dontMock('../simulator');

describe('simulator', () => {
  const Simulator = require('../simulator');
  let sim;
  beforeEach(() => {
    sim = new Simulator();
  });

  it('gets the next states', () => {
    const state = {
      playerHealth: 5,
      playerDeck: [],
      playerHand: [1, 2, 3, 4],
      playerDiscard: [],
      enemyHealth: 5,
      enemyDeck: [1, 2, 4],
      enemyHand: [3],
      enemyDiscard: [],
    };
    const move = 3;  // Play the 4.
    const states = sim.getStates(state, move);
  });

  xit('gets initial game states', () => {
    const states = sim.getInitialStates({
      playerHealth: 5,
      playerDeck: [1, 2, 3, 4],
      playerHand: [],
      enemyHealth: 5,
      enemyDeck: [1, 2, 3, 4],
      enemyHand: [],
    });
    expect({foo: 1, bar: 2}).toContainKeys(['foo']);
  });
});
