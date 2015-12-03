import _ from '../utils/common';

export default class Mcts {
  constructor({selectionStrategy, expansionStrategy, nodeFactory,
               runUntil = {}} = {}) {
    this.selectionStrategy = selectionStrategy;
    this.expansionStrategy = expansionStrategy;
    this.nodeFactory = nodeFactory;
    this.runUntil = _.defaults(runUntil,
        {iteration: Infinity, hitBottom: 1});
  }

  solveNewGame(initialGameState) {
    return this.solve(initialGameState, {shouldInitialize: true});
  }

  solve(initialGameState, {shouldInitialize = false}) {
    this.iteration = this.runUntil.iteration;
    this.hitBottom = this.runUntil.hitBottom;
    this.rootNode = shouldInitialize ?
        this.nodeFactory.createRootNode(initialGameState) :
        this.nodeFactory.createNode(initialGameState);
    let done = false;
    while (!done) done = this.next();
    return this.rootNode;
  }

  next() {
    const leaf = this.select_(this.rootNode);
    if (leaf.result) return this.shouldStopOnResult_();
    const child = this.expand_(leaf);
    const result = this.simulate_(child);
    this.backpropagate_(child, result);
    if (this.rootNode.result) return true;
    return this.shouldStopOnIteration_();
  }

  shouldStopOnResult_() {
    this.hitBottom--;
    return this.hitBottom <= 0;
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
    //if (!node.id) {
    //  this.id = (this.id || 0) + 1;
    //  node.id = this.id;
    //}
    //console.log('UPDATE:', node.id,
    //            'children:', (node.children || []).length,
    //            'generating:', !!node.generateChild,
    //            'weight:', node.weight,
    //    node.type == 'player' ? 'P' + node.gameState.move :
    //    node.type == 'chance' ? 'E' + node.gameState.state.enemyHand[0] :
    //    'ROOT',
    //    node.result, node.bestResult + '/' + node.worstResult);

    if (node.result) {
      node.bestResult = node.result;
      node.worstResult = node.result;
      node.expectedResult = node.result;
      return true;
    }
    const prevBestResult = node.bestResult || 1;
    const prevWorstResult = node.worstResult || -1;

    if (node.children[0].type == 'chance') {
      let weight = 0;
      let bestResults = 0;
      let worstResults = 0;
      let expectedResults = 0;
      node.children.forEach(child => {
        //if (!child.id) {
        //  this.id = (this.id || 0) + 1;
        //  child.id = this.id;
        //}
        //console.log('    C', child.id, child.weight, '-', child.result,
        //            child.bestResult + '/' + child.worstResult);
        if (!child.bestResult) return;
        weight += child.weight;
        bestResults += child.bestResult == -1 ? 0 : child.bestResult *
            child.weight;
        worstResults += child.worstResult == -1 ? 0 : child.worstResult *
            child.weight;
        expectedResults += child.expectedResult == -1 ? 0 :
            child.expectedResult * child.weight;
        //console.log('     ', weight, bestResults + '/' + worstResults);
      });
      const missingWeight = node.totalChildrenWeight - weight;
      node.bestResult =
          (missingWeight + bestResults) / node.totalChildrenWeight || -1;
      node.worstResult = worstResults / node.totalChildrenWeight || -1;
      node.expectedResult = expectedResults / weight || -1;
      //console.log('    total', node.totalChildrenWeight,
      //            'missing', missingWeight,
      //            node.bestResult + '/' + node.worstResult);
    }

    else if (node.children[0].type == 'player') {
      node.expectedResult = node.bestResult = node.worstResult = -1;
      node.children.forEach(child => {
        //if (!child.id) {
        //  this.id = (this.id || 0) + 1;
        //  child.id = this.id;
        //}

        if (child.expectedResult > node.expectedResult) {
          node.expectedResult = child.expectedResult;
        }
        if ((child.bestResult || 1) > node.bestResult) {
          node.bestResult = child.bestResult || 1;
        }
        if ((child.worstResult || -1) > node.worstResult) {
          node.worstResult = child.worstResult || -1;
        }
        //console.log('    P', child.id, '-', child.result,
        //            child.bestResult + '/' + child.worstResult);
      });
    }

    if (_.floatEquals(node.bestResult, node.worstResult, 0.001)) {
      node.result = (node.bestResult + node.worstResult) / 2;
      return true;
    }
    //console.log('  New B/W:', node.bestResult + '/' + node.worstResult);
    return !_.floatEquals(node.bestResult, prevBestResult, 0.001) ||
        !_.floatEquals(node.worstResult, prevWorstResult, 0.001);
  }
}
