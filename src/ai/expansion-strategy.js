import _ from '../utils/common';
import GameStateAccessor from './game-state-accessor';
import Card from './card';
import Node from './node';

export default class ExpansionStrategy {
  constructor(nodeFactory, playouts = 0) {
    this.playouts = playouts;
    this.nodeFactory = nodeFactory;
  }

  selectChild(children) {
    if (children[0].type == Node.Type.CHANCE) {
      return _.sample(children);
    }
    return _.max(children, (c) => {
      const state = this.nodeFactory.playOnce(c);
      const [player, enemy] = GameStateAccessor.access(state);
      const hpDiff = player.health - enemy.health;
      return hpDiff * 10000 - enemy.health + player.hand.length * 100 ||
          Math.random();
    });

    //const results = children.map((node) => {
    //  const result = this.runPlayouts_(node);
    //  //node.expansion = result;
    //  return {result, node};
    //});
    //const selection = _.max(results, _.iteratee('result')).node;

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

    //return selection;
  }

  runPlayouts_(node) {
    let result = 0;
    for (let i = 0; i < this.playouts; i++) {
      result += this.nodeFactory.playout(node);
    }
    return result + Math.random() / 100;
  }
}
