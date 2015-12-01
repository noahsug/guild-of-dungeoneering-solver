import _ from '../../utils/common';

jest.dontMock('../game-state');
jest.dontMock('../simulator');
jest.dontMock('../game-state-accessor');

describe('simulator', () => {
  const Simulator = require('../simulator');
  const GameState = require('../game-state');
  let sim;
  beforeEach(() => {
    sim = new Simulator();
  });

  it('gets the next states', () => {
    const state = GameState.create({
      playerDeck: [],
      playerHealth: 5,
      playerHand: [1, 2, 3, 4],
      enemyHealth: 5,
      enemyDeck: [1, 2, 4],
      enemyHand: [3],
    });
    const states = Array.from(sim.getStateGenerator(state, 4));
    expect(states.length).toBe(3);
    expect(states[0]).toContainKVs({playerHealth: 5, enemyHealth: 1});
    expect(states[0].playerDeck).toEqual([]);
    expect(states[0].playerHand).toEqual([4, 1, 2, 3]);
    expect(states[0].playerDiscard).toEqual([]);
    expect(states[0].enemyDiscard).toEqual([3]);
    expect([1, 2, 4]).toContain(states[0].enemyHand[0]);
  });

  it('provides a unique ID for each state', () => {
    const state = GameState.create({
      playerDeck: [],
      playerHealth: 5,
      playerHand: [1],
      enemyHealth: 5,
      enemyDeck: [1, 1, 1, 2],
      enemyHand: [2],
    });
    const states = Array.from(sim.getStateGenerator(state, 1));
    expect(_.size(_.groupBy(states, 'id'))).toBe(2);
  });

  it('gets initial game states', () => {
    const state = GameState.create({
      playerDeck: [1, 2, 3, 4],
      enemyDeck: [1, 1, 3, 4],
    });
    const states = Array.from(sim.getInitialStateGenerator(state));
    expect(states.length).toBe(4);
    expect(states[0].playerDeck).toEqual([]);
    expect(states[0].playerHand).toEqualValues([1, 2, 3, 4]);
    expect(states[0].playerDiscard).toEqual([]);
    expect(states[0].enemyDeck.length).toEqual(3);
    expect([1, 3, 4]).toContain(states[0].enemyHand[0]);
    expect(states[0].enemyDiscard).toEqual([]);
  });

  it('plays a move, randomly choosing the game state', () => {
    const state = GameState.create({
      playerHealth: 5,
      playerHand: [1, 2, 3, 4],
      enemyHealth: 5,
      enemyDeck: [1, 2, 3],
      enemyHand: [4],
    });
    expect(sim.play(state, 4)).toBe(0);
    expect(state.playerHealth).toEqual(1);
    expect(state.enemyHealth).toEqual(1);
    expect(state.playerDeck).toEqual([]);
    expect(state.playerHand).toEqual([4, 1, 2, 3]);
    expect(state.playerDiscard).toEqual([]);
    expect(state.enemyDeck.length).toEqual(2);
    expect([1, 2, 3]).toContain(state.enemyHand[0]);
    expect(state.enemyDiscard).toEqual([4]);
  });

  it('player with better cards will win', () => {
    const state = GameState.create({
      playerHealth: 10,
      playerHand: [1, 2, 3],
      enemyHealth: 10,
      enemyHand: [0, 1],
    });
    let result = 0;
    let i = 0;
    for (i = 0; i < 100 && !result; i++) {
      const moves = sim.getMoves(state);
      result = sim.play(state, _.sample(moves));
    }
    expect(i).toBeLessThan(100);
    expect(result).toBe(1);
    expect(state.enemyHealth).toBeLessThan(1);
  });
});