jest.dontMock('../mcts');

describe('mcts', () => {
  const Mcts = require('../mcts').default;
  it('should do stuff', () => {
    const mcts = new Mcts();
    expect(mcts).toBeDefined();
  });
});
