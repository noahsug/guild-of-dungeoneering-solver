import GameStateAccessor from './game-state-accessor';
import _ from '../utils/common';

export default class GameStateCache {
  constructor({debug = false} = {}) {
    this.cache_ = [];
    this.nodeCache_ = [];
    this.playerCardCache_ = {list: [], index: 0};
    this.enemyCardCache_ = {list: [], index: 0};
    this.idGenerationCache_ = {};
    this.accessor_ = new GameStateAccessor();
    this.debug = debug;
  }

  cacheResult(node) {
    this.cache_[this.getId_(node)] = node.result;

    if (this.debug && !this.nodeCache_[this.getId_(node)]) {
      this.nodeCache_[this.getId_(node)] = node;
    }
  }

  getResult(node) {
    const id = this.getId_(node);
    if (!this.cache_[id]) this.cache_[id] = 0;
    return this.cache_[id];
  }

  getCachedNode(node) {
    return this.nodeCache_[this.getId_(node)];
  }

  hasVisitedWithNoResult(node) {
    return this.cache_[this.getId_(node)] === 0;
  }

  getId_(node) {
    if (node.__id === undefined) {
      node.__id = this.hashGameState_(node.gameState.state);
      //this.checkHashFunction_(node);
    }
    return node.__id;
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
    return this.buildHash_(h1, h2, h3, h4, h5, h6, h7);
  }

  hashCards_(cards, cardCache) {
    return cards.reduce((p, c) => {
      if (!cardCache.list.hasOwnProperty(c)) {
        cardCache.list[c] = cardCache.index + 1;
        cardCache.index++;
      }
      const cardId = cardCache.list[c];
      return p + Math.pow(cardId, 5);
    }, 0);
  }

  hashStats_() {
    return this.accessor_.player.health + this.accessor_.enemy.health * 100;
  }

  buildHash_(h1, h2, h3, h4, h5, h6, h7) {
    let cache = this.idGenerationCache_;
    if (!cache.hasOwnProperty(h1)) cache[h1] = {};
    cache = cache[h1];
    if (!cache.hasOwnProperty(h2)) cache[h2] = {};
    cache = cache[h2];
    if (!cache.hasOwnProperty(h3)) cache[h3] = {};
    cache = cache[h3];
    if (!cache.hasOwnProperty(h4)) cache[h4] = {};
    cache = cache[h4];
    if (!cache.hasOwnProperty(h5)) cache[h5] = {};
    cache = cache[h5];
    if (!cache.hasOwnProperty(h6)) cache[h6] = {};
    cache = cache[h6];
    if (!cache.hasOwnProperty(h7)) {
      cache[h7] = this.cache_.length;
      this.cache_.length++;
    }
    return cache[h7];
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
