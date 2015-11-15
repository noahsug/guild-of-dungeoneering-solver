import _ from '../utils/common';

export default class ExpansionStrategy {
  constructor(nodeFactory, playouts = 50) {
    this.playouts = playouts;
    this.nodeFactory = nodeFactory;
  }

  selectChild(children) {
    if (children[0].type == 'chance') {
      return _.sample(children);
    }
    const results = children.map((node) => {
      return {result: this.runPlayouts_(node), node};
    });
    const selection = _.max(results, _.iteratee('result')).node;

    //function printNode(r) {
    //  const n = r.node;
    //  const move = n.gameState.move;
    //  const state = n.gameState.state;
    //  const data = [state.playerHealth, state.enemyHealth, '/',
    //                state.playerHand, state.enemyHand, '/', move,
    //                '/', r.result];
    //  return data.join(' ');
    //}
    //console.log('\nOUT OF\n', results.map(printNode).join('  |  '),
    //            '\nselected: ', children.indexOf(selection));

    return selection;
  }

  runPlayouts_(node) {
    let result = 0;
    for (let i = 0; i < this.playouts; i++) {
      result += this.nodeFactory.playout(node);
    }
    return result + Math.random() / 100;
  }
}
