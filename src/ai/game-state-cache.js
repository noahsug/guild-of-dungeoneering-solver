import GameStateAccessor from './game-state-accessor';
import _ from '../utils/common';

export default class GameStateCache {
  constructor({debug = false} = {}) {
    this.cache_ = [];
    this.nodeCache_ = [];
    this.playerCardCache_ = {list: [], index: 0};
    this.enemyCardCache_ = {list: [], index: 0};
    this.accessor_ = new GameStateAccessor();
    this.debug = debug;
  }

  hash(node) {
    if (node.__id === undefined) {
      node.__id = this.hashGameState_(node.gameState.state);
      //this.checkHashFunction_(node);
    }
    return node.__id;
  }

  cacheResult(node) {
    this.cache_[this.hash(node)] = node.result;
    //if (this.debug && !this.nodeCache_[this.hash(node)]) {
    //  this.nodeCache_[this.hash(node)] = node;
    //}
  }

  getResult(node) {
    return this.cache_[this.hash(node)];
  }

  getCachedNode(node) {
    return this.nodeCache_[this.hash(node)];
  }

  markAsVisited(node) {
    const id = this.hash(node);
    if (!this.cache_[id]) this.cache_[id] = 0;
  }

  hasVisitedWithNoResult(node) {
    return this.cache_[this.hash(node)] === 0;
  }

  hashGameState_(state) {
    this.accessor_.setState(state);
    const {player, enemy} = this.accessor_;
    const h1 = this.hashCards_(player.deck, this.playerCardCache_);
    const h2 = this.hashCards_(player.hand, this.playerCardCache_);
    const h3 = this.hashCards_(player.discardPile, this.playerCardCache_);
    const h4 = this.hashCards_(enemy.deck, this.enemyCardCache_);
    const h5 = this.hashCards_(enemy.hand, this.enemyCardCache_);
    const h6 = this.hashCards_(enemy.discardPile, this.enemyCardCache_);
    const h7 = this.hashStats_();
    const hash = this.buildHash_(h1, h2, h3, h4, h5, h6, h7);
    return hash;
  }

  hashCards_(cards, cardCache) {
    let result = 0;
    const len = cards.length;
    for (let i = 0; i < len; i++) {
      let cardId = cardCache.list[cards[i]];
      if (!cardId) {
        cardId = ++cardCache.index;
        cardCache.list[cards[i]] = cardId;
      }
      result += Math.pow(cardId, 5);
    }
    return result;
  }

  hashStats_() {
    return this.accessor_.player.health + this.accessor_.enemy.health * 100;
  }

  buildHash_(h1, h2, h3, h4, h5, h6, h7) {
    return '' + h1 + h2 + h3 + h4 + h5 + h6 + h7;
  }

  checkHashFunction_(node) {
    const {player, enemy} = this.accessor_;
    const clone = {
      v1: player.deck.sort(),
      v2: player.hand.sort(),
      v3: player.discardPile.sort(),
      v4: enemy.deck.sort(),
      v5: enemy.hand.sort(),
      v6: enemy.discardPile.sort(),
      v7: enemy.health,
      v8: player.health,
    };
    const testId = JSON.stringify(clone);
    if (!this.testCache_) this.testCache_ = {};
    if (this.testCache_[node.__id] != this.testCache_[testId]) {
      console.log(node, this.testCache_[node.__id], this.testCache_[testId]);
      _.fail();
    }
    this.testCache_[node.__id] = node;
    this.testCache_[testId] = node;
  }
}
