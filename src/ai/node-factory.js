import Node from './node';
import GameStateAccessor from './game-state-accessor';
import _ from '../utils/common';

export default class NodeFactory {
  constructor(simulator) {
    this.simulator = simulator;
    this.visited_ = {};
  }

  createRootNode(gameState) {
    const type = GameStateAccessor.isInitialGameState(gameState) ?
        Node.Type.ROOT : Node.Type.CHANCE;
    return this.createNode(gameState, type);
  }

  createChildren(node) {
    if (node.children && node.children.length) return node.children;
    if (node.type == Node.Type.PLAYER) {
      const states = this.simulator.getStates(
          node.gameState.state, node.gameState.move);
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
    const result = this.simulator.getResult(gameState.state);
    return {
      type,
      parent,
      gameState,
      //uid: _.uid(),
      result,
    };
  }

  playout(node) {
    let state = this.simulator.cloneState(node.gameState.state);
    if (node.type == Node.Type.PLAYER) {
      state = this.simulator.play(state, node.gameState.move);
    }
    while (!state.result) {
      const moves = this.simulator.getMoves(state);
      state = this.simulator.play(state, _.sample(moves));
    }
    return state;
  }

  playOnce(node) {
    let result;
    const state = this.simulator.cloneState(node.gameState.state);
    if (node.type == Node.Type.PLAYER) {
      this.simulator.play(state, node.gameState.move);
    } else {
      const moves = this.simulator.getMoves(state);
      this.simulator.play(state, _.sample(moves));
    }
    return state;
  }
}
