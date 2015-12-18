import CardResolver from './card-resolver';
import GameStateAccessor from './game-state-accessor';
import _ from '../utils/common';

// Base number of cards player draws at start of game.
const INITIAL_DRAW = 4;

export default class Simulator {
  constructor() {
    this.cardResolver_ = new CardResolver();
  }

  *getInitialStateGenerator(initialState) {
    const accessor = new GameStateAccessor().setState(initialState);
    const {player, enemy} = accessor;

    const handIterator = _.combinate(_.shuffle(player.deck), 4);
    for (const playerHand of handIterator) {
      const enemyDeck = _.shuffle(enemy.deck);
      for (let i = 0; i < enemyDeck.length; i++) {
        const enemyDraw = enemyDeck[i];
        const state = this.cloneState(initialState);
        accessor.setState(state);
        player.hand = playerHand;
        player.deck = _.remove(player.deck, ...playerHand);
        enemy.hand = [enemyDraw];
        enemy.deck = _.remove(enemy.deck, enemyDraw);
        accessor.setState(initialState);
        yield state;
      }
    }
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

  *getStateGenerator(state, move) {
    state = this.cloneState(state);
    const accessor = new GameStateAccessor().setState(state);
    const {player, enemy} = accessor;
    const gameOver = this.cardResolver_.resolve(state, move, enemy.hand[0]);

    // Shortcut: If the game is over, don't generate states.
    if (gameOver) {
      yield state;
      return;
    }

    player.discard(player.hand.indexOf(move));
    enemy.discard(0);

    const numDiscards = Math.min(player.discardEffect, player.hand.length);
    const numPlayerDraws =
        player.deck.length || player.discardPile.length + numDiscards;
    const numEnemyDraws = enemy.deck.length || enemy.discardPile.length;

    const discardIterator = this.getDiscardIterator_(accessor);
    for (const discards of discardIterator) {
      const playerDraws = _.shuffle(_.range(numPlayerDraws));
      for (let pi = 0; pi < playerDraws.length; pi++) {
        const playerDraw = playerDraws[pi];
        const enemyDraws = _.shuffle(_.range(numEnemyDraws));
        for (let ei = 0; ei < enemyDraws.length; ei++) {
          const enemyDraw = enemyDraws[ei];
          yield this.getNextState_(accessor, playerDraw, discards, enemyDraw);
        }
      }
    }
  }

  getDiscardIterator_(accessor) {
    const {player, enemy} = accessor;
    if (player.discardEffect && player.discardEffect < player.hand.length) {
      const possibleDiscards = _.shuffle(_.range(player.hand.length));
      return _.combinate(possibleDiscards, player.discardEffect);
    }
    const numDiscards = Math.min(player.discardEffect, player.hand.length);
    return _.iterator(_.range(numDiscards));
  }

  getNextState_(accessor, playerDraw, playerDiscards, enemyDraw) {
    const {player, enemy} = accessor;
    const prevState = accessor.state;
    const nextState = accessor.clone();
    accessor.setState(nextState);

    player.discardAll(playerDiscards);
    player.draw(playerDraw);
    enemy.draw(enemyDraw);

    accessor.setState(prevState);
    return nextState;
  }

  getResult(state) {
    return GameStateAccessor.instance.setState(state).result;
  }
}
