import GameStateAccessor from './game-state-accessor';
import Card from './card';
import Node from './node';
import _ from '../utils/common';

export default class GameStateCache {
  constructor({debug = false} = {}) {
    this.cache_ = {};
    this.hintCache_ = {};
    this.nodeCache_ = {};
    this.accessor_ = new GameStateAccessor();
    this.debug = debug;

    this.hashes_ = {};
    const numCards = Card.list.length;
    this.hashes_.playerDeck = this.getHashes_(numCards);
    this.hashes_.playerHand = this.getHashes_(numCards);
    this.hashes_.playerDiscardPile = this.getHashes_(numCards);
    this.hashes_.enemyDeck = this.getHashes_(numCards);
    this.hashes_.enemyHand = this.getHashes_(numCards);
    this.hashes_.enemyDiscardPile = this.getHashes_(numCards);
    this.hashes_.stats = this.getHashes_(2);
  }

  static get instance() {
    if (!this.instance_) this.instance_ = new GameStateCache();
    return this.instance_;
  }

  getHashes_(len) {
    const hashes = new Uint32Array(len);
    window.crypto.getRandomValues(hashes);
    return hashes;
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
    //this.cacheHint_(node);
    //if (this.debug && !this.nodeCache_[this.hash(node)]) {
    //  this.nodeCache_[this.hash(node)] = node;
    //}
  }

  cacheHint_(node) {
    const parent = node.parent;
    if (parent.type == Node.Type.ROOT) return;
    this.accessor_.enemy.state = parent.gameState.state;
    const hash = parent.gameState.move +
            1000 * this.accessor_.enemy.hand[0];
    if (!this.hintCache_[hash]) {
      this.hintCache_[hash] = {count: 0, results: 0};
    }
    this.hintCache_[hash].count++;
    this.hintCache_[hash].results += node.result;
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
    return this.hashCards_(player.deck, this.hashes_.playerDeck) +
        this.hashCards_(player.hand, this.hashes_.playerHand) +
        this.hashCards_(player.discardPile,
                        this.hashes_.playerDiscardPile) +
        this.hashCards_(enemy.deck, this.hashes_.enemyDeck) +
        this.hashCards_(enemy.hand, this.hashes_.enemyHand) +
        this.hashCards_(enemy.discardPile,
                        this.hashes_.enemyDiscardPile) +
        this.hashStats_();
  }

  hashCards_(cards, hashes) {
    let result = 0;
    const len = cards.length;
    for (let i = 0; i < len; i++) {
      result += hashes[cards[i]];
      //let cardId = cardCache.list[cards[i]];
      //if (!cardId) {
      //  cardId = ++cardCache.index;
      //  cardCache.list[cards[i]] = cardId;
      //}
      //result += Math.pow(cardId, 5);
    }
    return result;
  }

  hashStats_() {
    return this.accessor_.player.health * this.hashes_.stats[0] +
        this.accessor_.enemy.health * this.hashes_.stats[1];
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
