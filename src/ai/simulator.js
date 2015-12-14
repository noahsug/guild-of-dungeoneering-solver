import _ from '../utils/common';
import CardResolver from './card-resolver';
import GameStateAccessor from './game-state-accessor';

export default class Simulator {
  constructor() {
    this.cardResolver_ = new CardResolver();
  }

  getInitialStateGenerator(initialState) {
    const accessor = new GameStateAccessor().setState(initialState);
    const {player, enemy} = accessor;
    const generator = function*() {
      const cache = {};
      const cardIds = {};
      const handIterator = _.combinate(_.shuffle(player.deck), 4);
      for (const playerHand of handIterator) {
        const enemyDeck = _.shuffle(enemy.deck);
        for (let i = 0; i < enemyDeck.length; i++) {
          const enemyDraw = enemyDeck[i];
          const id = this.getInitialStateId_(playerHand, enemyDraw, cardIds);

          // TODO: Combine with getStateGenerator() logic.
          if (!cache[id]) {
            const state = this.cloneState(initialState);
            accessor.setState(state);
            player.hand = playerHand;
            player.deck = _.remove(player.deck, ...playerHand);
            enemy.hand = [enemyDraw];
            enemy.deck = _.remove(enemy.deck, enemyDraw);
            state.id = id;
            cache[id] = state;
            accessor.setState(initialState);
          }
          yield cache[id];
        }
      }
    }.call(this);
    generator.length =
        _.binomialCoefficient(player.deck.length, 4) * enemy.deck.length;
    return generator;
  }

  getInitialStateId_(playerHand, enemyDraw, cardIds) {
    if (cardIds.nextId == undefined) cardIds.nextId = 0;
    const id = playerHand.reduce((p, c) => {
      if (!cardIds[c]) {
        cardIds[c] = cardIds.nextId;
        cardIds.nextId++;
      }
      c = cardIds[c];
      return p + Math.pow(5, c);
    }, Math.pow(5, 21) * enemyDraw);
    _.assert(cardIds.nextId <= 21);
    return id;
  }

  getMoves(state) {
    return _.unique(state.playerHand);
  }

  play(state, move) {
    const nextState = this.getStateGenerator(state, move).next().value;
    GameStateAccessor.copyInto(state, nextState);
    return this.getResult(state);
  }

  cloneState(state) {
    return GameStateAccessor.clone(state);
  }

  stateEquals(state1, state2) {
    return state1.playerHealth === state2.playerHealth &&
        _.valuesEqual(state1.playerDeck = state2.playerDeck) &&
        _.valuesEqual(state1.playerHand = state2.playerHand) &&
        _.valuesEqual(state1.playerDiscard = state2.playerDiscard) &&
        state1.enemyHealth === state2.enemyHealth &&
        _.valuesEqual(state1.enemyDeck = state2.enemyDeck) &&
        _.valuesEqual(state1.enemyHand = state2.enemyHand) &&
        _.valuesEqual(state1.enemyDiscard = state2.enemyDiscard);
  }

  getStateGenerator(state, move) {
    state = this.cloneState(state);
    const accessor = new GameStateAccessor().setState(state);
    const {player, enemy} = accessor;
    const gameOver = this.cardResolver_.resolve(state, move, enemy.hand[0]);

    // Shortcut: If the game is over, don't generate states.
    if (gameOver) return _.iterator(state);

    player.discard(player.hand.indexOf(move));
    enemy.discard(0);

    const numDiscards = Math.min(player.discardEffect, player.hand.length);
    const numPlayerDraws =
        player.deck.length || player.discardPile.length + numDiscards;
    const numEnemyDraws = enemy.deck.length || enemy.discardPile.length;

    const generator = function*() {
      const cache = {};
      const discardIterator = this.getDiscardIterator_(accessor);
      for (const discards of discardIterator) {
        const playerDraws = _.shuffle(_.range(numPlayerDraws));
        for (let pi = 0; pi < playerDraws.length; pi++) {
          const playerDraw = playerDraws[pi];
          const enemyDraws = _.shuffle(_.range(numEnemyDraws));
          for (let ei = 0; ei < enemyDraws.length; ei++) {
            const enemyDraw = enemyDraws[ei];
            yield this.createNextState_(
                accessor, cache, playerDraw, discards, enemyDraw);
          }
        }
      }
    }.call(this);
    generator.length = numPlayerDraws * numEnemyDraws *
        _.binomialCoefficient(player.hand.length, player.discardEffect);
    return generator;
  }

  getDiscardIterator_(accessor) {
    const [player, enemy] = accessor.access();
    if (player.discardEffect && player.discardEffect < player.hand.length) {
      const possibleDiscards = _.shuffle(_.range(player.hand.length));
      return _.combinate(possibleDiscards, player.discardEffect);
    }
    const numDiscards = Math.min(player.discardEffect, player.hand.length);
    return _.iterator(_.range(numDiscards));
  }

  createNextState_(accessor, cache, playerDraw, playerDiscards, enemyDraw) {
    const [player, enemy] = accessor.access();
    const prevState = accessor.state;
    const nextState = accessor.clone();
    accessor.setState(nextState);

    let id = 0;
    let discarded = 0;
    playerDiscards.forEach(i => {
      id += player.discard(i - discarded) + 1;
      discarded++;
    });
    id += player.draw(playerDraw) * 31;
    id += enemy.draw(enemyDraw) * 31 * 31;

    accessor.setState(prevState);

    if (!cache[id]) {
      nextState.id = id;
      cache[id] = nextState;
    }
    return cache[id];
  }

  getResult(state) {
    return GameStateAccessor.instance.setState(state).result;
  }
}
