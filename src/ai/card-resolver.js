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

    this.handlePerRoundDmg_(this.player_);
    this.handlePerRoundDmg_(this.enemy_);

    return this.accessor_.result;
  }

  attack_(attacker, defender, attackCard, defenseCard) {
    if (attackCard.healthSix) {
      attacker.health = 6;
    }

    let dmg = 0;
    let blocked = 0;
    if (attackCard.unblockable) {
      dmg = attackCard.physical + attackCard.magic;
    } else {
      let physical = this.buffPhysical_(
          attackCard.physical, attacker, defender);
      let blockPhysical = defenseCard.blockPhysical;
      if (defenseCard.blockPhysicalAll) blockPhysical = Infinity;
      if (attackCard.physicalVsUnblockable && defenseCard.unblockable) {
        physical += attackCard.physicalVsUnblockable;
      }
      blocked += Math.min(physical, blockPhysical);

      const magic = this.buffMagic_(attackCard.magic, attacker, defender);
      let blockMagic = defenseCard.blockMagic;
      if (defenseCard.blockMagicAll) blockMagic = Infinity;
      blocked += Math.min(magic, blockMagic);

      let block = defenseCard.block;
      if (defenseCard.blockAll) block = Infinity;
      blocked += Math.min(physical + magic - blocked, block);
      dmg = physical + magic - blocked;
    }
    defender.health -= dmg;

    let heal = 0;
    heal += attackCard.heal - attackCard.selfDmg;
    heal += dmg && attackCard.healIfDmg;
    heal += dmg * attackCard.healPerDmg;
    attacker.health += heal;

    if (dmg) {
      attacker.stealEffect += attackCard.stealIfDmg;
      attacker.concealEffect += attackCard.concealIfDmg;
      defender.discardEffect += attackCard.discardIfDmg;
      defender.physicalRoundEffect += attackCard.physicalRoundIfDmg;
      defender.magicRoundEffect += attackCard.magicRoundIfDmg;
    }

    if (blocked) {
      defender.stealEffect += blocked * defenseCard.stealPerBlock;
      defender.health += blocked * defenseCard.healPerBlock;
    }

    attacker.drawEffect += attackCard.draw;
    attacker.stealEffect += attackCard.steal;
    attacker.concealEffect += attackCard.conceal;
    attacker.physicalNextEffect += attackCard.physicalNext;
    attacker.magicNextEffect += attackCard.magicNext;
    defender.cycleEffect += attackCard.cycle;
  }

  buffMagic_(magic, attacker, defender) {
    if (magic) {
      if (defender.mundane) magic++;
      magic += attacker.magicNextEffect;
      attacker.magicNextEffect = 0;
    }
    return magic;
  }

  buffPhysical_(physical, attacker, defender) {
    if (physical) {
      if (defender.frail) physical++;
      physical += attacker.physicalNextEffect;
      attacker.physicalNextEffect = 0;
    }
    return physical;
  }

  handlePerRoundDmg_(player) {
    if (player.physicalRoundEffect) {
      let physical = player.physicalRoundEffect;
      if (player.frail) physical++;
      player.health -= physical;
    }
    if (player.magicRoundEffect) {
      let magic = player.magicRoundEffect;
      if (player.mundane) magic++;
      player.health -= magic;
    }
  }
}
