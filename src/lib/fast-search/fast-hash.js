import _ from '../../utils/common';
import Card from '../game-engine/card';

export default class FastHash {
  constructor() {
    this.hashes_ = {};
    const numCards = Card.list.length;
    this.hashes_.playerDeck = this.getHashes_(numCards);
    this.hashes_.playerHand = this.getHashes_(numCards);
    this.hashes_.playerDiscard = this.getHashes_(numCards);
    this.hashes_.playedCard = this.getHashes_(1)[0];
    this.hashes_.enemyCard = this.getHashes_(1)[0];
    this.hashes_.enemyDraws = this.getHashes_(numCards);
    this.hashes_.stats = this.getHashes_(30);
  }

  getHashes_(len) {
    const hashes = new Uint32Array(len);
    window.crypto.getRandomValues(hashes);
    return hashes;
  }

  hash(state, depth) {
    return this.hashCards_(state.player.deck, this.hashes_.playerDeck) +
        this.hashCards_(state.player.hand, this.hashes_.playerHand) +
        this.hashCards_(state.player.discard, this.hashes_.playerDiscard) +
        this.hashStats_(state) +
        this.hashEnemyCards_(depth);
  }

  hashCards_(cards, hashes) {
    let result = 0;
    const len = cards.length;
    for (let i = 0; i < len; i++) {
      result += hashes[cards[i]];
    }
    return result;
  }

  hashEnemyCards_(depth) {
    let result = this.hashes_.enemyCard * this.order.enemyDraws[depth];
    for (let i = 0; i < depth; i++) {
      result += this.hashes_.enemyDraws[this.order.enemyDraws[i]];
    }
    return result;
  }

  hashStats_(state) {
    // TODO: Implement conceal and predictable.
    return state.player.health * this.hashes_.stats[0] +
        state.enemy.health * this.hashes_.stats[1] +
        state.player.magicNextEffect * this.hashes_.stats[2] +
        state.player.physicalNextEffect * this.hashes_.stats[3] +
        state.player.magicRoundEffect * this.hashes_.stats[4] +
        state.player.physicalRoundEffect * this.hashes_.stats[5] +
        state.player.withstandEffect * this.hashes_.stats[11] +
        state.enemy.magicNextEffect * this.hashes_.stats[6] +
        state.enemy.physicalNextEffect * this.hashes_.stats[7] +
        state.enemy.magicRoundEffect * this.hashes_.stats[8] +
        state.enemy.physicalRoundEffect * this.hashes_.stats[9] +
        state.enemy.rum * this.hashes_.stats[10];
  }

  hashMove(hash, playedCard) {
    return hash + this.hashes_.playedCard * (playedCard + 1);
  }
}
