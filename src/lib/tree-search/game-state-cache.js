import GameStateAccessor from '../game-engine/game-state-accessor';
import Card from '../game-engine/card';
import Node from './node';
import _ from '../../utils/common';

export default class GameStateCache {
  constructor() {
    this.cache_ = {};
    this.hintCache_ = {};
    this.nodeCache_ = {};
    this.accessor_ = new GameStateAccessor();

    this.hashes_ = {};
    const numCards = Card.list.length;
    this.hashes_.playerDeck = this.getHashes_(numCards);
    this.hashes_.playerHand = this.getHashes_(numCards);
    this.hashes_.playerDiscardPile = this.getHashes_(numCards);
    this.hashes_.enemyDeck = this.getHashes_(numCards);
    this.hashes_.enemyHand = this.getHashes_(numCards);
    this.hashes_.enemyDiscardPile = this.getHashes_(numCards);
    this.hashes_.stats = this.getHashes_(30);
  }

  getHashes_(len) {
    const hashes = new Uint32Array(len);
    window.crypto.getRandomValues(hashes);
    return hashes;
  }

  hash(node) {
    if (node.__id === undefined) {
      node.__id = this.hashGameState_(node.gameState.state);
      //this.validateHashFunction_(node);
    }
    return node.__id;
  }

  cacheResult(node) {
    this.cache_[this.hash(node)] = node.result;
    //this.cacheHint_(node);
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
    let hash = this.hashCards_(state.playerDeck, this.hashes_.playerDeck) +
        this.hashCards_(state.playerHand, this.hashes_.playerHand) +
        this.hashCards_(state.playerDiscardPile,
                        this.hashes_.playerDiscardPile) +
        this.hashCards_(state.enemyDeck, this.hashes_.enemyDeck) +
        this.hashCards_(state.enemyHand, this.hashes_.enemyHand) +
        this.hashCards_(state.enemyDiscardPile,
                        this.hashes_.enemyDiscardPile) +
        this.hashStats_(state);

    if (state.playerDraw != undefined) {
      const playerCard = state.playerDeck[state.playerDraw];
      const enemyCard = state.enemyDeck[state.enemyDraw];
      hash += this.hashes_.playerHand[playerCard] -
          this.hashes_.playerDeck[playerCard] +
          this.hashes_.enemyHand[enemyCard] -
          this.hashes_.enemyDeck[enemyCard];
    }
    return hash;
  }

  hashCards_(cards, hashes) {
    let result = 0;
    const len = cards.length;
    for (let i = 0; i < len; i++) {
      result += hashes[cards[i]];
    }
    return result;
  }

  hashStats_(state) {
    // TODO: Implement conceal and predictable.
    return state.playerHealth * this.hashes_.stats[0] +
        state.enemyHealth * this.hashes_.stats[1] +
        (state.playerMagicNextEffect || 0) * this.hashes_.stats[2] +
        (state.playerPhysicalNextEffect || 0) * this.hashes_.stats[3] +
        (state.playerMagicRoundEffect || 0) * this.hashes_.stats[4] +
        (state.playerPhysicalRoundEffect || 0) * this.hashes_.stats[5] +
        (state.playerWithstandEffect || 0) * this.hashes_.stats[11] +
        (state.enemyMagicNextEffect || 0) * this.hashes_.stats[6] +
        (state.enemyMagicNextEffect || 0) * this.hashes_.stats[7] +
        (state.enemyMagicRoundEffect || 0) * this.hashes_.stats[8] +
        (state.enemyPhysicalRoundEffect || 0) * this.hashes_.stats[9] +
        (state.enemyRum || 0) * this.hashes_.stats[10];
  }

  validateHashFunction_(node) {
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
