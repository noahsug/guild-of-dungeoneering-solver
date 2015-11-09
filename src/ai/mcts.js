import _ from 'underscore';
import NodeFactory from './node-factory';

export default class Mcts {
  constructor() {
    this.selectionStrategy = 5;
    this.expansionStrategy = 5;
    this.runUntil = {
      iteration: 1,
    };

    this.simulator = 1;
    this.nodeFactory = new NodeFactory(this.simulator);
  }

  solve(initialGameState) {
    const rootNode = this.nodeFactory.createRootNode(initialGameState);
    for (this.iteration_ = 0; this.iteration_ < this.runUntil.iteration;
         this.iteration++) {
      const leaf = this.select_(rootNode);
      if (leaf.result) break;
      const child = this.expand_(leaf);
      const result = this.simulate_(child);
      this.backpropagate_(child, result);
    }
    return _.max(rootNode.children, (n) => n.wins + n.losses);
  }

  select_(node) {
    while (node.children) {
      node = this.selectionStrategy.selectChild(node.children);
    }
    return node;
  }

  expand_(node) {
    this.nodeFactory.createChildren(node);
    if (node.children.length == 1) return node.children[0];
    return this.expansionStrategy.selectChild(node.children);
  }

  simulate_(node) {
    let gameState;
    if (node.type == 'chance') {
      gameState = node.state;
    } else {
      gameState = _.clone(node.gameState.state);
      this.simulator.play(gameState, node.gameState.move);
    }
    let result = this.simulator.getResult(gameState);
    while (result) {
      const moves = this.simulator.getMoves(gameState);
      this.simulator.play(gameState, _.sample(moves));
      result = this.simulator.getResult(gameState);
    }
    return result;
  }

  backpropagate_(node, result) {
    while (node) {
      result > 0 ? node.wins++ : node.losses++;
      node = node.parent;
    }
  }
}
