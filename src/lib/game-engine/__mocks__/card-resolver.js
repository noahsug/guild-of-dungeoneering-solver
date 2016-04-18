const MockCardResolver = jest.genMockFromModule('../card-resolver');
const gs = require.requireActual('../game-state');

MockCardResolver.prototype.resolve = (state, playerCard, enemyCard) => {
  const player = state.player;
  const enemy = state.enemy;
  // If a card has a samller value, it deals no damage.
  player.health -= enemyCard >= playerCard ? enemyCard : 0;
  enemy.health -= playerCard >= enemyCard ? playerCard : 0;
  return gs.result(state);
};

export default MockCardResolver;
