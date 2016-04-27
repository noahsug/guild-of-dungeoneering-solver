import Node from '../node';
import _ from '../../../utils/common';

jest.dontMock('../../game-engine/game-state');
jest.dontMock('../node-factory');

describe('node factory', () => {
  const NodeFactory = require('../node-factory');
  const Simulator = require('../../game-engine/simulator');
  const gs = require('../../game-engine/game-state');
  let factory;
  let sim;
  beforeEach(() => {
    sim = new Simulator();
    factory = new NodeFactory(sim);
  });

  it('creates a root node', () => {
    const state = gs.create();
    const rootNode = factory.createRootNode(state);
    expect(rootNode.type).toBe(Node.Type.ROOT);
  });

  it('creates nodes from a chance node', () => {
    sim.getMoves.mockReturnValueOnce([0, 1, 2]);
    const state = gs.create();
    const parent = {state, type: Node.Type.CHANCE};
    const children = factory.createChildren(parent);

    expect(children.length).toBe(3);
    expect(children[0].parent).toBe(parent);
    expect(children[0].state).toBe(state);
    expect(children[0].move).toBe(0);
    expect(children[0].type).toBe(Node.Type.PLAYER);
  });

  it('creates nodes from a player node', () => {
    const childState = gs.create({health: 5});
    sim.getStates.mockReturnValueOnce([childState]);
    const state = gs.create();
    const parent = {state, move: 1, type: Node.Type.PLAYER};
    const children = factory.createChildren(parent);

    expect(children.length).toBe(1);
    expect(children[0].parent).toBe(parent);
    expect(children[0].state).toBe(childState);
    expect(children[0].type).toBe(Node.Type.CHANCE);
  });
});
