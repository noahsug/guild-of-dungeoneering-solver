import _ from '../utils/common';

export default class NodePrinter {
  static simple(node) {
    const msg = [];
    if (node.type == 'chance') {
      msg.push('E' + node.gameState.enemyHand[0]);
    } else if (node.type == 'player') {
      msg.push('P' + node.gameState.state.playerHand[node.gameState.move]);
    }

    msg.push(`${i(node.wins)}/${i(node.losses)}`);
    function i(n) { return n == Infinity ? '@' : n; }

    //if (node.selection) msg.push('S' + Math.round(node.selection * 100) / 100);

    //if (node.selection) msg.push('X' + Math.round(node.expansion * 100) / 100);

    //msg.push('R' + _.decimals(node.winRate * 100, 0));

    if (node.end) msg.push('END');

    return msg.join(' ');
  }
}
