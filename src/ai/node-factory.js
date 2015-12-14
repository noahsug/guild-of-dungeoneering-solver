import _ from '../utils/common';
import Node from './node';

export default class NodeFactory {
  constructor(simulator) {
    this.simulator = simulator;
    this.visited_ = {};
  }

  createRootNode(gameState) {
    return this.createNode(gameState, {type: Node.Type.ROOT});
  }

  createChildren(node) {
    if (node.type == Node.Type.PLAYER) {
      const generator = this.simulator.getStateGenerator(
          node.gameState.state, node.gameState.move);
      this.setChildGenerator_(node, generator);
      node.generateChild();
    }

    else if (node.type == Node.Type.ROOT) {
      const generator = this.simulator.getInitialStateGenerator(
          node.gameState.state);
      this.setChildGenerator_(node, generator);
      node.generateChild();
    }

    else if (node.type == Node.Type.CHANCE) {
      // Simulator is responsible for removing duplicates.
      const moves = this.simulator.getMoves(node.gameState.state);
      node.children = moves.map(move => {
        return this.createNode(move, {type: Node.Type.PLAYER, parent: node});
      });
    }

    return node.children;
  }

  // Sets node.generateChild method. This method is set to null when there are
  // no more children to generate.
  setChildGenerator_(node, generator) {
    const cache = {};
    const options = {type: Node.Type.CHANCE, parent: node};
    const getUniqueChild = () => {
      const next = generator.next();
      if (next.done) return null;
      const state = next.value;
      if (!cache[state.id]) {
        const child = this.createNode(state, options);
        child.weight = 1;
        cache[state.id] = child;
        return child;
      }
      cache[state.id].weight++;
      node.childrenWeight++;
      node.nonuniqueChildren.push(cache[state.id]);
      return getUniqueChild();
    };

    let nextChild;
    node.generateChild = () => {
      const child = nextChild || getUniqueChild();
      node.childrenWeight++;
      if (node.children) {
        node.children.push(child);
        node.nonuniqueChildren.push(child);
      } else {
        node.children = [child];
        node.nonuniqueChildren = [child];
      }
      nextChild = getUniqueChild();
      if (!nextChild) {
        node.generateChild = null;
        _.assert(node.childrenWeight == node.totalChildrenWeight);
      }
      return child;
    };

    node.totalChildrenWeight = generator.length;
    node.childrenWeight = 0;
  }

  // Value is either the card played or the next game state.
  createNode(value, {type = Node.Type.CHANCE, parent = null}) {
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
      wins: 0,
      losses: 0,
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
    return state.result;
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
