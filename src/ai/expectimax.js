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
      delete this.node_.children;
      this.node_ = this.node_.parent;
    } else {
      this.node_ = this.selectChildNode_();
    }

    this.iteration--;
    //console.log(this.node_.type, this.node_.state, '-',
    //            'W:', this.node_.winRate,
    //            'P:', this.node_.pruneCutoff,
    //            'R:', this.node_.result);
  }

  cacheResult_() {
    if (this.node_.type == Node.Type.CHANCE && this.node_.result != -Infinity) {
      this.cache_.cacheResult(this.node_);
    }
  }

  updateParentResult_() {
    const parent = this.node_.parent;
    if (!parent) return;
    if (this.node_.type == Node.Type.PLAYER && this.node_.result == 1) {
      parent.result = 1;
      return;
    }

    this.updateParentWinRate_();
    if (parent.index == parent.children.length) {
      parent.result = parent.winRate || -1;
    } else if (parent.winRate < parent.pruneCutoff) {
      //parent.result = -Infinity;
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
    }
    if (node.result) return;

    node.index = 0;
    node.winRate = node.type == Node.Type.CHANCE ? 0 : 1;
    node.pruneCutoff = this.getPruneCutoff_(node);
  }

  getPruneCutoff_(node) {
    if (!node.parent) return 0;
    if (node.type == Node.Type.CHANCE) {
      const req = node.parent.winRate - node.parent.pruneCutoff;
      const max = 1 / node.parent.children.length;
      return req < max ? (max - req) / max : 0;
    }
    return Math.max(node.parent.winRate, node.parent.pruneCutoff);
  }
}
