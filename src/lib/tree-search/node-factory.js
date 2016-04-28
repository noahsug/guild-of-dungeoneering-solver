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
      id: -1,
    };
  }

  rootCreateChildren(node) {
    const states = this.simulator.getInitialStates(node.state);
    node.children = this.getChildrenForStates_(states, node);
  }

  chanceCreateChildren(node) {
    // Simulator is responsible for removing duplicate moves.
    const moves = this.simulator.getMoves(node.state);
    const len = moves.length;
    for (let i = 0; i < len; i++) {
      moves[i] = {
        type: Node.Type.PLAYER,
        parent: node,
        state: node.state,
        move: moves[i],
        result: node.result,
      };
    }
    node.children = moves;
  }

  playerCreateChildren(node) {
    const optimize = node.parent && node.parent.parent;
    const states = this.simulator.getStates(
      node.state, node.move, optimize);
    node.children = this.getChildrenForStates_(states, node);
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
        id: -1,
      };
    }
    return states;
  }
}
