import PlayerCardResolver from './player-card-resolver';
import GameStateAccessor from './game-state-accessor';
import Card from './card';
import _ from '../utils/common';

export default class CardResolver {
  constructor() {
    this.accessor_ = new GameStateAccessor();
    this.player_ = new PlayerCardResolver(this.accessor_.player);
    this.enemy_ = new PlayerCardResolver(this.accessor_.enemy);
    this.player_.enemy = this.enemy_;
    this.enemy_.enemy = this.player_;
  }

  // Used to keep track of starting HP and persistant traits.
  setInitialState(initialState) {
    const initialStateAccessor = new GameStateAccessor().setState(initialState);
    this.player_.initialState = initialStateAccessor.player;
    this.enemy_.initialState = initialStateAccessor.enemy;
  }

  resolve(state, playerCardId, enemyCardId) {
    this.accessor_.setState(state);
    this.player_.init(Card.list[playerCardId]);
    this.enemy_.init(Card.list[enemyCardId]);

    this.player_.resolveBurnDmg();
    this.enemy_.resolveBurnDmg();
    if (this.player_.dead || this.enemy_.dead) return true;

    if (this.player_.quick && !this.enemy_.quick &&
        !this.enemy_.survivedQuick()) {
      return true;
    }
    if (this.enemy_.quick && !this.player_.quick &&
        !this.player_.survivedQuick()) {
      return true;
    }
    this.resolveCombat_();

    return this.player_.dead || this.enemy_.dead;
  }

  resolveCombat_() {
    this.player_.setDmgAndBlock();
    this.enemy_.setDmgAndBlock();

    this.player_.prepareToTakeCombatDmg();
    this.enemy_.prepareToTakeCombatDmg();

    this.player_.processDmgTaken();
    this.enemy_.processDmgTaken();

    this.player_.postProcessDmgTaken();
    this.enemy_.postProcessDmgTaken();

    this.enemy_.processDmgDelt();
    this.player_.processDmgDelt();

    this.enemy_.resolveCombatDmg();
    this.player_.resolveCombatDmg();
  }
}
