import Node from '../node';
import _ from '../../utils/common';

jest.dontMock('../expectimax');

describe('expectimax', () => {
  const Expectimax = require('../expectimax');
  const NodeFactory = require('../node-factory');
  const tree = [[
    [
      1, -1,
    ],
    1,
    -1,
  ]];

  let expectimax;
  beforeEach(() => {
    const nodeFactory = new NodeFactory();
    nodeFactory.createRootNode.mockImpl((state) => {
      return {state, type: Node.Type.ROOT};
    });
    nodeFactory.createChildren.mockImpl((node) => {
      node.children = node.state.map((s) => {
        const type = node.type == Node.Type.CHANCE ?
            Node.Type.PLAYER : Node.Type.CHANCE;
        const result = _.isArray(s) ? 0 : s;
        return {type, state: s, result, parent: node};
      });
    });

    expectimax = new Expectimax();
    expectimax.nodeFactory = nodeFactory;
  });

  it('begins on the root node', () => {
    expectimax.setState(tree, {newGame: true});
    expect(expectimax.node_.state).toEqual(tree);
  });

  it('selects a child of the root node on next()', () => {
    expectimax.setState(tree, {newGame: true});
    expectimax.next();  // 0
    expect(expectimax.node_.state).toEqual(tree[0]);
  });

  it('performs a depth first search', () => {
    expectimax.setState(tree, {newGame: true});
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 -> 0 (has reuslt!)
    expect(expectimax.node_.state).toEqual(tree[0][0][0]);
    expect(expectimax.node_.result).toEqual(1);
  });

  it('takes the expected value', () => {
    expectimax.setState(tree, {newGame: true});
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 -> 0 (result = 1)
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 -> 1 (result = -1)
    expectimax.next();  // 0 -> 0 (result = 0.5)
    expect(expectimax.node_.result).toBe(0.5);
  });

  it('stops checking other player moves if a winner has been found', () => {
    expectimax.setState(tree, {newGame: true});
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 -> 0 (result = 1)
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 -> 1 (result = -1)
    expectimax.next();  // 0 -> 0 (result = 0.5)
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 1 (result = 1)
    expectimax.next();  // 0 (result = 1)
    expect(expectimax.node_.result).toBe(1);

    expectimax.next();
    expect(expectimax.node_.state).toNotBe(-1);
  });

  it('solves the tree', () => {
    expectimax.setState(tree, {newGame: true});
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 -> 0 (result = 1)
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 -> 1 (result = -1)
    expectimax.next();  // 0 -> 0 (result = 0.5)
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 1 (result = 1)
    expectimax.next();  // 0 (result = 1)
    expectimax.next();
    expect(expectimax.rootNode.result).toBe(1);
  });

  it('does alpha beta pruning', () => {
    const tree = [[
      [1, -1],
      [
        -1,
        [[-1, -1, 1]],
        1,
      ],
    ]];
    expectimax.setState(tree, {newGame: true});
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 -> 0 (result = 1)
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 -> 1 (result = -1)
    expectimax.next();  // 0 -> 0 (result = 0.5)
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 1
    expectimax.next();  // 0 -> 1 -> 0 (result = -1)
    expectimax.next();  // 0 -> 1
    expectimax.next();  // 0 -> 1 -> 1
    expectimax.next();  // 0 -> 1 -> 1 -> 0
    expectimax.next();  // 0 -> 1 -> 1 -> 0 -> 0 (result = -1)
    expectimax.next();  // 0 -> 1 -> 1 -> 0
    expectimax.next();  // 0 -> 1 -> 1 -> 0 -> 1 (result = -1)
    expectimax.next();  // 0 -> 1 -> 1 -> 0 (result = -Infinity)
    expect(expectimax.node_.result).toBe(-Infinity);

    expectimax.next();  // 0 -> 1 -> 1 (result = -1)
    expect(expectimax.node_.state).toNotBe(1);

    expectimax.next();  // 0 -> 1 (result = -Infinity)
    expect(expectimax.node_.result).toBe(-Infinity);

    expectimax.next();  // 0
    expect(expectimax.node_.state).toNotBe(1);
    expect(expectimax.node_.result).toBe(0.5);
  });
});
