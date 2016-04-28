import GameStateCache from './game-state-cache';
import Node from './node';
import Card from '../game-engine/card';
import _ from '../../utils/common';

const CHANCE = Node.Type.CHANCE;
const PLAYER = Node.Type.PLAYER;
const ROOT = Node.Type.ROOT;

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

    if (this.node_.type == ROOT) {
      this.nodeFactory.rootCreateChildren(this.node_);
    } else {
      this.node_.parent = {
        children: [this.node_],
      };
      this.node_ = this.node_.parent;
    }

    this.node_.winRate = 1;
    this.node_.index = 0;
    this.node_.pruneCutoff = 0;
    this.node_.wins = this.node_.children.length;
    //this.depth_ = 0;
  }

  get done() {
    return !!this.rootNode.result;
  }

  solve(iterations = 20000000) {
    let chanceNode;
    for (let i = 0; i < iterations; i++) {
      // Player
      if (this.node_.result) {
        if (this.node_ === this.rootNode) return this.rootNode;
        chanceNode = this.node_.parent;
        // Update parent result.
        if (this.node_.result == 1) {
          chanceNode.result = 1;
        } else {
          // Update parent win rate.
          if (this.node_.result > chanceNode.winRate) {
            chanceNode.winRate = this.node_.result;
          }
          // FIXME don't do this check here.
          if (chanceNode.index == chanceNode.children.length) {
            chanceNode.result = chanceNode.winRate || -1;
          }
        }
      } else {
        // Select child node.
        if (!this.node_.children) {
          this.nodeFactory.playerCreateChildren(this.node_);
          this.node_.wins = this.node_.children.length;

          // Check children for cutoffs.
          for (let i = 0; i < this.node_.children.length; i++) {
            const child = this.node_.children[i];
            const index = this.node_.index;
            child.result = child.result || this.cache_.getResult(child);
            if (child.result) {
              this.node_.index = index + 1;
              // Update win rate.
              const winRate = child.result == -1 ? 0 : child.result;
              this.node_.wins -= 1 - winRate;
              this.node_.winRate = this.node_.wins / this.node_.children.length;

              // Update result.
              if (this.node_.index == this.node_.children.length) {
                this.node_.result = this.node_.winRate || -1;
                break;
              } else if (this.node_.winRate < this.node_.pruneCutoff) {
                this.node_.result = -Infinity;
                break;
              }

              this.node_.children[i] = this.node_.children[index];
              this.node_.children[index] = child;
            } else if (this.cache_.hasVisitedWithNoResult(child)) {
              if (this.node_.children.length == 1) {
                this.node_.result = -Infinity;
                break;
              }
              this.node_.children[i] =
                  this.node_.children[this.node_.children.length - 1];
              this.node_.children.length--;
              i--;
              this.node_.wins--;
              this.node_.winRate = this.node_.wins / this.node_.children.length;
              if (this.node_.children.length == index) {
                this.node_.result = this.node_.winRate || -1;
                break;
              }
            }
          }
          if (this.node_.result) continue;
        }

        chanceNode = this.node_.children[this.node_.index];
        this.node_.index++;
        // Init chance ndoe.
        chanceNode.result = this.cache_.getResult(chanceNode);
        if (!chanceNode.result) {
          chanceNode.winRate = -Infinity;
          this.cache_.markAsVisited(chanceNode);
          chanceNode.index = 0;
          // Get prune cutoff.
          const req = this.node_.winRate - this.node_.pruneCutoff;
          const max = 1 / this.node_.children.length;
          chanceNode.pruneCutoff = req < max ? 1 - req / max : 0;
        }
      }

      // Chance
      if (chanceNode.result) {
        if (chanceNode === this.rootNode) return this.rootNode;
        // Cache result
        if (chanceNode.result == -Infinity) {
          this.cache_.markAsUnvisited(chanceNode);
        } else {
          this.cache_.cacheResult(chanceNode);
        }
        delete chanceNode.children;
        this.node_ = chanceNode.parent;

        // Update win rate.
        const winRate = chanceNode.result == -1 ? 0 : chanceNode.result;
        this.node_.wins -= 1 - winRate;
        this.node_.winRate = this.node_.wins / this.node_.children.length;

        // Update result.
        if (this.node_.index == this.node_.children.length) {
          this.node_.result = this.node_.winRate || -1;
        } else if (this.node_.winRate < this.node_.pruneCutoff) {
          this.node_.result = -Infinity;
        }
      } else {
        // Select child node
        if (!chanceNode.children) {
          this.nodeFactory.chanceCreateChildren(chanceNode);
          chanceNode.wins = chanceNode.children.length;
        }
        this.node_ = chanceNode.children[chanceNode.index++];

        // Init node
        this.node_.winRate = 1;
        this.node_.index = 0;
        this.node_.pruneCutoff = Math.max(chanceNode.winRate,
                                          chanceNode.pruneCutoff);
      }

      //this.next();
      //if (this.rootNode.result) break;
    }
    return this.rootNode;
  }

  next() {
    if (this.node_.result) {
      this.updateParentResult_(this.node_);
      if (this.node_.type == CHANCE) {
        this.cacheResult_();
        delete this.node_.children;
      }
      this.node_ = this.node_.parent;
      //this.depth_--;
    } else {
      this.node_ = this.selectChildNode_();
      //if (this.node_ != child) {
      //  this.node_ = child;
      //  this.depth_++;
      //}
    }
  }

  cacheResult_() {
    if (this.node_.result == -Infinity) {
      this.cache_.markAsUnvisited(this.node_);
    } else {
      this.cache_.cacheResult(this.node_);
    }
  }

  updateParentResult_(node) {
    const isChance = node.type == CHANCE;
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
    if (node.type == PLAYER) {
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
      this.checkChildrenForCutoffs_();
      if (this.node_.result) return this.node_;
    }

    const child = this.node_.children[this.node_.index];
    this.node_.index++;
    this.initNode_(child);
    return child;
  }

  // Look ahead at each child to see if we can prune early.
  checkChildrenForCutoffs_() {
    if (this.node_.type == CHANCE) {
      // TODO: Check player move hints?
      return;
    }
    for (let i = 0; i < this.node_.children.length; i++) {
      const child = this.node_.children[i];
      const index = this.node_.index;
      child.result = child.result || this.cache_.getResult(child);
      if (child.result) {
        this.node_.index = index + 1;
        this.updateParentResult_(child);
        if (this.node_.result) return;
        this.node_.children[i] = this.node_.children[index];
        this.node_.children[index] = child;
      } else if (this.cache_.hasVisitedWithNoResult(child)) {
        if (this.node_.children.length == 1) {
          this.node_.result = -Infinity;
          return;
        }
        this.node_.children[i] =
            this.node_.children[this.node_.children.length - 1];
        this.node_.children.length--;
        i--;
        this.node_.wins--;
        this.node_.winRate = this.node_.wins / this.node_.children.length;
        if (this.node_.children.length == index) {
          this.node_.result = this.node_.winRate || -1;
          return;
        }
      }
    }
  }

  initNode_(node) {
    if (node.type == Node.Type.CHANCE) {
      // We know node doesn't already have a result because of the
      // checkChildrenForCutoffs() function.
      node.result = this.cache_.getResult(node);
      if (node.result) return;
      node.winRate = -Infinity;
      this.cache_.markAsVisited(node);
    } else {
      node.winRate = 1;
    }
    node.index = 0;
    node.pruneCutoff = this.getPruneCutoff_(node);
  }

  getPruneCutoff_(node) {
    if (node.type == CHANCE) {
      const req = node.parent.winRate - node.parent.pruneCutoff;
      const max = 1 / node.parent.children.length;
      return req < max ? 1 - req / max : 0;
    }
    return Math.max(node.parent.winRate, node.parent.pruneCutoff);
  }
}
