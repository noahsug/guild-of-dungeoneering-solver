import _ from '../utils/common';
import Node from './node';

export default class Mcts {
  constructor({selectionStrategy, expansionStrategy, nodeFactory,
               runUntil = {}} = {}) {
    this.selectionStrategy = selectionStrategy;
    this.expansionStrategy = expansionStrategy;
    this.nodeFactory = nodeFactory;
    this.runUntil = _.defaults(runUntil, {iteration: Infinity});
  }

  setState(initialGameState, {newGame = false}) {
    this.iteration = this.runUntil.iteration;
    this.done = false;
    this.rootNode = newGame ?
        this.nodeFactory.createRootNode(initialGameState) :
        this.nodeFactory.createNode(initialGameState);
    return this;
  }

  solve() {
    while (!this.done) this.next();
  }

  next() {
    const leaf = this.select_(this.rootNode);
    if (leaf.result) _.fail();
    const child = this.expand_(leaf);
    const result = this.simulate_(child);
    this.backpropagate_(child, result);
    this.done = this.rootNode.result || this.shouldStopOnIteration_();
  }

  shouldStopOnIteration_() {
    this.iteration--;
    return this.iteration <= 0;
  }

  select_(rootNode) {
    let node = rootNode;
    while (node.children) {
      if (node.result) return node;
      if (node.children.length == 1 && !node.generateChild) {
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
    return node.gameState.state.playerHealth > node.gameState.state.enemyHealth;
    //return this.nodeFactory.playout(node);
  }

  backpropagate_(node, result) {
    // Update the best/worst case results if we've reached the end of the game
    // tree.
    let shouldUpdateBestWorst = !!node.result;
    while (node) {
      result > 0 ? node.wins++ : node.losses++;
      if (shouldUpdateBestWorst) {
        shouldUpdateBestWorst = this.updateBestWorst_(node);
      }
      node = node.parent;
    }
  }

  updateBestWorst_(node) {
    //this.debugNode_(node);
    if (node.result) {
      node.bestResult = node.result;
      node.worstResult = node.result;
      node.expectedResult = node.result;
      return true;
    }
    const prevBestResult = node.bestResult || 1;
    const prevWorstResult = node.worstResult || -1;

    if (node.children[0].type == Node.Type.CHANCE) {
      let weight = 0;
      let bestResults = 0;
      let worstResults = 0;
      let expectedResults = 0;
      node.children.forEach(child => {
        if (!child.bestResult) return;
        weight += child.weight;
        bestResults += child.bestResult == -1 ? 0 : child.bestResult *
            child.weight;
        worstResults += child.worstResult == -1 ? 0 : child.worstResult *
            child.weight;
        expectedResults += child.expectedResult == -1 ? 0 :
            child.expectedResult * child.weight;
      });
      const missingWeight = node.totalChildrenWeight - weight;
      node.bestResult =
          (missingWeight + bestResults) / node.totalChildrenWeight || -1;
      node.worstResult = worstResults / node.totalChildrenWeight || -1;
      node.expectedResult = expectedResults / weight || -1;
    }

    else if (node.children[0].type == Node.Type.PLAYER) {
      node.expectedResult = node.bestResult = node.worstResult = -1;
      node.children.forEach(child => {
        if (child.expectedResult > node.expectedResult) {
          node.expectedResult = child.expectedResult;
        }
        if ((child.bestResult || 1) > node.bestResult) {
          node.bestResult = child.bestResult || 1;
        }
        if ((child.worstResult || -1) > node.worstResult) {
          node.worstResult = child.worstResult || -1;
        }
      });
    }

    const epsilon = Number.EPSILON;
    if (_.floatEquals(node.bestResult, node.worstResult, epsilon)) {
      node.result = (node.bestResult + node.worstResult) / 2;
      return true;
    }
    return !_.floatEquals(node.bestResult, prevBestResult, epsilon) ||
        !_.floatEquals(node.worstResult, prevWorstResult, epsilon);
  }

  debugNode_(node) {
    console.log('UPDATE:', node.uid,
                'children:', (node.children || []).length,
                'generating:', !!node.generateChild,
                'weight:', node.weight,
        node.type == Node.Type.PLAYER ? 'P' + node.gameState.move :
        node.type == Node.Type.CHANCE ? 'E' +
            node.gameState.state.enemyHand[0] :
        'ROOT',
        node.result, node.bestResult + '/' + node.worstResult);
    if (node.result) return;

    node.children.forEach(child => {
      if (node.children[0].type == Node.Type.CHANCE) {
        console.log('    C', child.uid, child.weight, '-', child.result,
                    child.bestResult + '/' + child.worstResult);
      } else {
        console.log('    P', child.uid, '-', child.result,
                    child.bestResult + '/' + child.worstResult);
      }
    });
  }
}
