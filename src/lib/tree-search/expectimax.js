import GameStateCache from './game-state-cache';
import Node from './node';
import Card from '../game-engine/card';
import _ from '../../utils/common';

export default class Expectimax {
  constructor(nodeFactory) {
    this.nodeFactory = nodeFactory;
    this.cache_ = new GameStateCache();
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
    this.depth_ = 0;
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
      this.depth_--;
    } else {
      //if (this.depth_ > 5) {
      //  const state = this.node_.gameState.state;
      //  this.node_.result = state.playerHealth > state.enemyHealth || -1;
      //  return;
      //}
      const child = this.selectChildNode_();
      if (this.node_ != child) {
        this.node_ = child;
        this.depth_++;
      }
    }
  }

  cacheResult_() {
    if (this.node_.result != -Infinity) {
      this.cache_.cacheResult(this.node_);
    }

    //if (!this.node_.children) return;
    //let worst = {result: 1};
    //let best = {result: 0};
    //let total = 0;
    //let count = 0;
    //this.node_.children.forEach(c => {
    //  if (c.children &&
    //      (c.children[0].gameState.state.playerHealth <= 0 ||
    //       c.children[0].gameState.state.enemyHealth <= 0)) {
    //    return;
    //  }
    //  if (c.result < worst.result) worst = c;
    //  if (c.result > best.result) best = c;
    //  total += c.result < 0 ? 0 : c.result;
    //  count++;
    //});
    //if (!count || this.depth_ > 8) return;
    //const worstResult = worst.result < 0 ? 0 : worst.result;
    //const bestResult = best.result < 0 ? 0 : best.result;
    //const avgResult = total / count;
    //if (bestResult - worstResult < .25) return;
    //
    //const enemyCard = Card.list[this.node_.gameState.state.enemyHand[0]].desc;
    //if (!window.hints[enemyCard]) window.hints[enemyCard] = {};
    //const hint = window.hints[enemyCard];
    //
    //if (bestResult > avgResult + .25) {
    //  const playerCard = Card.list[best.gameState.move].desc;
    //  if (!hint[playerCard]) hint[playerCard] = 0;
    //  hint[playerCard] += (bestResult - avgResult) /
    //      (this.depth_ * this.depth_ * this.depth_);
    //}
    //if (worstResult < avgResult - .25) {
    //  const playerCard = Card.list[worst.gameState.move].desc;
    //  if (!hint[playerCard]) hint[playerCard] = 0;
    //  hint[playerCard] -= (avgResult - worstResult) /
    //      (this.depth_ * this.depth_ * this.depth_);
    //}

    //if (this.node_.children) {
    //  const wins = _.count(this.node_.children, c => {
    //    if (c.children &&
    //        (c.children[0].gameState.state.playerHealth <= 0 ||
    //         c.children[0].gameState.state.enemyHealth <= 0)) {
    //      return false;
    //    }
    //    return c.result > .8;
    //  });
    //  const losses = _.count(this.node_.children, c => {
    //    if (c.children &&
    //        (c.children[0].gameState.state.playerHealth <= 0 ||
    //         c.children[0].gameState.state.enemyHealth <= 0)) {
    //      return false;
    //    }
    //    return c.result == -1 || (c.result > 0 && c.result < .2);
    //  });
    //  if (!wins || !losses) return;
    //  this.node_.children.forEach((c) => {
    //    if (c.children &&
    //        (c.children[0].gameState.state.playerHealth <= 0 ||
    //         c.children[0].gameState.state.enemyHealth <= 0)) {
    //      return;
    //    }
    //
    //    const loss = c.result == -1 || (c.result > 0 && c.result < .2);
    //    const win = c.result > .8;
    //    const enemyCard = c.gameState.state.enemyHand[0];
    //    const playerCard = c.gameState.move;
    //    const hash = Card.list[playerCard].desc + ' - ' +
    //        Card.list[enemyCard].desc;
    //    if (!window.winners[hash]) window.winners[hash] = {
    //      wins: 0, losses: 0, meh: 0,
    //    };
    //    if (win) window.winners[hash].wins++;
    //    else if (loss) window.winners[hash].losses++;
    //    else window.winners[hash].meh++;
    //  });
    //}
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

      //if (this.depth_ > 8) {
      //  const len = this.node_.children.length;
      //  if (this.node_.type == Node.Type.CHANCE) {
      //    if (len > 1) {
      //    }
      //  } else if (len > 3) {
      //  }
      //}
      //if (this.depth_ > 8 &&  && len > 5) {
      //  this.node_.children = _.sample(this.node_.children, 5);
      //} else if (this.depth_ > 8 && this.node_.type == Node.Type.PLAYER && len > 1)
      //      return;

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
