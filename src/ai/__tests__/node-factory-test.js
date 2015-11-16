jest.dontMock('../node-factory');
jest.dontMock('../node');

describe('node factory', () => {
  const NodeFactory = require('../node-factory');
  const Node = require('../node');
  const Simulator = require('../simulator');
  let factory;
  let sim;
  beforeEach(() => {
    sim = new Simulator();
    factory = new NodeFactory(sim);
  });

  it('creates a root node', () => {
    const rootNode = factory.createRootNode({});
    expect(rootNode.type).toBe('root');
  });

  it('creates nodes from a chance node', () => {
    sim.getMoves.mockReturnValueOnce([0, 1, 2]);
    const parent = new Node({}, 'chance');
    const children = factory.createChildren(parent);
    expect(children.length).toBe(3);
    expect(children[0].parent).toBe(parent);
    expect(children[0].gameState.state).toBe(parent.gameState);
    expect(children[0].gameState.move).toBe(0);
    expect(children[0].type).toBe('player');
  });

  it('creates nodes from a player node', () => {
    const states = [{}, {}, {}];
    sim.getStates.mockReturnValueOnce(states);
    const parent = new Node({state: {}, move: 1}, 'player');
    const children = factory.createChildren(parent);
    expect(children.length).toBe(3);
    expect(children[0].parent).toBe(parent);
    expect(children[0].gameState).toBe(states[0]);
    expect(children[0].type).toBe('chance');
  });
});
