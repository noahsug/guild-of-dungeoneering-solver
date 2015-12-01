import _ from '../../utils/common';

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
    const parent = new Node({state: {}}, 'chance');
    const children = factory.createChildren(parent);
    expect(children.length).toBe(3);
    expect(children[0].parent).toBe(parent);
    expect(children[0].gameState.state).toBe(parent.gameState.state);
    expect(children[0].gameState.move).toBe(0);
    expect(children[0].type).toBe('player');
  });

  it('creates nodes from a player node', () => {
    sim.getStateGenerator.mockReturnValueOnce(_.iterator({health: 5}));
    const parent = new Node({state: {}, move: 1}, 'player');
    const children = factory.createChildren(parent);
    expect(children.length).toBe(1);
    expect(children[0].parent).toBe(parent);
    expect(children[0].gameState.state).toEqual({health: 5});
    expect(children[0].type).toBe('chance');
  });
});
