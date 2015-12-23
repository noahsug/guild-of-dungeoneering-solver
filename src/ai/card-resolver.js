import GameStateAccessor from './game-state-accessor';
import Card from './card';
import _ from '../utils/common';

export default class CardResolver {
  constructor() {
    this.accessor_ = new GameStateAccessor();
    this.player_ = this.accessor_.player;
    this.enemy_ = this.accessor_.enemy;
  }

  // Used to keep track of starting HP and persistant traits.
  setInitialState(initialState) {
    const initialStateAccessor = new GameStateAccessor().setState(initialState);
    this.player_.initial = initialStateAccessor.player;
    this.enemy_.initial = initialStateAccessor.enemy;
  }

  resolve(state, playerCardId, enemyCardId) {
    this.accessor_.setState(state);
    this.setTempStates_(Card.list[playerCardId], Card.list[enemyCardId]);

    this.resolveStartOfRound_();
    if (this.resolveEndOfAttack_()) return true;

    this.calcCombatResults_();

    if (this.player_.card.quick && !this.enemy_.card.quick) {
      this.attack_(this.player_, this.enemy_);
      if (this.resolveEndOfAttack_()) return true;
      this.attack_(this.enemy_, this.player_);
    } else {
      this.attack_(this.enemy_, this.player_);
      if (this.resolveEndOfAttack_()) return true;
      this.attack_(this.player_, this.enemy_);
    }
    this.resolveEndOfRound_();
    return this.resolveEndOfAttack_();
  }

  setTempStates_(playerCard, enemyCard) {
    this.playerSetTempStates_(this.player_, playerCard);
    this.playerSetTempStates_(this.enemy_, enemyCard);
  }

  playerSetTempStates_(player, card) {
    player.card = card;
    player.dmgTaken = 0;
    player.dmgDelt = 0;
    player.dmgBlocked = 0;
  }

  resolveStartOfRound_() {
    this.playerResolveStartOfRound_(this.player_);
    this.playerResolveStartOfRound_(this.enemy_);
  }

  playerResolveStartOfRound_(defender) {
    this.resolveBurnDmg_(defender);

    if (defender.rum && defender.health == 1) {
      defender.health += 2;
      defender.rum = 0;
    }

    defender.startingHealth = defender.health;
  }

  resolveBurnDmg_(defender) {
    defender.recentDmgTaken = this.player_.initial.burn +
        this.enemy_.initial.burn +
        defender.physicalRoundEffect +
        defender.magicRoundEffect;
    if (!defender.recentDmgTaken) return;
    if (defender.initial.mundane && defender.magicRoundEffect) {
      defender.recentDmgTaken++;
    }
    if (defender.initial.frail && defender.physicalRoundEffect) {
      defender.recentDmgTaken++;
    }

    defender.dmgTaken = defender.recentDmgTaken;
    this.calcExtraDmgTaken_(defender);
    defender.health -= defender.recentDmgTaken;
    defender.recentDmgTaken = 0;
  }

  calcCombatResults_() {
    this.setDmgAndBlock_(this.player_);
    this.setDmgAndBlock_(this.enemy_);
    this.calcDmgTaken_(this.player_, this.enemy_);
    this.calcDmgTaken_(this.enemy_, this.player_);
    this.calcConditionalDmgAndBlock_(this.player_, this.enemy_);
    this.calcConditionalDmgAndBlock_(this.enemy_, this.player_);
  }

  setDmgAndBlock_(player) {
    player.physical = this.getPhysicalDmg_(player);
    player.magic = this.getMagicDmg_(player);
    player.physicalBlock = this.getPhysicalBlock_(player);
    player.magicBlock = this.getMagicBlock_(player);
    player.block = this.getBlock_(player);
  }

  getPhysicalDmg_(player) {
    if (!player.card.physical) return 0;
    const enemy = player.enemy;
    let physical = player.card.physical;
    if (enemy.initial.frail) physical++;
    physical += player.physicalNextEffect;
    player.physicalNextEffect = 0;
    if (player.card.physicalVsUnblockable && enemy.card.unblockable) {
      physical += player.card.physicalVsUnblockable;
    }
    if (player.initial.fury && player.health <= player.initial.health / 2) {
      physical++;
    }
    if (player.initial.ferocious && physical >= 3) {
      physical++;
    }
    return physical;
  }

  getMagicDmg_(player) {
    if (!player.card.magic) return 0;
    const enemy = player.enemy;
    let magic = player.card.magic;
    if (enemy.initial.mundane) magic++;
    magic += player.magicNextEffect;
    player.magicNextEffect = 0;
    return magic;
  }

  getPhysicalBlock_(player) {
    if (player.card.blockPhysicalAll) return Infinity;
    return this.buffBlock_(player.card.blockPhysical, player);
  }

  getMagicBlock_(player) {
    if (player.card.blockMagicAll) return Infinity;
    return this.buffBlock_(player.card.blockMagic, player);
  }

  getBlock_(player) {
    if (player.card.blockAll) return Infinity;
    return this.buffBlock_(player.card.block, player);
  }

  buffBlock_(block, player) {
    if (!block) return 0;
    const enemy = player.enemy;
    if (enemy.initial.sluggish) block *= 2;
    if (player.initial.tough) block++;
    return block;
  }

  calcDmgTaken_(attacker, defender) {
    if (!attacker.card.unblockable) {
      defender.dmgBlocked +=
          Math.min(attacker.physical, defender.physicalBlock) +
          Math.min(attacker.magic, defender.magicBlock);
      defender.dmgBlocked += Math.min(
          attacker.physical + attacker.magic - defender.dmgBlocked,
          defender.block);
    }
    attacker.dmgDelt += attacker.physical + attacker.magic -
        defender.dmgBlocked;

    defender.recentDmgTaken = attacker.dmgDelt + defender.card.selfDmg;
    defender.dmgTaken += defender.recentDmgTaken;
  }

  calcConditionalDmgAndBlock_(attacker, defender) {
    if (attacker.initial.retribution && attacker.dmgTaken >= 3) {
      this.dealExtraMagicDmg_(attacker, defender, 1);
    }
    if (attacker.initial.spikey && attacker.dmgBlocked && !defender.dmgDelt) {
      this.dealExtraDmg_(attacker, defender, 1);
    }
    this.calcExtraDmgTaken_(defender);
    if (defender.initial.bulwark && defender.recentDmgTaken == 1 &&
        (!attacker.dmgDelt || !attacker.card.unblockable)) {
      defender.recentDmgTaken = attacker.dmgDelt = 0;
      defender.dmgTaken--;
      defender.dmgBlocked++;
    }
  }

  calcExtraDmgTaken_(defender) {
    const prevDmgTaken = defender.dmgTaken - defender.recentDmgTaken;
    if (defender.initial.brittle && prevDmgTaken < 4 &&
        defender.dmgTaken >= 4) {
      defender.dmgTaken += 2;
      defender.recentDmgTaken += 2;
    }
    if (defender.initial.decay && prevDmgTaken < 2 &&
        defender.dmgTaken >= 2) {
      defender.dmgTaken++;
      defender.recentDmgTaken++;
    }
  }

  dealExtraMagicDmg_(attacker, defender, dmg) {
    const physicalDmg = Math.max(attacker.physical - defender.physicalBlock, 0);
    const block = Math.max(defender.block - physicalDmg, 0);
    const magicBlock = Math.max(
        defender.magicBlock + block - attacker.magic, 0);
    const blocked = Math.min(magicBlock, dmg);
    this.dealExtraDmg_(attacker, defender, dmg, blocked);
  }

  dealExtraDmg_(attacker, defender, dmg, blocked = 0) {
    dmg = dmg - blocked;
    attacker.dmgDelt += dmg;
    defender.dmgTaken += dmg;
    defender.recentDmgTaken += dmg;
    defender.dmgBlocked += blocked;
  }

  attack_(attacker, defender) {
    if (attacker.card.healthSix) attacker.health = 6;

    attacker.health += attacker.card.heal;
    defender.health -= defender.recentDmgTaken;
    defender.recentDmgTaken = 0;

    if (attacker.dmgDelt) this.resolveDmgDelt_(attacker, defender);
    if (defender.dmgBlocked) this.resolveDmgBlocked_(attacker, defender);
    this.resolveEffects_(attacker, defender);
  }

  resolveDmgDelt_(attacker, defender) {
    attacker.stealEffect += attacker.card.stealIfDmg;
    attacker.concealEffect += attacker.card.concealIfDmg;
    attacker.health += attacker.card.healIfDmg;
    attacker.health += attacker.dmgDelt * attacker.card.healPerDmg;
    defender.discardEffect += attacker.card.discardIfDmg;
    defender.physicalRoundEffect += attacker.card.physicalRoundIfDmg;
    defender.magicRoundEffect += attacker.card.magicRoundIfDmg;
  }

  resolveDmgBlocked_(attacker, defender) {
    defender.stealEffect += defender.dmgBlocked * defender.card.stealPerBlock;
    defender.health += defender.dmgBlocked * defender.card.healPerBlock;
  }

  resolveEffects_(attacker, defender) {
    attacker.drawEffect += attacker.card.draw;
    attacker.stealEffect += attacker.card.steal;
    attacker.concealEffect += attacker.card.conceal;
    attacker.physicalNextEffect += attacker.card.physicalNext;
    attacker.magicNextEffect += attacker.card.magicNext;
    this.player_.cycleEffect += attacker.card.cycle;
  }

  resolveEndOfRound_() {
    this.playerResolveEndOfRound_(this.player_);
    this.playerResolveEndOfRound_(this.enemy_);
  }

  playerResolveEndOfRound_(player) {
    if (player.initial.respite && !player.dmgTaken) player.health++;
  }

  resolveEndOfAttack_() {
    this.playerResolveEndOfAttack_(this.player_);
    this.playerResolveEndOfAttack_(this.enemy_);
    return this.accessor_.result;
  }

  playerResolveEndOfAttack_(defender) {
    if (defender.initial.tenacious && defender.health <= 0 &&
        defender.startingHealth > 1) {
      defender.health = 1;
    }
  }
}
