import _ from '../../../utils/common';
jest.dontMock('../fast-state');

describe('card mover', () => {
  const fs = require('../fast-state');

  it('draws one', () => {
    const player = {
      deck: [1, 2, 3],
      hand: [],
      discard: [],
    };
    fs.drawOne(player, 0);
    expect(player.deck.sort()).toEqual([2, 3]);
    expect(player.hand).toEqual([1]);

    fs.drawOne(player, 0.9);
    expect(player.deck).toEqual([2]);
    expect(player.hand.sort()).toEqual([1, 3]);

    fs.drawOne(player, 0);
    expect(player.deck).toEqual([]);
    expect(player.hand.sort()).toEqual([1, 2, 3]);
  });

  it('draws one from discard when deck is empty', () => {
    const player = {
      deck: [],
      hand: [],
      discard: [1],
    };

    fs.drawOne(player, 0);
    expect(player.deck).toEqual([]);
    expect(player.hand).toEqual([1]);
    expect(player.discard).toEqual([]);
  });

  it('draws cards', () => {
    const player = {
      deck: [1, 2, 3, 4, 5],
      hand: [],
      discard: [],
    };
    fs.draw(player, 0.5, 2);
    expect(player.deck.sort()).toEqual([1, 2, 5]);
    expect(player.hand.sort()).toEqual([3, 4]);

    fs.draw(player, 0.9, 2);
    expect(player.deck).toEqual([2]);
    expect(player.hand.sort()).toEqual([1, 3, 4, 5]);
  });

  it('draws from discard when deck is empty', () => {
    const player = {
      deck: [],
      hand: [],
      discard: [1, 2],
    };

    fs.draw(player, 0, 2);
    expect(player.deck).toEqual([]);
    expect(player.hand.sort()).toEqual([1, 2]);
    expect(player.discard).toEqual([]);
  });

  it('does not draw with full hand', () => {
    const player = {
      deck: [],
      hand: [1, 2, 3],
      discard: [],
    };

    fs.draw(player, 0, 2);
    expect(player.deck).toEqual([]);
    expect(player.hand.sort()).toEqual([1, 2, 3]);
    expect(player.discard).toEqual([]);
  });

  it('discards cards', () => {
    const player = {
      deck: [],
      hand: [1, 2, 3, 4, 5],
      discard: [],
    };
    fs.discard(player, 0.5, 2);
    expect(player.hand.sort()).toEqual([1, 2, 5]);
    expect(player.discard.sort()).toEqual([3, 4]);

    fs.discard(player, 0.9, 2);
    expect(player.hand).toEqual([2]);
    expect(player.discard.sort()).toEqual([1, 3, 4, 5]);
  });
});
