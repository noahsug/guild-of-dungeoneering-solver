import {GameStatePlayerAccessor, GameStateEnemyAccessor} from './game-state-player-accessor';
import Card from './card';
import _ from '../../utils/common';

export default class GameStateAccessor {
  constructor() {
    this.player = new GameStatePlayerAccessor();
    this.enemy = new GameStateEnemyAccessor();
    this.player.enemy = this.enemy;
    this.enemy.enemy = this.player;
  }

  static STARTING_HAND_SIZE = 3;

  setState(state) {
    this.state = this.player.state = this.enemy.state = state;
    return this;
  }

  get result() {
    if (this.player.dead) return -1;
    if (this.enemy.dead) return 1;
    return 0;
  }

  isInitialGameState() {
    return this.player.hand.length == 0 && this.player.toBeDrawn == undefined;
  }

  access() {
    return [this.player, this.enemy];
  }

  shallowClone() {
    return {
      playerHealth: this.state.playerHealth,
      playerDeck: this.state.playerDeck,
      playerHand: this.state.playerHand,
      playerDiscardPile: this.state.playerDiscardPile,
      playerMagicNextEffect: this.state.playerMagicNextEffect,
      playerPhysicalNextEffect: this.state.playerPhysicalNextEffect,
      playerMagicRoundEffect: this.state.playerMagicRoundEffect,
      playerPhysicalRoundEffect: this.state.playerPhysicalRoundEffect,
      playerWithstandEffect: this.state.playerWithstandEffect,

      enemyHealth: this.state.enemyHealth,
      enemyDeck: this.state.enemyDeck,
      enemyHand: this.state.enemyHand,
      enemyDiscardPile: this.state.enemyDiscardPile,
      //enemyConcealEffect: this.state.enemyConcealEffect,
      enemyMagicNextEffect: this.state.enemyMagicNextEffect,
      enemyPhysicalNextEffect: this.state.enemyPhysicalNextEffect,
      enemyMagicRoundEffect: this.state.enemyMagicRoundEffect,
      enemyPhysicalRoundEffect: this.state.enemyPhysicalRoundEffect,
      //enemyPredictable: this.state.enemyPredictable,
      enemyRum: this.state.enemyRum,

      playerDraw: this.state.playerDraw,
      enemyDraw: this.state.enemyDraw,
    };
  }

  clone() {
    return {
      playerHealth: this.state.playerHealth,
      playerDeck: _.clone(this.state.playerDeck),
      playerHand: _.clone(this.state.playerHand),
      playerDiscardPile: _.clone(this.state.playerDiscardPile),
      playerMagicNextEffect: this.state.playerMagicNextEffect,
      playerPhysicalNextEffect: this.state.playerPhysicalNextEffect,
      playerMagicRoundEffect: this.state.playerMagicRoundEffect,
      playerPhysicalRoundEffect: this.state.playerPhysicalRoundEffect,
      playerWithstandEffect: this.state.playerWithstandEffect,

      enemyHealth: this.state.enemyHealth,
      enemyDeck: _.clone(this.state.enemyDeck),
      enemyHand: _.clone(this.state.enemyHand),
      enemyDiscardPile: _.clone(this.state.enemyDiscardPile),
      //enemyConcealEffect: this.state.enemyConcealEffect,
      enemyMagicNextEffect: this.state.enemyMagicNextEffect,
      enemyPhysicalNextEffect: this.state.enemyPhysicalNextEffect,
      enemyMagicRoundEffect: this.state.enemyMagicRoundEffect,
      enemyPhysicalRoundEffect: this.state.enemyPhysicalRoundEffect,
      //enemyPredictable: this.state.enemyPredictable,
      enemyRum: this.state.enemyRum,

      playerDiscardEffect: this.state.playerDiscardEffect,
      playerDrawEffect: this.state.playerDrawEffect,
      playerCycleEffect: this.state.playerCycleEffect,
      //playerCloneEffect: this.state.playerCloneEffect,

      enemyStealEffect: this.state.enemyStealEffect,
    };
  }

  // Clone with only persistant effects (e.g. no drawEffect).
  newTurnClone() {
    const clone = {
      playerHealth: this.state.playerHealth,
      playerDeck: _.clone(this.state.playerDeck),
      playerHand: _.clone(this.state.playerHand),
      playerDiscardPile: _.clone(this.state.playerDiscardPile),
      playerMagicNextEffect: this.state.playerMagicNextEffect,
      playerPhysicalNextEffect: this.state.playerPhysicalNextEffect,
      playerMagicRoundEffect: this.state.playerMagicRoundEffect,
      playerPhysicalRoundEffect: this.state.playerPhysicalRoundEffect,
      playerWithstandEffect: this.state.playerWithstandEffect,

      enemyHealth: this.state.enemyHealth,
      enemyDeck: _.clone(this.state.enemyDeck),
      enemyHand: _.clone(this.state.enemyHand),
      enemyDiscardPile: _.clone(this.state.enemyDiscardPile),
      //enemyConcealEffect: this.state.enemyConcealEffect,
      enemyMagicNextEffect: this.state.enemyMagicNextEffect,
      enemyPhysicalNextEffect: this.state.enemyPhysicalNextEffect,
      enemyMagicRoundEffect: this.state.enemyMagicRoundEffect,
      enemyPhysicalRoundEffect: this.state.enemyPhysicalRoundEffect,
      //enemyPredictable: this.state.enemyPredictable,
      enemyRum: this.state.enemyRum,
    };

    if (this.state.playerDraw != undefined) {
      // Perform player and enemy draw.
      clone.playerHand.push(
          clone.playerDeck.splice(this.state.playerDraw, 1)[0]);
      clone.enemyHand.push(
          clone.enemyDeck.splice(this.state.enemyDraw, 1)[0]);
    }
    return clone;
  }

  drawForNextTurn() {
    if (this.state.playerDraw != undefined) {
      // Perform player and enemy draw.
      this.state.playerHand.push(
          this.state.playerDeck.splice(this.state.playerDraw, 1)[0]);
      this.state.enemyHand.push(
          this.state.enemyDeck.splice(this.state.enemyDraw, 1)[0]);
      delete this.state.playerDraw;
      delete this.state.enemyDraw;
    }
  }

  static get instance() {
    if (!this.instance_) this.instance_ = new GameStateAccessor();
    return this.instance_;
  }

  static clone(state) {
    return this.instance.setState(state).clone();
  }

  static access(state) {
    return this.instance.setState(state).access();
  }

  static isInitialGameState(state) {
    return this.instance.setState(state).isInitialGameState();
  }

  static create(state) {
    return _.defaults(state, {
      playerHealth: 5,
      playerDeck: [],
      playerHand: [],
      playerDiscardPile: [],
      enemyHealth: 5,
      enemyDeck: [],
      enemyHand: [],
      enemyDiscardPile: [],
    });
  }
}
