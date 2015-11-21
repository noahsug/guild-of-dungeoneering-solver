export default class GameStateAccessor {
  constructor(accessor) {
    this.playerAccessor_ = new Accessor('player');
    this.enemyAccessor_ = new Accessor('enemy');
  }

  asPlayer(state) {
    this.playerAccessor_.state = state;
    return this.playerAccessor_;
  }

  asEnemy(state) {
    this.enemyAccessor_.state = state;
    return this.enemyAccessor_;
  }
}

class Accessor {
  constructor(key) {
    this.key_ = {
      deck: key + 'Deck',
      hand: key + 'Hand',
      discard: key + 'Discard',
      health: key + 'Health',
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

  get discard() {
    return this.state[this.key_.discard];
  }

  set discard(cards) {
    this.state[this.key_.discard] = cards;
  }

  get health() {
    return this.state[this.key_.health];
  }

  draw(index) {
    this.hand.unshift(this.deck[index]);
    this.deck.splice(index, 1);
  }

  prepDraw(index) {
    if (this.deck.length == 0) {
      const temp = this.deck;
      this.deck = this.discard;
      this.discard = temp;
    }
  }

  discard(index) {
    this.discard.push(this.hand[index]);
    const [card] = this.hand.splice(index, 1);
  }

  takeDamage(dmg) {
    this.health -= dmg;
  }
}
