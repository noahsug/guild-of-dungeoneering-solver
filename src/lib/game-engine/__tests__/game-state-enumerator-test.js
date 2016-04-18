import _ from '../../../utils/common';

jest.dontMock('../game-state');
jest.dontMock('../game-state-enumerator');

describe('game state enumerator', () => {
  const GameStateEnumerator = require('../game-state-enumerator');
  const gs = require('../game-state');
  let enumerator;
  beforeEach(() => {
    enumerator = new GameStateEnumerator();
  });

  it('enumerates card draws', () => {
    enumerator.setState(gs.create({
      deck: [1, 2, 3],
    }));

    enumerator.draw(2);

    const states = enumerator.getStates();
    expect(states.length).toBe(6);
    expect(states[0].player.deck).toEqual([3]);
    expect(states[0].player.hand).toEqualValues([2, 1]);
  });

  it('enumerates card discards', () => {
    enumerator.setState(gs.create({
      hand: [1, 2, 3],
    }));

    enumerator.discard(2);

    const states = enumerator.getStates();
    expect(states.length).toBe(6);
    expect(states[0].player.hand).toEqual([3]);
    expect(states[0].player.discard).toEqualValues([1, 2]);
  });

  it('enumerates card cycling', () => {
    enumerator.setState(gs.create({
      deck: [4, 5],
      hand: [1, 2, 3],
    }));

    enumerator.cycle(2);

    const states = enumerator.getStates();
    expect(states.length).toBe(6);
    expect(states[0].player.deck).toEqual([]);
    expect(states[0].player.hand).toEqualValues([5, 4, 3]);
    expect(states[0].player.discard).toEqualValues([1, 2]);
  });

  it('can put cards in play and discard them when the turn ends', () => {
    enumerator.setState(gs.create({
      hand: [1, 2],
      discard: [3, 4],
    }, {
      hand: [5],
    }));

    enumerator.putInPlay(1);
    enumerator.draw(1);
    enumerator.endTurn();

    const states = enumerator.getStates();
    expect(states.length).toBe(2);
    gs.drawForNextTurn(states[0]);
    expect(states[0].player.deck).toEqual([]);
    expect(states[0].player.hand).toEqualValues([2, 3, 4]);
    expect(states[0].player.discard).toEqual([1]);
    expect(states[0].enemy.deck).toEqual([]);
    expect(states[0].enemy.hand).toEqual([5]);
    expect(states[0].enemy.discard).toEqual([]);
  });
});
