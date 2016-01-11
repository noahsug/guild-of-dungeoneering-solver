import _ from '../utils/common';

export default class GameStateAccessor {
  constructor() {
    this.player = new Accessor('player');
    this.enemy = new Accessor('enemy');
    this.player.enemy = this.enemy;
    this.enemy.enemy = this.player;
  }

  setState(state) {
    this.state = this.player.state = this.enemy.state = state;
    return this;
  }

  get result() {
    if (this.player.dead) return -1;
    if (this.enemy.dead) return 1;
    return 0;
  }

  get initialGameState() {
    return this.player.hand.length == 0;
  }

  access() {
    return [this.player, this.enemy];
  }

  clone() {
    const dest = {};
    this.copyInto(dest);
    return dest;
  }

  copyInto(dest) {
    dest.playerHealth = this.state.playerHealth;
    dest.playerDeck = this.state.playerDeck.slice();
    dest.playerHand = this.state.playerHand.slice();
    dest.playerDiscard = this.state.playerDiscard.slice();
    dest.playerDiscardEffect = this.state.playerDiscardEffect;
    dest.playerDrawEffect = this.state.playerDrawEffect;
    dest.playerCycleEffect = this.state.playerCycleEffect;
    dest.playerMagicNextEffect = this.state.playerMagicNextEffect;
    dest.playerPhysicalNextEffect = this.state.playerPhysicalNextEffect;
    dest.playerMagicRoundEffect = this.state.playerMagicRoundEffect;
    dest.playerPhysicalRoundEffect = this.state.playerPhysicalRoundEffect;

    dest.enemyHealth = this.state.enemyHealth;
    dest.enemyDeck = this.state.enemyDeck.slice();
    dest.enemyHand = this.state.enemyHand.slice();
    dest.enemyDiscard = this.state.enemyDiscard.slice();
    dest.enemyStealEffect = this.state.enemyStealEffect;
    dest.enemyConcealEffect = this.state.enemyConcealEffect;
    dest.enemyMagicNextEffect = this.state.enemyMagicNextEffect;
    dest.enemyPhysicalNextEffect = this.state.enemyPhysicalNextEffect;
    dest.enemyMagicRoundEffect = this.state.enemyMagicRoundEffect;
    dest.enemyPhysicalRoundEffect = this.state.enemyPhysicalRoundEffect;
    dest.enemyPredictable = this.state.enemyPredictable;
    dest.enemyRum = this.state.enemyRum;
  }

  static get instance() {
    if (!this.instance_) this.instance_ = new GameStateAccessor();
    return this.instance_;
  }

  static copyInto(dest, source) {
    this.instance.setState(source).copyInto(dest);
  }

  static clone(state) {
    return this.instance.setState(state).clone();
  }

  static access(state) {
    return this.instance.setState(state).access();
  }

  static isInitialGameState(state) {
    return this.instance.setState(state).initialGameState;
  }

  static create(state) {
    return _.defaults(state, {
      playerHealth: 5,
      playerDeck: [],
      playerHand: [],
      playerDiscard: [],
      enemyHealth: 5,
      enemyDeck: [],
      enemyHand: [],
      enemyDiscard: [],
    });
  }
}

class Accessor {
  constructor(type) {
    this.type = type;
    this.state = null;
  }

  get deck() {
    return this.state[this.type + 'Deck'];
  }
  set deck(cards) {
    this.state[this.type + 'Deck'] = cards;
  }

  get hand() {
    return this.state[this.type + 'Hand'];
  }
  set hand(hand) {
    this.state[this.type + 'Hand'] = hand;
  }

  get discardPile() {
    return this.state[this.type + 'Discard'];
  }
  set discardPile(cards) {
    this.state[this.type + 'Discard'] = cards;
  }

  get health() {
    return this.state[this.type + 'Health'];
  }
  set health(health) {
    this.state[this.type + 'Health'] = health;
  }

  get dead() {
    return this.health <= 0;
  }

  draw(index) {
    this.prepDraw();
    this.hand.push(this.deck[index]);
    return this.deck.splice(index, 1)[0];
  }

  drawAll() {
    const originalHandLen = this.hand.length;
    if (!originalHandLen) {
      const temp = this.hand;
      this.hand = this.deck;
      this.deck = temp;
      return;
    }
    const originalDeckLen = this.deck.length;
    this.hand.length = originalHandLen + originalDeckLen;
    for (let i = 0; i < originalDeckLen; i++) {
      this.hand[originalHandLen + i] = this.deck[i];
    }
    this.deck = [];
  }

  // Moves discard pile to deck if deck is empty.
  prepDraw() {
    if (this.deck.length == 0) {
      const temp = this.deck;
      this.deck = this.discardPile;
      this.discardPile = temp;
    }
  }

  discard(index) {
    this.discardPile.push(this.hand[index]);
    return this.hand.splice(index, 1)[0];
  }

  discardAll() {
    const originalDiscardPileLen = this.discardPile.length;
    if (!originalDiscardPileLen) {
      const temp = this.discardPile;
      this.discardPile = this.hand;
      this.hand = temp;
      return;
    }
    const originalHandLen = this.hand.length;
    this.discardPile.length = originalDiscardPileLen + originalHandLen;
    for (let i = 0; i < originalHandLen; i++) {
      this.discardPile[originalDiscardPileLen + i] = this.hand[i];
    }
    this.hand = [];
  }

  discardMultiple(indexes) {
    this.hand = this.hand.filter((c, i) => {
      if (indexes.indexOf(i) >= 0) {
        this.discardPile.push(this.hand[i]);
        return false;
      }
      return true;
    });
  }

  stealFrom(enemy, index) {
    const card = enemy.hand.splice(index, 1)[index];
    this.deck.push(card);
    return card;
  }

  putInPlay(index) {
    return this.hand.splice(index, 1)[0];
  }

  removeFromPlay(card) {
    this.discardPile.push(card);
  }
}

const effects = ['discard', 'draw', 'cycle', 'steal', 'conceal', 'magicNext',
                 'physicalNext', 'magicRound', 'physicalRound',
                 'extraHandSize'];
effects.forEach((effect) => {
  const name = effect + 'Effect';
  const stateName = _.capitalize(name);
  Object.defineProperty(Accessor.prototype, effect + 'Effect', {
    get: function() { return this.state[this.type + stateName] || 0; },
    set: function(v) { this.state[this.type + stateName] = v; },
  });
});

const traits = ['frail', 'mundane', 'fury', 'predictable', 'brittle',
                'tenacious', 'sluggish', 'bulwark', 'retribution',
                'decay', 'tough', 'spikey', 'rum', 'ferocious', 'burn',
                'respite'];
traits.forEach((trait) => {
  const stateName = _.capitalize(trait);
  Object.defineProperty(Accessor.prototype, trait, {
    get: function() { return this.state[this.type + stateName] || 0; },
    set: function(v) { this.state[this.type + stateName] = v; },
  });
});
