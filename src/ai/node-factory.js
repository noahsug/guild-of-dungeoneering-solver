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
    if (node.type == Node.Type.PLAYER) {
      const generator = this.simulator.getStateGenerator(
          node.gameState.state, node.gameState.move);
      node.children = this.getChildrenForStates_(generator, node);
    }

    else if (node.type == Node.Type.ROOT) {
      const generator = this.simulator.getInitialStateGenerator(
          node.gameState.state);
      node.children = this.getChildrenForStates_(generator, node);
    }

    else if (node.type == Node.Type.CHANCE) {
      // Simulator is responsible for removing duplicates.
      const moves = this.simulator.getMoves(node.gameState.state);
      node.children = moves.map(move => {
        return this.createNode(move, Node.Type.PLAYER, node);
      });
    }

    return node.children;
  }

  getChildrenForStates_(generator, parent) {
    const results = [];
    for (const state of generator) {
      results.push(this.createNode(state, Node.Type.CHANCE, parent));
    }
    return results;
  }

  // Value is either the card played or the next game state.
  createNode(value, type, parent) {
    let gameState;
    if (type == Node.Type.CHANCE || type == Node.Type.ROOT) {
      gameState = {state: value};
    } else {
      gameState = {state: parent.gameState.state, move: value};
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
