import _ from '../utils/common';

export default class GameStateAccessor {
  constructor() {
    this.player = new Accessor('player');
    this.enemy = new Accessor('enemy');
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
    dest.enemyHealth = this.state.enemyHealth;
    dest.playerDeck = this.state.playerDeck.slice();
    dest.enemyDeck = this.state.enemyDeck.slice();
    dest.playerHand = this.state.playerHand.slice();
    dest.enemyHand = this.state.enemyHand.slice();
    dest.playerDiscard = this.state.playerDiscard.slice();
    dest.enemyDiscard = this.state.enemyDiscard.slice();
    dest.playerFrail = this.state.playerFrail;
    dest.enemyFrail = this.state.enemyFrail;
    dest.playerMundane = this.state.playerMundane;
    dest.enemyMundane = this.state.enemyMundane;
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
  constructor(key) {
    this.key_ = {
      deck: key + 'Deck',
      hand: key + 'Hand',
      discardPile: key + 'Discard',
      health: key + 'Health',
      discardEffect: key + 'DiscardEffect',
      drawEffect: key + 'DrawEffect',
      cycleEffect: key + 'CycleEffect',
      stealEffect: key + 'StealEffect',
      concealEffect: key + 'ConcealEffect',
      magicNextEffect: key + 'MagicNextEffect',
      physicalNextEffect: key + 'PhysicalNextEffect',
      magicRoundEffect: key + 'MagicRoundEffect',
      physicalRoundEffect: key + 'PhysicalRoundEffect',
      frail: key + 'Frail',
      mundane: key + 'Mundane',
    };
    this.state = null;
  }

  get deck() {
    return this.state[this.key_.deck];
  }

  set deck(cards) {
    this.state[this.key_.deck] = cards;
  }

  get hand() {
    return this.state[this.key_.hand];
  }

  set hand(hand) {
    this.state[this.key_.hand] = hand;
  }

  get discardPile() {
    return this.state[this.key_.discardPile];
  }

  set discardPile(cards) {
    this.state[this.key_.discardPile] = cards;
  }

  get health() {
    return this.state[this.key_.health];
  }

  set health(health) {
    this.state[this.key_.health] = health;
  }

  get dead() {
    return this.health <= 0;
  }

  draw(index) {
    this.prepDraw();
    this.hand.unshift(this.deck[index]);
    return this.deck.splice(index, 1)[0];
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

  get discardEffect() {
    return this.state[this.key_.discardEffect] || 0;
  }
  set discardEffect(v) {
    this.state[this.key_.discardEffect] = v;
  }

  get drawEffect() {
    return this.state[this.key_.drawEffect] || 0;
  }
  set drawEffect(v) {
    this.state[this.key_.drawEffect] = v;
  }

  get cycleEffect() {
    return this.state[this.key_.cycleEffect] || 0;
  }
  set cycleEffect(v) {
    this.state[this.key_.cycleEffect] = v;
  }

  get stealEffect() {
    return this.state[this.key_.stealEffect] || 0;
  }
  set stealEffect(v) {
    this.state[this.key_.stealEffect] = v;
  }

  get concealEffect() {
    return this.state[this.key_.concealEffect] || 0;
  }
  set concealEffect(v) {
    this.state[this.key_.concealEffect] = v;
  }

  get magicNextEffect() {
    return this.state[this.key_.magicNextEffect] || 0;
  }
  set magicNextEffect(v) {
    this.state[this.key_.magicNextEffect] = v;
  }

  get physicalNextEffect() {
    return this.state[this.key_.physicalNextEffect] || 0;
  }
  set physicalNextEffect(v) {
    this.state[this.key_.physicalNextEffect] = v;
  }

  get magicRoundEffect() {
    return this.state[this.key_.magicRoundEffect] || 0;
  }
  set magicRoundEffect(v) {
    this.state[this.key_.magicRoundEffect] = v;
  }

  get physicalRoundEffect() {
    return this.state[this.key_.physicalRoundEffect] || 0;
  }
  set physicalRoundEffect(v) {
    this.state[this.key_.physicalRoundEffect] = v;
  }

  get frail() { return this.state[this.key_.frail] || 0; }
  set frail(v) { this.state[this.key_.frail] = v; }

  get mundane() { return this.state[this.key_.mundane] || 0; }
  set mundane(v) { this.state[this.key_.mundane] = v; }
}
