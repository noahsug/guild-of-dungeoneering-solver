import _ from '../utils/common';

export default class Mcts {
  constructor({selectionStrategy, expansionStrategy, nodeFactory,
               runUntil = {}} = {}) {
    this.selectionStrategy = selectionStrategy;
    this.expansionStrategy = expansionStrategy;
    this.nodeFactory = nodeFactory;
    this.runUntil = _.defaults(runUntil, {iteration: Infinity});
  }

  solve(initialGameState) {
    const rootNode = this.nodeFactory.createRootNode(initialGameState);
    for (let i = 0; i < this.runUntil.iteration; i++) {
      const leaf = this.select_(rootNode);
      if (leaf.result) break;
      const child = this.expand_(leaf);
      const result = this.simulate_(child);
      this.backpropagate_(child, result);
    }
    return rootNode;
  }

  select_(rootNode) {
    let node = rootNode;
    while (node.children) {
      if (node.children.length == 1) {
        node = node.children[0];
      } else {
        node = this.selectionStrategy.selectChild(node.children, rootNode);
      }
    }
    return node;
  }

  expand_(node) {
    node.children = this.nodeFactory.createChildren(node);
    if (node.children.length == 1) return node.children[0];
    return this.expansionStrategy.selectChild(node.children);
  }

  simulate_(node) {
    if (node.result) return node.result;
    return this.nodeFactory.playout(node);
  }

  backpropagate_(node, result) {
    if (node.result < 0) node.parent.losses = Infinity;
    else if (node.result > 0) node.parent.wins = Infinity;
    while (node) {
      result > 0 ? node.wins++ : node.losses++;
      node = node.parent;
    }
  }
}
