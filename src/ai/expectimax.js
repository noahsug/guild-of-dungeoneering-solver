import GameStateCache from './game-state-cache';
import Node from './node';
import GameStateAccessor from './game-state-accessor';
import Card from './card';
import _ from '../utils/common';

export default class Expectimax {
  constructor({nodeFactory, runUntil = {}, debug = false} = {}) {
    this.nodeFactory = nodeFactory;
    this.debug = debug;
    this.cache_ = new GameStateCache({debug});
    this.runUntil = _.defaults(runUntil, {iteration: Infinity});
    this.accessor_ = new GameStateAccessor();
  }

  setState(gameState) {
    this.initState = gameState;

    //this.nodeFactory.createChildren(this.rootNode);
    //this.rootNode = this.rootNode.children.find((c) => {
    //  if (c.gameState.state.enemyHand[0] != Card.create('HPD/M')) return false;
    //  return c.gameState.state.playerHand.every((card) => {
    //    return card == Card.create('P');
    //  });
    //});
    //this.nodeFactory.createChildren(this.rootNode);
    //this.rootNode = this.rootNode.children[0];
    //
    //this.nodeFactory.createChildren(this.rootNode);
    //this.rootNode = this.rootNode.children[0];

    this.reset();
    return this;
  }

  reset() {
    this.rootNode = this.nodeFactory.createRootNode(this.initState);
    this.iteration = this.runUntil.iteration;
    this.node_ = this.rootNode;
    this.depth_ = 0;
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
      this.depth_--;
    } else {
      this.node_ = this.selectChildNode_();
      this.depth_++;
    }

    this.iteration--;
    //console.log(this.node_.type, this.node_.state, '-',
    //            'W:', this.node_.winRate,
    //            'R:', this.node_.result);
  }

  cacheResult_() {
    if (this.node_.type == Node.Type.CHANCE && this.node_.result != -Infinity) {
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
    if (this.debug) return;
    //if (this.node_.parent.parent && this.node_.parent.parent.parent) {
    //  delete this.node_.children;
    //}
    delete this.node_.children;
  }

  selectChildNode_() {
    if (!this.node_.children) {
      this.nodeFactory.createChildren(this.node_);
      if (this.node_.type != Node.Type.CHANCE) {
        this.maybeRemoveRandomChildren_();
      }
    }
    const child = this.node_.children[this.node_.index];
    this.node_.index++;
    this.initNode_(child);
    return child;
  }

  maybeCutBadMoves_() {
    this.accessor_.setState(this.node_.gameState.state);
    const enemyCard = Card.list[this.accessor_.enemy.hand[0]];
    const goodChildren = [];
    for (let i = 0; i < this.node_.children.length; i++) {
      const child = this.node_.children[i];
      const children = this.nodeFactory.createChildren(child);
      if (children.length == 1 && children[0].result) {
        console.log('has result!', children[0].result);
        if (children[0].result == 1) {
          this.node_.children = [child];
          return;
        }
        continue;
      }
      const playerCard = Card.list[child.gameState.move];
      if (!playerCard.unblockable &&
          (enemyCard.physicalBlock && playerCard.physical) ||
          (enemyCard.magicBlock && playerCard.magic)) {
        console.log('cutting', playerCard.desc, 'vs', enemyCard.desc);
        continue;
      }
      if (enemyCard.unblockable &&
          (playerCard.block ||
           playerCard.blockPhysical ||
           playerCard.blockMagic ||
           playerCard.blockMagicAll ||
           playerCard.blockPhysicalAll ||
           playerCard.blockAll)) {
        console.log('cutting', playerCard.desc, 'vs', enemyCard.desc);
        continue;
      }
      goodChildren.push(child);
    }

    if (goodChildren.length) {
      this.node_.children = goodChildren;
    }

    //this.node_.children = [_.max(this.node_.children, (child) => {
    //  this.nodeFactory.createChildren(child);
    //  if (child.children[0].result) return child.children[0].result * Infinity;
    //  const state = this.accessor_.setState(child.children[0].gameState.state);
    //  return (state.player.health - state.enemy.health) * 100 +
    //      state.player.hand.length * 50 +
    //      -state.enemy.health;
    //})];

    //this.accessor_.setState(this.node_.gameState.state);
    //const enemyCard = Card.list[this.accessor_.enemy.hand[0]];
    //this.node_.children = [_.max(this.node_.children.((child) => {
    //  const playerCard = Card.list[child.gameState.move];
    //  const physicalBlocked = Math.min(enemyCard.physicalBlock,
    //                                   playerCard.physical);
    //  const magicBlocked = Math.min(enemyCard.magicBlock,  playerCard.magic);
    //  const dmgDelt = Math.min(enemyCard.magic, playerCard.magicBlock) +
    //          Math.min(enemyCard.magic, playerCard.magicBlock)
    //
    //  let score = 0;
    //  if (enemyCard.physicalBlock && playerCard.physical &&
    //      !playerCard.unblockable) {
    //    score -= 100 * Math.min(enemyCard.physicalBlock, playerCard.physical);
    //  }
    //  if (enemyCard.magicBlock && playerCard.magic &&
    //      !playerCard.unblockable) {
    //    score -= 100 * Math.min(enemyCard.magicBlock, playerCard.magic);
    //  }
    //  if (enemyCard.healPerDmg || enemyCard.stealIfDmg ||
    //      enemyCard.concealIfDmg || enemyCard.healPerDmg ||
    //      enemyCard.discardIfDmg || enemyCard.physicalRoundIfDmg ||
    //      enemyCard.magicRoundIfDmg) {
    //    if (
    //
    //  }
    //}))];
  }

  maybeRemoveRandomChildren_() {
    if (this.node_.children.length == 1) return;
    this.node_.children = _.shuffle(this.node_.children);
    let maxNumChildren;
    if (this.depth_ > 7) {
      maxNumChildren = 16;
    } else if (this.depth_ > 5) {
      maxNumChildren = 14;
    } else if (this.depth_ > 3) {
      maxNumChildren = 12;
    } else if (this.depth_ > 1) {
      maxNumChildren = 10;
    } else {
      maxNumChildren = 8;
    }
    this.node_.children.length = Math.min(
        this.node_.children.length, maxNumChildren);
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
        this.maybeDisplayChildren_(node);
        return;
      }
    }

    node.index = 0;
    node.winRate = node.type == Node.Type.CHANCE ? 0 : 1;
  }

  maybeDisplayChildren_(node) {
    if (!this.debug) return;
    if (!node.parent.parent ||
        !node.parent.parent.parent) {
      this.nodeFactory.createChildren(node);
    }
    node.cached = this.cache_.getCachedNode(node);
  }
}
