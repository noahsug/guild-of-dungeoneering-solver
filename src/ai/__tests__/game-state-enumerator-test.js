import _ from '../../utils/common';

jest.dontMock('../game-state-accessor');
jest.dontMock('../game-state-enumerator');

describe('game state enumerator', () => {
  const GameStateEnumerator = require('../game-state-enumerator');
  const GameStateAccessor = require('../game-state-accessor');
  let enumerator;
  beforeEach(() => {
    enumerator = new GameStateEnumerator();
  });

  it('enumerates card draws', () => {
    enumerator.setState(GameStateAccessor.create({
      playerDeck: [1, 2, 3],
      enemyDeck: [4, 4, 5],
    }));

    enumerator.draw(2, 1);

    const states = enumerator.getStates();
    expect(states.length).toBe(18);
    const {player, enemy} = GameStateAccessor.instance.setState(states[0]);
    expect(player.deck).toEqual([3]);
    expect(player.hand).toEqual([2, 1]);
    expect(enemy.deck).toEqual([4, 5]);
    expect(enemy.hand).toEqual([4]);
  });

  it('enumerates card discards', () => {
    enumerator.setState(GameStateAccessor.create({
      playerHand: [1, 2, 3],
      enemyHand: [4, 5],
    }));

    enumerator.discard(2, 1);

    const states = enumerator.getStates();
    expect(states.length).toBe(12);
    const {player, enemy} = GameStateAccessor.instance.setState(states[0]);
    expect(player.hand).toEqual([3]);
    expect(player.discardPile).toEqual([1, 2]);
    expect(enemy.hand).toEqual([5]);
    expect(enemy.discardPile).toEqual([4]);
  });

  it('enumerates card cycling', () => {
    enumerator.setState(GameStateAccessor.create({
      playerDeck: [4, 5],
      playerHand: [1, 2, 3],
    }));

    enumerator.cycle(2, 0);

    const states = enumerator.getStates();
    expect(states.length).toBe(12);
    const {player, enemy} = GameStateAccessor.instance.setState(states[0]);
    expect(player.deck).toEqual([]);
    expect(player.hand).toEqual([5, 4, 3]);
    expect(player.discardPile).toEqual([1, 2]);
  });

  it('can put cards in play and discard them when the turn ends', () => {
    enumerator.setState(GameStateAccessor.create({
      playerHand: [1, 2],
      playerDiscard: [3, 4],
      enemyHand: [5],
    }));

    enumerator.play(0);
    enumerator.draw(1, 0);
    enumerator.endTurn();

    const states = enumerator.getStates();
    expect(states.length).toBe(2);
    const {player, enemy} = GameStateAccessor.instance.setState(states[0]);
    expect(player.deck).toEqual([]);
    expect(player.hand).toEqual([4, 3, 2]);
    expect(player.discardPile).toEqual([1]);
    expect(enemy.deck).toEqual([]);
    expect(enemy.hand).toEqual([5]);
    expect(enemy.discardPile).toEqual([]);
  });
});
