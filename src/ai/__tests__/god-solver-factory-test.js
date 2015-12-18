jest.dontMock('../simulator');
jest.dontMock('../game-state-accessor');
jest.dontMock('../node-factory');
jest.dontMock('../expectimax');
jest.dontMock('../god-solver-factory');

describe('God solver factory', () => {
  const GodSolverFactory = require('../god-solver-factory');
  const GameStateAccessor = require('../game-state-accessor');

  it('returns solver', function() {
    const godSolverFactory = new GodSolverFactory();
    const gameState = GameStateAccessor.create({
      playerDeck: [1, 2, 3, 4], enemyDeck: [1, 2, 3, 4]});
    const solver = godSolverFactory.createCustom(gameState, {iteration: 100});
    solver.solve();
    expect(solver.rootNode.result).toBeDefined();
  });
});
