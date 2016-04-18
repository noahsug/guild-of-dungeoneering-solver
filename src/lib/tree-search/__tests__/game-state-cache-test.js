import _ from '../../../utils/common';

jest.dontMock('../game-state-cache');
jest.dontMock('../../game-engine/game-state');
jest.dontMock('../../game-engine/card');
jest.dontMock('../../game-engine/game-data');

describe('Game state cache', () => {
  const GameStateCache = require('../game-state-cache');
  const gs = require('../../game-engine/game-state');
  let cache;

  function createNode(player = {}, enemy = {}, result = 0) {
    player = _.defaults(player, {
      deck: [1, 2, 3],
      hand: [2, 3],
      discard: [3, 4, 4],
      health: 5,
    });
    enemy = _.defaults(enemy, {
      deck: [50, 52, 54],
      hand: [9, 2],
      discard: [52, 9, 2],
      health: 3,
    });
    const state = gs.create(player, enemy);
    return {gameState: {state}, result, id: -1};
  }

  beforeEach(() => {
    cache = new GameStateCache();
  });

  it('caches game state', () => {
    cache.cacheResult(createNode({}, {}, 0.75));
    const node = createNode();
    expect(cache.getResult(node)).toBe(0.75);
  });

  it('detects changes in health', () => {
    const cache = new GameStateCache();
    cache.cacheResult(createNode({}, {}, 0.25));
    const node = createNode({health: 6});
    expect(cache.getResult(node)).toBe(0);
  });

  it('detects changes in cards', () => {
    const cache = new GameStateCache();
    cache.cacheResult(createNode({}, {}, 0.25));
    const node = createNode({deck: [1, 2, 4]});
    expect(cache.getResult(node)).toBe(0);
  });
});
