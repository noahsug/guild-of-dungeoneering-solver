import _ from '../../../utils/common';
jest.autoMockOff();

describe('card mover', () => {
  const CardMover = require('../card-mover');
  let mover;

  beforeEach(() => {
    mover = new CardMover();
    const orderValues = [0, 1];
    const order = {
      cycleDiscardValues: orderValues,
      cycleDrawValues: orderValues,
      drawValues: orderValues,
      discardValues: orderValues,
      endTurnDrawValues: orderValues,
    };
    mover.setCardOrder(order);
  });

  it('moves the card played into the discard', () => {
    const state = {player: {
      deck: [1],
      hand: [2],
      discard: [],
    }};
    mover.moveCards(state, 0, 0);
    expect(state.player.deck).toEqual([]);
    expect(state.player.hand).toEqual([1]);
    expect(state.player.discard).toEqual([2]);
  });

  it('does nothing when hand is full and no discard effect', () => {
    const state = {player: {
      deck: [],
      hand: [1, 2, 3, 4],
      discard: [],
    }};
    mover.moveCards(state, 0, 0);
    expect(state.player.deck).toEqual([]);
    expect(state.player.hand.sort()).toEqual([1, 2, 3, 4]);
    expect(state.player.discard).toEqual([]);
  });

  it('cycles cards', () => {
    const state = {player: {
      deck: [1, 2],
      hand: [3, 4],
      discard: [],
      cycleEffect: 1,
    }};

    mover.moveCards(state, 1, 0);
    expect(state.player.deck).toEqual([]);
    expect(state.player.hand.sort()).toEqual([1, 2]);
    expect(state.player.discard.sort()).toEqual([3, 4]);
  });

  it('draws cards', () => {
    const state = {player: {
      deck: [1, 2],
      hand: [3, 4],
      discard: [],
      drawEffect: 2,
    }};

    mover.moveCards(state, 1, 0);
    expect(state.player.deck).toEqual([]);
    expect(state.player.hand.sort()).toEqual([1, 2, 3, 4]);
    expect(state.player.discard).toEqual([]);
  });

  it('discards cards', () => {
    const state = {player: {
      deck: [1, 2],
      hand: [3, 4],
      discard: [],
      discardEffect: 2,
    }};

    mover.moveCards(state, 1, 0);
    expect(state.player.deck).toEqual([2]);
    expect(state.player.hand).toEqual([1]);
    expect(state.player.discard.sort()).toEqual([3, 4]);
  });
});
