import Node from './node';
import gs from '../game-engine/game-state';
import _ from '../../utils/common';

export default class NodeFactory {
  constructor(simulator) {
    this.simulator = simulator;
  }

  createRootNode(state) {
    const type = gs.isInitialGameState(state) ?
        Node.Type.ROOT : Node.Type.CHANCE;
    return {
      type,
      state,
      result: gs.result(state),
      winRate: type == Node.Type.ROOT ? 1 : -Infinity,
      pruneCutoff: 0,
      index: 0,
      wins: 0,
      id: -1,
    };
  }

  createChildren(node) {
    if (node.type == Node.Type.PLAYER) {
      const optimize = node.parent && node.parent.parent;
      const states = this.simulator.getStates(
        node.state, node.move, optimize);
      node.children = this.getChildrenForStates_(states, node);
    }

    else if (node.type == Node.Type.ROOT) {
      const states = this.simulator.getInitialStates(node.state);
      node.children = this.getChildrenForStates_(states, node);
    }

    else if (node.type == Node.Type.CHANCE) {
      // Simulator is responsible for removing duplicates.
      const moves = this.simulator.getMoves(node.state);
      const len = moves.length;
      for (let i = 0; i < len; i++) {
        moves[i] = {
          type: Node.Type.PLAYER,
          parent: node,
          state: node.state,
          move: moves[i],
          result: node.result,
          winRate: 1,
          pruneCutoff: 0,
          index: 0,
          wins: 0,
          id: -1,
        };
      }
      node.children = moves;
    }

    return node.children;
  }

  getChildrenForStates_(states, parent) {
    const len = states.length;
    for (let i = 0; i < len; i++) {
      states[i] = {
        type: Node.Type.CHANCE,
        parent,
        state: states[i],
        result: gs.result(states[i]),
        winRate: -Infinity,
        pruneCutoff: 0,
        index: 0,
        wins: 0,
        id: -1,
      };
    }
    return states;
  }
}
