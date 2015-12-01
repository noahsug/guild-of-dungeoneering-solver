jest.dontMock('../game-state');
jest.dontMock('../simulator');
jest.dontMock('../node');
jest.dontMock('../game-state-accessor');
jest.dontMock('../node-factory');
jest.dontMock('../mcts');
jest.dontMock('../mcts-runner');
jest.dontMock('../expansion-strategy');
jest.dontMock('../selection-strategy');

describe('MCTS runner', () => {
  const MctsRunner = require('../mcts-runner');
  it('should complete after 100 iterations', function() {
    const result = MctsRunner.run([1, 2, 3, 4], [1, 2, 3, 4],
                                  {iteration: 100});
    expect(result.wins).toBeDefined();
    expect(result.losses).toBeDefined();

    //console.log('wins', result.wins, 'losses', result.losses,
    //            100 * result.wins / (result.wins + result.losses), '%');
    //
    //let maxDepth = 0;
    //let maxDepthNode;
    //let num = 0;
    //function iterateNodes(node, depth) {
    //  if (depth > maxDepth) {
    //    maxDepth = depth;
    //    maxDepthNode = node;
    //  }
    //  num++;
    //  if (node.children) {
    //    node.children.forEach((c) => iterateNodes(c, depth + 1));
    //  }
    //}
    //
    //function calcWinRate(wins, losses) {
    //  if (wins + losses == 0) return 0;
    //  if (wins == Infinity) return 1;
    //  return wins / (wins + losses);
    //}
    //
    //iterateNodes(result, 0);
    //console.log('depth:', maxDepth, 'nodes:', num);
    //
    //function printNodes(nodes, depth) {
    //  const nodeText = nodes.map((c) => {
    //    const info = [c.wins, c.losses];
    //    if (c.type != 'root') {
    //      const state = c.type == 'chance' ? c.gameState : c.gameState.state;
    //      info.push(state.playerHealth, state.enemyHealth,
    //          state.playerHand, state.enemyHand);
    //      if (c.type == 'player') info.push(c.gameState.move);
    //    }
    //    return `[${info.join(' ')}]`;
    //  }).join('  ');
    //  console.log(nodes[0].type[0], `${depth}:`, nodeText);
    //}
    //
    //let node = maxDepthNode;
    //let depth = maxDepth;
    //while (node) {
    //  if (node.children && node.children.length) {
    //    printNodes(node.children, depth + 1);
    //    console.log('     |');
    //  }
    //  if (!node.parent) {
    //    printNodes([node], depth);
    //  }
    //  depth--;
    //  node = node.parent;
    //}
  });
});
