import Node from '../node';
import _ from '../../../utils/common';

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
      return {
        state,
        type: Node.Type.ROOT,
        winRate: 1,
        pruneCutoff: 0,
        index: 0,
        wins: 0,
      };
    });

    nodeFactory.createChildren.mockImpl((node) => {
      node.children = node.state.map((s) => {
        const type = node.type == Node.Type.CHANCE ?
            Node.Type.PLAYER : Node.Type.CHANCE;
        const result = _.isArray(s) ? 0 : s;
        return {
          type,
          winRate: type == Node.Type.CHANCE ? -Infinity : 1,
          pruneCutoff: 0,
          index: 0,
          wins: 0,
          state: s,
          result,
          parent: node,
        };
      });
    });

    expectimax = new Expectimax();
    expectimax.nodeFactory = nodeFactory;
  });

  it('begins on the root node', () => {
    expectimax.setState(tree);
    expect(expectimax.node_.state).toEqual(tree);
  });

  it('selects a child of the root node on next()', () => {
    expectimax.setState(tree);
    expectimax.next();  // 0
    expect(expectimax.node_.state).toEqual(tree[0]);
  });

  it('performs a depth first search', () => {
    expectimax.setState(tree);
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 (children have reuslt!)
    expect(expectimax.node_.state).toEqual(tree[0][0]);
  });

  it('takes the expected value', () => {
    expectimax.setState(tree);
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 (result = 0.5)
    expect(expectimax.node_.result).toBe(0.5);
  });

  it('stops checking other player moves if a winner has been found', () => {
    expectimax.setState(tree);
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 (result = 0.5)
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 1 (result = 1)
    expectimax.next();  // 0 (result = 1)
    expect(expectimax.node_.result).toBe(1);

    expectimax.next();
    expect(expectimax.node_.state).toNotBe(-1);
  });

  it('solves the tree', () => {
    expectimax.setState(tree);
    expectimax.setState(tree);
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 (result = 0.5)
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 1 (result = 1)
    expectimax.next();  // 0 (result = 1)
    expectimax.next();
    expect(expectimax.rootNode.result).toBe(1);
  });

  it('caches state results', () => {
    const tree = [
      [-1, 1],
      [1],
    ];

    // Cache tree[0]
    let cachedResult;
    expectimax.cache_.cacheResult.mockImpl((n) => {
      if (n.state == tree[0]) cachedResult = n.result;
    });
    expectimax.cache_.getResult.mockImpl((n) => {
      if (n.state == tree[1]) return cachedResult;
      return 0;
    });

    expectimax.setState(tree);
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0 (result = -1)
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 1 (result = 1)
    expectimax.next();  // 0 (result = 1)
    expectimax.next();  //
    expectimax.next();  // 1 (cached result = 1)
    expect(expectimax.node_.result).toEqual(1);
    expectimax.next();  // (result = 1)
    expect(expectimax.node_.state).toEqual(tree);
  });

  it('gets the correct win rate', () => {
    const tree = [
      [
        [
          [-1, -1, 1, 1, 1],
          -1,
          [-1, 1, -1],
          -1,
        ],
        [-1, -1],
        -1,
        [-1, [-1, 1]],
        -1,
      ],
      [-1, -1],
      -1,
      [-1, [-1, 1]],
      -1,
    ];
    expectimax.setState(tree);
    for (let i = 0; i < 100; i++) {
      expectimax.next();
      if (expectimax.done) break;
    }
    expect(expectimax.rootNode.result).toBe(0.2);
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
    expectimax.setState(tree);
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 0
    expectimax.next();  // 0 -> 0 (result = 0.5)
    expectimax.next();  // 0
    expectimax.next();  // 0 -> 1
    expectimax.next();  // 0 -> 1 -> 1
    expectimax.next();  // 0 -> 1 -> 1 -> 0
    expectimax.next();  // 0 -> 1 -> 1 -> 0 (result = -Infinity)
    expect(expectimax.node_.result).toBe(-Infinity);

    expectimax.next();  // 0 -> 1 -> 1 (result = -Infinity)
    expect(expectimax.node_.result).toBe(-Infinity);

    expectimax.next();  // 0 -> 1 (result = -Infinity)
    expect(expectimax.node_.result).toBe(-Infinity);

    expectimax.next();  // 0
    expect(expectimax.node_.result).toBe(0.5);
  });
});
