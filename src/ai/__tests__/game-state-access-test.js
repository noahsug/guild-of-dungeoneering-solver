jest.dontMock('../game-state-accessor');

describe('game state accessor', () => {
  const GameStateAccessor = require('../game-state-accessor');
  const access = new GameStateAccessor();

  it('can make the player draw a card', () => {
    const state = {
      playerDeck: [1, 2, 3],
      playerHand: [4, 5],
    };
    access.asPlayer(state).draw(0);
    expect(state.playerDeck).toEqual([2, 3]);
    expect(state.playerHand).toEqual([1, 4, 5]);
  });

  it('can make the enemy draw a card', () => {
    const state = {
      enemyDeck: [5],
      enemyHand: [],
    };
    access.asEnemy(state).draw(0);
    expect(state.enemyDeck).toEqual([]);
    expect(state.enemyHand).toEqual([5]);
  });
});
