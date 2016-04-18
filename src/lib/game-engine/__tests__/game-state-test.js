jest.dontMock('../game-state');

describe('game state', () => {
  const gs = require('../game-state');

  it('can draw a card', () => {
    const state = gs.create({
      deck: [1, 2, 3],
      hand: [4, 5],
    });
    gs.draw(state.player, 0);
    expect(state.player.deck).toEqualValues([2, 3]);
    expect(state.player.hand).toEqualValues([1, 4, 5]);
  });

  it('can discard a card', () => {
    const state = gs.create({
      hand: [4, 5],
      discard: [],
    });
    gs.discard(state.player, 0);
    expect(state.player.hand).toEqual([5]);
    expect(state.player.discard).toEqual([4]);
  });

  it('can draw discard pile if deck is empty', () => {
    const state = gs.create({
      deck: [1],
      hand: [],
      discard: [2, 3],
    });
    gs.prepDraw(state.player);
    expect(state.player.deck).toEqual([1]);
    expect(state.player.hand).toEqual([]);
    expect(state.player.discard).toEqualValues([2, 3]);

    gs.draw(state.player, 0);
    gs.draw(state.player, 0);
    expect(state.player.deck).toEqual([3]);
    expect(state.player.hand).toEqualValues([2, 1]);
    expect(state.player.discard).toEqual([]);
  });

  it('can steal cards', () => {
    const state = gs.create({
      hand: [1],
    });
    gs.steal(state.enemy, state.player, 0);
    expect(state.player.hand).toEqual([]);
    expect(state.enemy.deck).toEqual([1]);
  });
});
