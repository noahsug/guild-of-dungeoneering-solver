import GameStateCache from './game-state-cache';
import Node from './node';
import GameStateAccessor from '../game-engine/game-state-accessor';
import Card from '../game-engine/card';
import _ from '../../utils/common';

export default class Expectimax {
  constructor(nodeFactory) {
    this.nodeFactory = nodeFactory;
    this.cache_ = new GameStateCache();
    this.accessor_ = new GameStateAccessor();
  }

  /**
   * @param {!Object} state Board state of a root or chance node.
   */
  setState(state) {
    this.initState = state;
    this.reset();
    return this;
  }

  reset() {
    this.rootNode = this.nodeFactory.createRootNode(this.initState);
    this.node_ = this.rootNode;
    this.node_.winRate = this.node_.type == Node.Type.CHANCE ? -Infinity : 1;
    this.node_.pruneCutoff = this.node_.index = 0;
  }

  get done() {
    return !!this.rootNode.result;
  }

  solve() {
    while (!this.done) this.next();
    return this.rootNode;
  }

  next() {
    if (this.node_.result) {
      this.updateParentResult_(this.node_);
      if (this.node_.type == Node.Type.CHANCE) {
        this.cacheResult_();
        delete this.node_.children;
      }
      this.node_ = this.node_.parent;
    } else {
      this.node_ = this.selectChildNode_();
    }
  }

  cacheResult_() {
    if (this.node_.result != -Infinity) {
      this.cache_.cacheResult(this.node_);
    }
  }

  updateParentResult_(node) {
    const isChance = node.type == Node.Type.CHANCE;
    const parent = node.parent;
    if (!isChance && node.result == 1) {
      parent.result = 1;
      return;
    }

    this.updateParentWinRate_(node);
    if (parent.index == parent.children.length) {
      parent.result = parent.winRate || -1;
    } else if (parent.winRate < parent.pruneCutoff && isChance) {
      parent.result = -Infinity;
    }
  }

  updateParentWinRate_(node) {
    const parent = node.parent;
    if (node.type == Node.Type.PLAYER) {
      if (node.result > parent.winRate) {
        parent.winRate = node.result;
      }
    } else {
      const winRate = node.result == -1 ? 0 : node.result;
      parent.wins -= 1 - winRate;
      parent.winRate = parent.wins / parent.children.length;
    }
  }

  selectChildNode_() {
    if (!this.node_.children) {
      this.nodeFactory.createChildren(this.node_);
      this.node_.wins = this.node_.children.length;
      this.processFinishedChildren_();
      if (this.node_.result) return this.node_;
    }

    const child = this.node_.children[this.node_.index];
    this.node_.index++;
    this.initNode_(child);
    return child;
  }

  // Look ahead at each child to see if we can prune early.
  processFinishedChildren_() {
    if (this.node_.type == Node.Type.CHANCE) {
      // TODO: Check hints?
      return;
    }
    const len = this.node_.children.length;
    for (let i = 0; i < len; i++) {
      const child = this.node_.children[i];
      child.result = child.result || this.cache_.getResult(child);
      if (child.result) {
        this.node_.index++;
        this.updateParentResult_(child);
        if (this.node_.result) return;
        this.node_.children[i] = this.node_.children[this.node_.index - 1];
        this.node_.children[this.node_.index - 1] = child;
      }
    }
  }

  initNode_(node) {
    if (node.result) return;
    if (node.type == Node.Type.CHANCE) {
      if (this.cache_.hasVisitedWithNoResult(node)) {
        // There's a loop!
        node.result = -Infinity;
        return;
      }
      node.result = this.cache_.getResult(node);
      if (node.result) {  // cached
        return;
      }
      node.winRate = -Infinity;
    } else {
      node.winRate = 1;
    }
    node.pruneCutoff = this.getPruneCutoff_(node);
    node.index = 0;
  }

  getPruneCutoff_(node) {
    if (node.type == Node.Type.CHANCE) {
      const req = node.parent.winRate - node.parent.pruneCutoff;
      const max = 1 / node.parent.children.length;
      return req < max ? 1 - req / max : 0;
    }
    return Math.max(node.parent.winRate, node.parent.pruneCutoff);
  }
}
