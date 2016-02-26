import {GameStatePlayerAccessor, GameStateEnemyAccessor} from './game-state-player-accessor';
import _ from '../utils/common';

export default class GameStateAccessor {
  constructor() {
    this.player = new GameStatePlayerAccessor();
    this.enemy = new GameStateEnemyAccessor();
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
    const clone = this.newTurnClone();
    clone.playerDiscardEffect = this.state.playerDiscardEffect;
    clone.playerDrawEffect = this.state.playerDrawEffect;
    clone.playerCycleEffect = this.state.playerCycleEffect;

    clone.enemyStealEffect = this.state.enemyStealEffect;
    return clone;
  }

  // Clone with only persistant effects (e.g. no drawEffect).
  newTurnClone() {
    return {
      playerHealth: this.state.playerHealth,
      playerDeck: _.clone(this.state.playerDeck),
      playerHand: _.clone(this.state.playerHand),
      playerDiscardPile: _.clone(this.state.playerDiscardPile),
      playerMagicNextEffect: this.state.playerMagicNextEffect,
      playerPhysicalNextEffect: this.state.playerPhysicalNextEffect,
      playerMagicRoundEffect: this.state.playerMagicRoundEffect,
      playerPhysicalRoundEffect: this.state.playerPhysicalRoundEffect,

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
    return this.instance.setState(state).initialGameState;
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
