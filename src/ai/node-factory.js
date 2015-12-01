import _ from '../utils/common';
import Node from './node';

export default class NodeFactory {
  constructor(simulator) {
    this.simulator = simulator;
    this.visited_ = {};
  }

  createRootNode(gameState) {
    return new Node({state: gameState}, 'root');
  }

  createChildren(node) {
    if (node.type == 'player') {
      const generator = this.simulator.getStateGenerator(
          node.gameState.state, node.gameState.move);
      this.setChildGenerator_(node, generator);
      node.generateChild();
    }

    else if (node.type == 'root') {
      const generator = this.simulator.getInitialStateGenerator(
          node.gameState.state);
      this.setChildGenerator_(node, generator);
      node.generateChild();
    }

    else if (node.type == 'chance') {
      // Simulator is responsible for removing duplicates.
      const moves = this.simulator.getMoves(node.gameState.state);
      node.children = moves.map(move => {
        return this.createNode(move, {type: 'player', parent: node});
      });
    }

    return node.children;
  }

  // Sets node.generateChild method. This method is set to null when there are
  // no more children to generate.
  setChildGenerator_(node, generator) {
    const cache = {};
    const options = {type: 'chance', parent: node};
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
      if (!nextChild) node.generateChild = null;
      return child;
    };

    node.totalChildrenWeight = generator.length;
    node.childrenWeight = 0;
  }

  // Value is either the card played or the next game state.
  createNode(value, {type = 'chance', parent = null}) {
    let node;
    if (type == 'chance') {
      node = new Node({state: value}, type);
    } else {
      node = new Node({state: parent.gameState.state, move: value}, type);
    }
    const result = this.simulator.getResult(node.gameState.state);
    if (result) node.result = result;
    node.parent = parent;
    return node;
  }

  playout(node) {
    let result;
    const state = this.simulator.cloneState(node.gameState.state);
    if (node.type == 'player') {
      result = this.simulator.play(state, node.gameState.move);
    }
    while (!result) {
      const moves = this.simulator.getMoves(state);
      result = this.simulator.play(state, _.sample(moves));
    }
    return result;
  }
}
