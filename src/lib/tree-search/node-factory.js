import Node from './node';
import gs from '../game-engine/game-state';
import _ from '../../utils/common';

export default class NodeFactory {
  constructor(simulator) {
    this.simulator = simulator;
    this.visited_ = {};
  }

  createRootNode(state) {
    const type = gs.isInitialGameState(state) ?
        Node.Type.ROOT : Node.Type.CHANCE;
    return this.createNode(state, type);
  }

  createChildren(node) {
    if (node.children && node.children.length) return node.children;
    if (node.type == Node.Type.PLAYER) {
      const optimize = node.parent && node.parent.parent;
      const states = this.simulator.getStates(
        node.gameState.state, node.gameState.move, optimize);
      node.children = this.getChildrenForStates_(states, node);
    }

    else if (node.type == Node.Type.ROOT) {
      const states = this.simulator.getInitialStates(
          node.gameState.state);
      node.children = this.getChildrenForStates_(states, node);
    }

    else if (node.type == Node.Type.CHANCE) {
      // Simulator is responsible for removing duplicates.
      const moves = this.simulator.getMoves(node.gameState.state);
      const len = moves.length;
      node.children = new Array(len);
      for (let i = 0; i < len; i++) {
        node.children[i] = this.createNode(moves[i], Node.Type.PLAYER, node);
      }
    }

    return node.children;
  }

  getChildrenForStates_(states, parent) {
    const len = states.length;
    const result = new Array(len);
    for (let i = 0; i < len; i++) {
      result[i] = this.createNode(states[i], Node.Type.CHANCE, parent);
    }
    return result;
  }

  // Value is either the card played or the next game state.
  createNode(value, type, parent) {
    let gameState;
    if (type == Node.Type.PLAYER) {
      gameState = {state: parent.gameState.state, move: value};
    } else {
      gameState = {state: value};
    }
    const result = gs.result(gameState.state);
    return {
      type,
      parent,
      gameState,
      result,
      id: -1,  // Set by game_state_cache.js
    };
  }
}
