jest.dontMock('../mcts');

xdescribe('mcts', () => {
  const Mcts = require('../mcts');
  it('should do stuff', () => {
    const mcts = new Mcts();
    expect(mcts).toBeDefined();
  });
});
