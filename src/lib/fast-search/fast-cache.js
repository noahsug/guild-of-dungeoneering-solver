import Card from '../game-engine/card';

export default class FastCache {
  constructor() {
    this.cache_ = {};
    this.hashes_ = {};
    const numCards = Card.list.length;
    this.hashes_.playerDeck = this.getHashes_(numCards);
    this.hashes_.playerHand = this.getHashes_(numCards);
    this.hashes_.playerDiscard = this.getHashes_(numCards);
    this.hashes_.playerCard = this.getHashes_(1)[0];
    this.hashes_.depth = this.getHashes_(1)[0];
    this.hashes_.stats = this.getHashes_(30);
  }

  getHashes_(len) {
    const hashes = new Uint32Array(len);
    window.crypto.getRandomValues(hashes);
    return hashes;
  }

  hash(state) {
    return this.hashCards_(state.player.deck, this.hashes_.playerDeck) +
        this.hashCards_(state.player.hand, this.hashes_.playerHand) +
        this.hashCards_(state.player.discard, this.hashes_.playerDiscard) +
        this.hashStats_(state);
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

  getResult(state, playerCard, depth) {
    if (depth > 198) return 0;
    const hash = state.id +
        this.hashes_.playerCard * playerCard +
        this.hashes_.depth * depth;
    return this.cache_[hash];
  }

  cacheResult(state, playerCard, depth, result) {
    const hash = state.id +
        this.hashes_.playerCard * playerCard +
        this.hashes_.depth * depth;
    this.cache_[hash] = result;
  }
}
