import _ from '../../../utils/common';

jest.dontMock('../simulator');
jest.dontMock('../game-state');
jest.dontMock('../game-state-enumerator');

describe('simulator', () => {
  const Simulator = require('../simulator');
  const gs = require('../game-state');
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
    const state = gs.create({
      health: 5,
      hand: [1, 2, 3, 4],
    }, {
      health: 5,
      deck: [1, 2, 4],
      hand: [3],
    });
    const states = sim.getStates(state, 4);
    expect(states.length).toBe(3);
    gs.drawForNextTurn(states[0]);
    expect(states[0].player.health).toBe(5);
    expect(states[0].enemy.health).toBe(1);
    expect(states[0].player.deck).toEqual([]);
    expect(states[0].player.hand).toEqualValues([1, 2, 3, 4]);
    expect(states[0].player.discard).toEqual([]);
    expect(states[0].enemy.discard).toEqual([3]);
    expect([1, 2, 4]).toContain(states[0].enemy.hand[0]);
  });

  it('gets initial game states', () => {
    const state = gs.create({
      deck: [1, 2, 3],
    }, {
      deck: [1, 1, 3, 4],
    });
    const states = sim.getInitialStates(state);
    expect(states.length).toBe(4);
    expect(states[0].player.deck).toEqual([]);
    expect(states[0].player.hand).toEqualValues([1, 2, 3]);
    expect(states[0].player.discard).toEqual([]);
    expect(states[0].enemy.deck.length).toEqual(3);
    expect([1, 3, 4]).toContain(states[0].enemy.hand[0]);
    expect(states[0].enemy.discard).toEqual([]);
  });

  it('handles player discards', () => {
    resolveAs((state) => {
      state.player.discardEffect = 2;
      return false;
    });
    const state = gs.create({
      hand: [1, 2, 3, 4],
    }, {
      hand: [0],
    });

    const states = sim.getStates(state, 1);
    expect(states.length).toBe(18);
    gs.drawForNextTurn(states[0]);
    expect(states[0].player.hand.length).toBe(2);
  });

  it('handles player draws', () => {
    resolveAs((state) => {
      state.player.drawEffect = 2;
      return false;
    });
    const state = gs.create({
      deck: [1, 2, 3, 4],
      hand: [5],
    }, {
      hand: [0],
    });

    const states = sim.getStates(state, 5);
    expect(states.length).toBe(24);
    gs.drawForNextTurn(states[0]);
    expect(states[0].player.hand.length).toBe(3);
  });
});
