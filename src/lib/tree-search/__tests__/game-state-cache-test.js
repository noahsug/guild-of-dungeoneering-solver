import _ from '../../../utils/common';

jest.dontMock('../game-state-cache');
jest.dontMock('../../game-engine/game-state-accessor');
jest.dontMock('../../game-engine/game-state-player-accessor');
jest.dontMock('../../game-engine/card');
jest.dontMock('../../game-data');

describe('Game state cache', () => {
  const GameStateCache = require('../game-state-cache');
  const GameStateAccessor = require('../../game-engine/game-state-accessor');

  function createState(values = {}, result) {
    const state = GameStateAccessor.create(_.defaults(values, {
      playerDeck: [1, 2, 3],
      playerHand: [2, 3],
      playerDiscardPile: [3, 4, 4],
      playerHealth: 5,
      enemyDeck: [50, 52, 54],
      enemyHand: [9, 2],
      enemyDiscardPile: [52, 9, 2],
      enemyHealth: 3,
    }));
    return {gameState: {state}, result};
  }

  it('caches game state', function() {
    const cache = new GameStateCache();
    cache.cacheResult(createState({}, 0.75));
    const state = createState();
    expect(cache.getResult(state)).toBe(0.75);
  });

  it('detects changes in health', function() {
    const cache = new GameStateCache();
    cache.cacheResult(createState({}, 0.25));
    const state = createState({playerHealth: 6});
    expect(cache.getResult(state)).toBeUndefined();
  });

  it('detects changes in cards', function() {
    const cache = new GameStateCache();
    cache.cacheResult(createState({}, 0.25));
    const state = createState({
      playerDeck: [1, 2, 4],
    });
    expect(cache.getResult(state)).toBeUndefined();
  });
});
