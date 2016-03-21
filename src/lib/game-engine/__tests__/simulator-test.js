import _ from '../../../utils/common';

jest.dontMock('../simulator');
jest.dontMock('../game-state-accessor');
jest.dontMock('../game-state-player-accessor');
jest.dontMock('../game-state-enumerator');

describe('simulator', () => {
  const Simulator = require('../simulator');
  const GameStateAccessor = require('../game-state-accessor');
  let sim;
  beforeEach(() => {
    sim = new Simulator();
  });

  function resolveAs(fn) {
    const CardResolver = require('../card-resolver');
    const resolver = new CardResolver();
    resolver.resolve.mockImpl(fn);
    sim.cardResolver_ = resolver;
  }

  it('gets the next states', () => {
    const state = GameStateAccessor.create({
      playerDeck: [],
      playerHealth: 5,
      playerHand: [1, 2, 3, 4],
      enemyHealth: 5,
      enemyDeck: [1, 2, 4],
      enemyHand: [3],
    });
    const states = sim.getStates(state, 4);
    expect(states.length).toBe(3);
    GameStateAccessor.instance.setState(states[0]).drawForNextTurn();
    expect(states[0]).toContainKVs({playerHealth: 5, enemyHealth: 1});
    expect(states[0].playerDeck).toEqual([]);
    expect(states[0].playerHand).toEqualValues([1, 2, 3, 4]);
    expect(states[0].playerDiscardPile).toEqual([]);
    expect(states[0].enemyDiscardPile).toEqual([3]);
    expect([1, 2, 4]).toContain(states[0].enemyHand[0]);
  });

  it('gets initial game states', () => {
    const state = GameStateAccessor.create({
      playerDeck: [1, 2, 3],
      enemyDeck: [1, 1, 3, 4],
    });
    const states = sim.getInitialStates(state);
    expect(states.length).toBe(4);
    expect(states[0].playerDeck).toEqual([]);
    expect(states[0].playerHand).toEqualValues([1, 2, 3]);
    expect(states[0].playerDiscardPile).toEqual([]);
    expect(states[0].enemyDeck.length).toEqual(3);
    expect([1, 3, 4]).toContain(states[0].enemyHand[0]);
    expect(states[0].enemyDiscardPile).toEqual([]);
  });

  it('handles player discards', () => {
    resolveAs((state) => {
      state.playerDiscardEffect = 2;
      return false;
    });
    const state = GameStateAccessor.create({
      playerHand: [1, 2, 3, 4],
      enemyHand: [0],
    });

    const states = sim.getStates(state, 1);
    GameStateAccessor.instance.setState(states[0]).drawForNextTurn();
    expect(states.length).toBe(18);
    expect(states[0].playerHand.length).toBe(2);
  });

  it('handles player draws', () => {
    resolveAs((state) => {
      state.playerDrawEffect = 2;
      return false;
    });
    const state = GameStateAccessor.create({
      playerDeck: [1, 2, 3, 4],
      playerHand: [5],
      enemyHand: [0],
    });

    const states = sim.getStates(state, 5);
    GameStateAccessor.instance.setState(states[0]).drawForNextTurn();
    expect(states.length).toBe(24);
    expect(states[0].playerHand.length).toBe(3);
  });
});
