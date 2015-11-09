jest.dontMock('../mcts');

describe('mcts', () => {
  const Mcts = require('../mcts');
  it('should do stuff', () => {
    let mcts = new Mcts();
    expect(mcts).toBeDefined();
  });
});
