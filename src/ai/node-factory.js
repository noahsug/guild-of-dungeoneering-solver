import _ from '../utils/common';
import Node from './node';

export default class NodeFactory {
  constructor(simulator) {
    this.simulator = simulator;
  }

  createRootNode(gameState) {
    return new Node(gameState, 'root');
  }

  createChildren(node) {
    let values;
    let type;
    if (node.type == 'chance') {
      values = this.simulator.getMoves(node.gameState);
      type = 'player';
    } else if (node.type == 'player') {
      values = this.simulator.getStates(
          node.gameState.state, node.gameState.move);
      type = 'chance';
    } else {  // root node
      values = this.simulator.getInitialStates(node.gameState);
      type = 'chance';
    }
    return this.createChildrenInternal_(node, values, type);
  }

  createChildrenInternal_(parent, values, type) {
    return values.map((v) => {
      const state = type == 'chance' ? v : parent.gameState;
      const gameState = type == 'chance' ? state : {state, move: v};
      const child = new Node(gameState, type);
      const result = this.simulator.getResult(state);
      if (result) child.result = result;
      child.parent = parent;
      return child;
    });
  }

  playout(node) {
    let result;
    let gameState;
    if (node.type == 'chance') {
      gameState = this.simulator.cloneState(node.gameState);
    } else {
      gameState = this.simulator.cloneState(node.gameState.state);
      result = this.simulator.play(gameState, node.gameState.move);
    }
    while (!result) {
      const moves = this.simulator.getMoves(gameState);
      result = this.simulator.play(gameState, _.sample(moves));
    }
    return result;
  }
}
