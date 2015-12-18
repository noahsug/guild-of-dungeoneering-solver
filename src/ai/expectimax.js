import GameStateCache from './game-state-cache';
import Node from './node';
import _ from '../utils/common';

export default class Expectimax {
  constructor({nodeFactory, runUntil = {}} = {}) {
    this.nodeFactory = nodeFactory;
    this.cache_ = new GameStateCache();
    this.runUntil = _.defaults(runUntil, {iteration: Infinity});
  }

  setState(initialGameState, {newGame = false}) {
    this.rootNode = newGame ?
        this.nodeFactory.createRootNode(initialGameState) :
        this.nodeFactory.createNode(initialGameState);
    this.reset();
    return this;
  }

  reset() {
    this.iteration = this.runUntil.iteration;
    this.node_ = this.rootNode;
    this.initNode_(this.node_);
  }

  get done() {
    return !!this.rootNode.result || this.iteration <= 0;
  }

  solve() {
    while (!this.done) this.next();
  }

  next() {
    if (this.node_.result) {
      this.cacheResult_();
      this.updateParentResult_();
      this.cleanUpMemory_();
      this.node_ = this.node_.parent;
    } else {
      this.node_ = this.selectChildNode_();
    }

    this.iteration--;
    //console.log(this.node_.type, this.node_.state, '-',
    //            'W:', this.node_.winRate,
    //            'R:', this.node_.result);
  }

  cacheResult_() {
    if (this.node_.type == Node.Type.CHANCE) {
      this.cache_.cacheResult(this.node_);
    }
  }

  updateParentResult_() {
    const parent = this.node_.parent;
    if (this.node_.type == Node.Type.PLAYER && this.node_.result == 1) {
      parent.result = 1;
      return;
    }

    this.updateParentWinRate_();
    if (parent.index == parent.children.length) {
      parent.result = parent.winRate || -1;
    }
  }

  updateParentWinRate_() {
    const parent = this.node_.parent;
    if (this.node_.type == Node.Type.PLAYER) {
      const winRate = this.node_.result < 0 ? 0 : this.node_.result;
      if (winRate > parent.winRate) parent.winRate = winRate;
    } else {
      const wins = parent.children.reduce((p, c) => {
        const winRate = c.result < 0 ? 0 : (c.result || 1);
        return p + winRate;
      }, 0);
      parent.winRate = wins / parent.children.length;
    }
  }

  cleanUpMemory_() {
    if (this.node_.parent.parent && this.node_.parent.parent.parent) {
      delete this.node_.children;
    }
  }

  selectChildNode_() {
    if (!this.node_.children) this.nodeFactory.createChildren(this.node_);
    const child = this.node_.children[this.node_.index];
    this.node_.index++;
    this.initNode_(child);
    return child;
  }

  initNode_(node) {
    if (node.result) return;
    if (node.type == Node.Type.CHANCE) {
      node.result = this.cache_.getResult(node);
      if (node.result) {  // cached
        this.maybeDisplayChildren_(node);
        return;
      }
    }

    node.index = 0;
    node.winRate = node.type == Node.Type.CHANCE ? 0 : 1;
  }

  maybeDisplayChildren_(node) {
    if (!node.parent.parent ||
        !node.parent.parent.parent) {
      this.nodeFactory.createChildren(node);
    }
  }
}
