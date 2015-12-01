import _ from '../utils/common';

export default class NodePrinter {
  static simple(node) {
    const msg = [];
    if (node.type == 'chance') {
      msg.push('E' + node.gameState.state.enemyHand[0]);
    } else if (node.type == 'player') {
      msg.push('P' + node.gameState.move);
    } else {
      msg.push('S');
    }

    msg.push(`${i(node.wins)}/${i(node.losses)}`);
    function i(n) { return n == Infinity ? '@' : n; }

    //if (node.selection) msg.push('S' + Math.round(node.selection * 100) / 100);

    //if (node.selection) msg.push('X' + Math.round(node.expansion * 100) / 100);

    //msg.push('R' + _.decimals(node.winRate, 2));

    //if (node.gameState.state.id) msg.push('I' + node.gameState.state.id);

    //if (node.weight) msg.push('W' + node.weight);

    if (node.bestResult) {
      msg.push(_.decimals(node.bestResult, 2) + '/' +
               _.decimals(node.worstResult, 2));
    }

    if (node.result) msg.push('R');

    if (node.end) msg.push('END');

    return msg.join(' ');
  }
}
