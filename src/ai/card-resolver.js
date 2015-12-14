import GameStateAccessor from './game-state-accessor';
import Card from './card';
import _ from '../utils/common';

export default class CardResolver {
  constructor() {
    this.accessor_ = new GameStateAccessor();
    this.player_ = this.accessor_.player;
    this.enemy_ = this.accessor_.enemy;
  }

  resolve(state, playerCardId, enemyCardId) {
    this.accessor_.setState(state);
    const playerCard = Card.list[playerCardId];
    const enemyCard = Card.list[enemyCardId];
    _.assert(playerCard && enemyCard);

    this.result_ = {};
    if (playerCard.quick && !enemyCard.quick) {
      this.attack_(this.player_, this.enemy_, playerCard, enemyCard);
      if (this.accessor_.result) return true;
      this.attack_(this.enemy_, this.player_, enemyCard, playerCard);
    } else if (enemyCard.quick && !playerCard.quick) {
      this.attack_(this.enemy_, this.player_, enemyCard, playerCard);
      if (this.accessor_.result) return true;
      this.attack_(this.player_, this.enemy_, playerCard, enemyCard);
    } else {
      this.attack_(this.enemy_, this.player_, enemyCard, playerCard);
      this.attack_(this.player_, this.enemy_, playerCard, enemyCard);
    }
    return this.accessor_.result;
  }

  attack_(attacker, defender, attackCard, defenseCard) {
    let dmg = 0;
    if (attackCard.unblockable) {
      dmg += attackCard.physical + attackCard.magic;
    } else {
      let physical = attackCard.physical;
      if (physical && defender.frail) physical++;
      dmg += Math.max(0, physical - defenseCard.blockPhysical);

      let magic = attackCard.magic;
      if (magic && defender.mundane) magic++;
      dmg += Math.max(0, magic - defenseCard.blockMagic);
      dmg -= Math.min(defenseCard.block, dmg);
    }
    defender.health -= dmg;

    let heal = 0;
    heal += attackCard.heal - attackCard.selfDmg;
    heal += dmg * attackCard.healPerDmg;
    heal += dmg && attackCard.healIfDmg;
    attacker.health += heal;

    defender.discardEffect += dmg && attackCard.discardIfDmg;
  }
}
