const MockCardResolver = jest.genMockFromModule('../card-resolver');
const GameStateAccessor = require.requireActual('../game-state-accessor');

MockCardResolver.prototype.resolve = (state, playerCard, enemyCard) => {
  const accessor = GameStateAccessor.instance.setState(state);
  const {player, enemy} = accessor;
  // If a card has a samller value, it deals no damage.
  player.health -= enemyCard >= playerCard ? enemyCard : 0;
  enemy.health -= playerCard >= enemyCard ? playerCard : 0;
  return player.dead || enemy.dead;
};

export default MockCardResolver;
