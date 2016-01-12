jest.dontMock('../game-state-accessor');
jest.dontMock('../game-state-player-accessor');

describe('game state accessor', () => {
  const GameStateAccessor = require('../game-state-accessor');
  const accessor = new GameStateAccessor();

  it('can access deck, hand and discardPile', () => {
    const state = {
      playerDeck: [1, 2, 3],
      enemyHand: [4, 5],
      playerDiscardPile: [8],
    };
    const {player, enemy} = accessor.setState(state);
    expect(player.deck).toEqual(state.playerDeck);
    expect(enemy.hand).toEqual(state.enemyHand);
    expect(player.discardPile).toEqual(state.playerDiscardPile);
  });

  it('can draw a card', () => {
    const state = {
      playerDeck: [1, 2, 3],
      playerHand: [4, 5],
    };
    const {player} = accessor.setState(state);
    player.draw(0);
    expect(state.playerDeck).toEqualValues([2, 3]);
    expect(state.playerHand).toEqualValues([1, 4, 5]);
  });

  it('can discard a card', () => {
    const state = {
      playerHand: [4, 5],
      playerDiscardPile: [],
    };
    const {player} = accessor.setState(state);
    player.discard(0);
    expect(state.playerHand).toEqual([5]);
    expect(state.playerDiscardPile).toEqual([4]);
  });

  it('can discard multiple cards', () => {
    const state = {
      playerHand: [1, 2, 3, 4],
      playerDiscardPile: [],
    };
    const {player} = accessor.setState(state);
    player.discardMultiple([0, 2]);
    expect(state.playerHand).toEqualValues([2, 4]);
    expect(state.playerDiscardPile).toEqualValues([1, 3]);
  });

  it('can draw discard pile if deck is empty', () => {
    const state = {
      playerDeck: [1],
      playerHand: [],
      playerDiscardPile: [2, 3],
    };
    const {player} = accessor.setState(state);
    player.prepDraw();
    expect(state.playerDeck).toEqual([1]);
    expect(state.playerHand).toEqual([]);
    expect(state.playerDiscardPile).toEqualValues([2, 3]);

    player.draw(0);
    player.draw(0);
    expect(state.playerDeck).toEqual([3]);
    expect(state.playerHand).toEqualValues([2, 1]);
    expect(state.playerDiscardPile).toEqual([]);
  });
});
