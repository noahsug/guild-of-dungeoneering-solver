import _ from '../utils/common';
import Card from './card';
import Node from './node';

export default class NodePrinter {
  static simple(node) {
    const msg = [];
    if (node.type == Node.Type.CHANCE) {
      msg.push('e' + Card.list[node.gameState.state.enemyHand[0]].desc);
    } else if (node.type == Node.Type.PLAYER) {
      msg.push('p' + Card.list[node.gameState.move].desc);
    } else {
      msg.push('S');
    }

    msg.push(node.gameState.state.playerHealth + '/' +
             node.gameState.state.enemyHealth);

    //msg.push(`${i(node.wins)}/${i(node.losses)}`);
    //function i(n) { return n == Infinity ? '@' : n; }

    //if (node.selection) msg.push('S' + Math.round(node.selection * 100) / 100);

    //if (node.selection) msg.push('X' + Math.round(node.expansion * 100) / 100);

    //msg.push('R' + _.decimals(node.winRate, 2));

    //if (node.gameState.state.id) msg.push('I' + node.gameState.state.id);

    //if (node.weight) msg.push('W' + node.weight);

    if (node.result) {
      msg.push(_.decimals(node.result, 2) + 'R');
    } else if (node.winRate) {
      msg.push(_.decimals(node.winRate, 2));
    }

    //if (node.end) msg.push('END');

    return msg.join(' ');
  }
}
