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
    const dest = {};
    this.copyInto(dest);
    return dest;
  }

  copyInto(dest) {
    dest.playerHealth = this.state.playerHealth;
    dest.playerDeck = _.clone(this.state.playerDeck);
    dest.playerHand = _.clone(this.state.playerHand);
    dest.playerDiscardPile = _.clone(this.state.playerDiscardPile);
    dest.playerDiscardEffect = this.state.playerDiscardEffect;
    dest.playerDrawEffect = this.state.playerDrawEffect;
    dest.playerCycleEffect = this.state.playerCycleEffect;
    dest.playerMagicNextEffect = this.state.playerMagicNextEffect;
    dest.playerPhysicalNextEffect = this.state.playerPhysicalNextEffect;
    dest.playerMagicRoundEffect = this.state.playerMagicRoundEffect;
    dest.playerPhysicalRoundEffect = this.state.playerPhysicalRoundEffect;

    dest.enemyHealth = this.state.enemyHealth;
    dest.enemyDeck = _.clone(this.state.enemyDeck);
    dest.enemyHand = _.clone(this.state.enemyHand);
    dest.enemyDiscardPile = _.clone(this.state.enemyDiscardPile);
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
      playerDiscardPile: [],
      enemyHealth: 5,
      enemyDeck: [],
      enemyHand: [],
      enemyDiscardPile: [],
    });
  }
}
