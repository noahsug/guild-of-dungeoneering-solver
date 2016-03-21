import _ from '../../utils/common';

jest.autoMockOff();

describe('Game data', () => {
  const Card = require('../game-engine/card');
  const gameData = require('../game-engine/game-data');

  it('each player is valid', function() {
    _.each(gameData.enemies, (player) => {
      expect(player.health).toBeDefined();
      expect(player.sets).toBeDefined();
      _.each(player.sets, (set) => {
        if (!gameData.sets[set]) console.log('missing', set);
        expect(gameData.sets[set]).toBeDefined();
      });
    });
  });
});
