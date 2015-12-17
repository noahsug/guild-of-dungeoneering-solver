import _ from '../utils/common';
import Node from './node';

export default class Expectimax {
  constructor({nodeFactory, runUntil = {}} = {}) {
    this.nodeFactory = nodeFactory;
    this.runUntil = _.defaults(runUntil, {iteration: Infinity});
  }

  setState(initialGameState, {newGame = false}) {
    this.iteration = this.runUntil.iteration;
    this.rootNode = newGame ?
        this.nodeFactory.createRootNode(initialGameState) :
        this.nodeFactory.createNode(initialGameState);
    this.reset();
    return this;
  }

  reset() {
    this.node_ = this.rootNode;
    this.initNode_(this.node_);
  }

  solve() {
    while (!this.rootNode.result) this.next();
  }

  next() {
    if (this.node_.result) {
      this.updateParentResult_();
      this.node_ = this.node_.parent;
    } else {
      this.node_ = this.selectChildNode_();
    }
    //console.log(this.node_.type, this.node_.state, '-',
    //            'W:', this.node_.winRate,
    //            'P:', this.node_.pruneCutoff,
    //            'R:', this.node_.result);
  }

  updateParentResult_() {
    const parent = this.node_.parent;
    if (!parent) return;
    if (this.node_.type == Node.Type.PLAYER && this.node_.result == 1) {
      parent.result = 1;
    } else {
      this.updateParentWinRate_();
      if (parent.index == parent.children.length) {
        parent.result = parent.winRate || -1;
      } else if (parent.winRate < parent.pruneCutoff) {
        parent.result = -Infinity;
      }
    }
    delete this.node_.children;
  }

  updateParentWinRate_() {
    const parent = this.node_.parent;
    if (this.node_.type == Node.Type.PLAYER) {
      if (this.node_.result > parent.winRate) {
        parent.winRate = this.node_.result;
      }
    } else {
      const result = this.node_.result == -1 ? 0 : 1;
      parent.winRate -= (1 - result) / parent.children.length;
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
