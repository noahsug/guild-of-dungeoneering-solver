const CardResolver = require.requireActual('../card-resolver');

const MockCardResolver = jest.genMockFromModule('../card-resolver');

MockCardResolver.prototype.getResult = CardResolver.prototype.getResult;

// If a card has a samller value, it deals no damage.
MockCardResolver.prototype.resolve = function(state, playerCard, enemyCard) {
  state.playerHealth -= enemyCard >= playerCard ? enemyCard : 0;
  state.enemyHealth -= playerCard >= enemyCard ? playerCard : 0;
  return this.getResult(state);
};

export default MockCardResolver;
