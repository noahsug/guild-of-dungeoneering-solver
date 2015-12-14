jest.dontMock('../simulator');
jest.dontMock('../game-state-accessor');
jest.dontMock('../node-factory');
jest.dontMock('../mcts');
jest.dontMock('../mcts-runner');
jest.dontMock('../expansion-strategy');
jest.dontMock('../selection-strategy');

describe('MCTS runner', () => {
  const MctsRunner = require('../mcts-runner');
  const GameStateAccessor = require('../game-state-accessor');
  it('should complete after 100 iterations', function() {
    const gameState = GameStateAccessor.create({
      playerDeck: [1, 2, 3, 4], enemyDeck: [1, 2, 3, 4]});
    const mcts = MctsRunner.runCustom(gameState, {iteration: 100});
    mcts.solve();
    expect(mcts.rootNode.wins).toBeDefined();
    expect(mcts.rootNode.losses).toBeDefined();
  });
});
