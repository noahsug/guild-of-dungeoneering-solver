import PlayerCardResolver from './player-card-resolver';
import Card from './card';
import _ from '../../utils/common';

export default class CardResolver {
  constructor() {
    this.player_ = new PlayerCardResolver(true /* is player */);
    this.enemy_ = new PlayerCardResolver(false /* is player */);
    this.player_.enemy = this.enemy_;
    this.enemy_.enemy = this.player_;
  }

  // Used to keep track of starting HP and persistant traits.
  setInitialState(initialState) {
    this.player_.initial = initialState.player;
    this.enemy_.initial = initialState.enemy;
  }

  resolve(state, playerCardId, enemyCardId) {
    this.player_.init(state.player, Card.list[playerCardId]);
    this.enemy_.init(state.enemy, Card.list[enemyCardId]);

    this.player_.resolveBurnDmg();
    this.enemy_.resolveBurnDmg();
    if (this.player_.dead) return 0;
    if (this.enemy_.dead) return 1;

    if (this.player_.quick && !this.enemy_.quick &&
        !this.enemy_.survivedQuick()) {
      return !this.player_.dead;
    }
    if (this.enemy_.quick && !this.player_.quick &&
        !this.player_.survivedQuick()) {
      return !this.player_.dead;
    }
    this.resolveCombat_();

    if (this.player_.dead) return 0;
    if (this.enemy_.dead) return 1;
    return undefined;
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
