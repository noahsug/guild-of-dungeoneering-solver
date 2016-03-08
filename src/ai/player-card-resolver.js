import Card from './card';
import _ from '../utils/common';

export default class PlayerCardResolver {
  constructor(state) {
    this.state_ = state;
  }

  set initialState(initialState) {
    this.initial_ = initialState;
  }

  set enemy(enemy) {
    this.enemy_ = enemy;
  }

  get dead() {
    return this.state_.health <= 0;
  }

  get quick() {
    return this.card_.quick || this.initial_.ranged;
  }

  init(card) {
    this.card_ = card;
    this.reset_();

    // Rum
    if (this.state_.rum && this.state_.health == 1) {
      this.state_.health += 2;
      this.state_.rum = 0;
    }

    if (card.withstand) this.state_.withstandEffect = 2;
  }

  reset_() {
    this.physicalDmg_ = 0;
    this.magicDmg_ = 0;
    this.physicalBlock_ = 0;
    this.magicBlock_ = 0;
    this.block_ = 0;
    this.heal_ = 0;
    this.dmgBlocked_ = 0;
    this.dmgTaken_ = 0;
    this.dmgFromEnemy_ = 0;
    this.magicDmgTakenFromEnemy_ = 0;
    // Traits that have had their effect used.
    this.used_ = {};
    // Used when looking ahead to see if quick ends the round.
    this.noAttack_ = false;
    this.noEffects_ = false;
  }

  survivedQuick() {
    const health = this.state_.health;
    const enemyHealth = this.enemy_.state_.health;
    this.noAttack_ = true;
    this.noEffects_ = this.enemy_.noEffects_ = true;

    this.enemy_.setDmgAndBlock();
    this.setDmgAndBlock();

    this.prepareToTakeCombatDmg();
    this.processDmgTaken();
    this.postProcessDmgTaken();
    this.enemy_.processDmgDelt();

    this.resolveCombatDmg();
    this.enemy_.resolveCombatDmg();
    if (this.dead || this.enemy_.dead) return false;

    this.state_.health = health;
    this.enemy_.state_.health = enemyHealth;
    this.reset_();
    this.enemy_.reset_();
    return true;
  }

  resolveBurnDmg() {
    this.dmgTaken_ += this.getBurnDmgTaken_();
    this.dmgTaken_ += this.getAdditionalDmgTaken_();
    this.burnDmgTaken_ = this.dmgTaken_;
    this.resolveDmg_(this.burnDmgTaken_);
  }

  setDmgAndBlock() {
    if (!this.noAttack_) {
      this.dmgTaken_ += this.card_.selfDmg;
      this.dmgTaken_ += this.getAdditionalDmgTaken_();
      this.heal_ += this.card_.heal;
    }
    this.physicalDmg_ += this.getPhysicalDmg_();
    this.magicDmg_ += this.getMagicDmg_();
    this.physicalBlock_ += this.getPhysicalBlock_();
    this.magicBlock_ += this.getMagicBlock_();
    this.block_ += this.getBlock_();
  }

  prepareToTakeCombatDmg() {
    this.setCombatDmgTaken_();
  }

  processDmgTaken() {
    // Spikey.
    if (this.initial_.spikey && this.dmgBlocked_ && !this.dmgFromEnemy_) {
      this.enemy_.takeExtraDmg_(1);
    }
  }

  postProcessDmgTaken() {
    // Bulwark
    if (this.initial_.bulwark && this.dmgTaken_ == 1 &&
        (!this.dmgFromEnemy_ || !this.enemy_.card_.unblockable)) {
      this.dmgTaken_--;
      this.dmgBlocked_++;
      if (this.dmgFromEnemy_) {
        this.dmgFromEnemy_--;
        if (this.dmgFromEnemy_ == 0) this.magicDmgTakenFromEnemy_ = 0;
      }
    }
    if (this.dmgBlocked_) this.resolveIfBlock_(this.dmgBlocked_);
  }

  processDmgDelt() {
    if (this.enemy_.dmgFromEnemy_) {
      this.resolveIfDmg_(this.enemy_.dmgFromEnemy_);
    }
    if (!this.noEffects_) this.resolveEffects_();
  }

  resolveCombatDmg() {
    let dmg = this.dmgTaken_ - this.burnDmgTaken_;
    if (this.card_.healthSix) {
      dmg -= 6 - this.state_.health;
    }
    this.state_.health += this.heal_;
    // Blessing
    if (this.heal_ && this.initial_.blessing) {
      this.state_.health += 1;
    }
    // Respite
    if (this.initial_.respite && !this.dmgTaken_) this.state_.health += 1;
    this.resolveDmg_(dmg);
    if (this.state_.withstandEffect) this.state_.withstandEffect -= 1;
  }

  resolveDmg_(dmg) {
    // Tenacious
    if (this.initial_.tenacious && this.state_.health > 1 &&
       this.state_.health <= dmg) {
      this.state_.health = 1;
    } else {
      this.state_.health -= dmg;
    }

    // Withstand
    if (this.state_.withstandEffect && this.state_.health <= 0) {
      this.state_.health = 1;
    }
  }

  getBurnDmgTaken_() {
    return this.initial_.burn +
        this.enemy_.initial_.burn +
        this.state_.physicalRoundEffect +
        this.state_.magicRoundEffect;
  }

  getAdditionalDmgTaken_() {
    let bonus = 0;
    // Decay
    if (this.initial_.decay && this.dmgTaken_ >= 2 &&
       !this.used_.decay) {
      bonus += 1;
      this.used_.decay = true;
    }
    // Brittle
    if (this.initial_.brittle && this.dmgTaken_ >= 4 &&
       !this.used_.brittle) {
      bonus += 2;
      this.used_.brittle = true;
    }
    return bonus;
  }

  getPhysicalDmg_() {
    let physical = this.card_.physical;
    if (!physical) return 0;
    // Frail
    if (this.enemy_.initial_.frail) physical++;
    physical += this.state_.physicalNextEffect;
    if (!this.noEffects_) {
      this.state_.physicalNextEffect = 0;
    }
    if (this.card_.physicalVsUnblockable && this.enemy_.card_.unblockable) {
      physical += this.card_.physicalVsUnblockable;
    }
    // Fury
    if (this.initial_.fury &&
        this.state_.health <= this.initial_.health / 2) {
      physical++;
    }
    // Ferocious
    if (this.initial_.ferocious && physical >= 3) {
      physical++;
    }
    return physical;
  }

  getMagicDmg_() {
    let magic = this.card_.magic;
    if (this.card_.cardStorm) magic += this.state_.hand.length - 1;
    if (!magic) return 0;
    magic = this.buffMagicDmg_(magic, this.enemy_);
    magic += this.state_.magicNextEffect;
    if (!this.noEffects_) {
      this.state_.magicNextEffect = 0;
    }
    return magic;
  }

  getPhysicalBlock_() {
    if (this.card_.blockPhysicalAll) return Infinity;
    let block = this.card_.blockPhysical;
    if (this.card_.paperShield) block += this.state_.hand.length - 1;
    return this.buffBlock_(block);
  }

  getMagicBlock_() {
    if (this.card_.blockMagicAll) return Infinity;
    return this.buffBlock_(this.card_.blockMagic);
  }

  getBlock_() {
    if (this.card_.blockAll) return Infinity;
    return this.buffBlock_(this.card_.block);
  }

  buffBlock_(block) {
    if (!block) return 0;
    // Sluggish
    if (this.enemy_.initial_.sluggish) block *= 2;
    // Tough
    if (this.initial_.tough) block++;
    return block;
  }

  setCombatDmgTaken_() {
    if (!this.enemy_.card_.unblockable) {
      const physicalAndMagicBlock =
          Math.min(this.enemy_.physicalDmg_, this.physicalBlock_) +
          Math.min(this.enemy_.magicDmg_, this.magicBlock_);
      this.dmgBlocked_ += Math.min(
          this.enemy_.physicalDmg_ + this.enemy_.magicDmg_,
          physicalAndMagicBlock + this.block_);
    }
    this.dmgTaken_ +=
        this.enemy_.physicalDmg_ + this.enemy_.magicDmg_ - this.dmgBlocked_;

    // Retribution
    if (this.initial_.retribution && this.dmgTaken_ >= 3 &&
       !this.used_.retribution) {
      this.enemy_.takeMagicDmg_(1);
      this.used_.retribution = true;
    }
    this.dmgTaken_ += this.getAdditionalDmgTaken_();
    this.dmgFromEnemy_ += this.dmgTaken_ - this.burnDmgTaken_;
    if (this.enemy_.magicDmg_ && this.enemy_.physicalDmg_ +
        this.enemy_.magicDmg_ - this.dmgBlocked_ > 0) {
      this.magicDmgTakenFromEnemy_ = 1;
    }
  }

  takeMagicDmg_(dmg) {
    dmg = this.buffMagicDmg_(dmg, this);
    const physicalDmg = Math.max(
      this.enemy_.physicalDmg_ - this.physicalBlock_, 0);
    const block = Math.max(this.block_ - physicalDmg, 0);
    const magicBlock = Math.max(
        this.magicBlock_ + block - this.enemy_.magicDmg_, 0);
    const blocked = Math.min(magicBlock, dmg);
    if (dmg > blocked) this.magicDmgTakenFromEnemy_ = 1;
    this.takeExtraDmg_(dmg, blocked);
  }

  buffMagicDmg_(dmg, defender) {
    // Mundane
    if (defender.initial_.mundane && !defender.used_.mundane) {
      dmg++;
      defender.mundane = true;
    }
    return dmg;
  }

  takeExtraDmg_(dmg, blocked = 0) {
    dmg -= blocked;
    this.dmgTaken_ += dmg;
    const bonusDmg = this.getAdditionalDmgTaken_();
    this.dmgTaken_ += bonusDmg;
    this.dmgFromEnemy_ += dmg + bonusDmg;
    this.dmgBlocked_ += blocked;
  }

  resolveIfDmg_(dmg) {
    //this.state_.stealEffect += this.card_.stealIfDmg;
    //this.state_concealEffect += this.card_.concealIfDmg;
    this.heal_ += this.card_.healIfDmg;
    this.heal_ += dmg * this.card_.healPerDmg;
    if (!this.noEffects_) {
      this.enemy_.state_.discardEffect += this.card_.discardIfDmg;
      this.enemy_.state_.physicalRoundEffect += this.card_.physicalRoundIfDmg;
      this.enemy_.state_.magicRoundEffect += this.card_.magicRoundIfDmg;
    }
  }

  resolveIfBlock_(block) {
    //this.enemy_.state.stealEffect += block * defender.card_.stealPerBlock;
    this.heal_ += block * this.card_.healPerBlock;
  }

  resolveEffects_() {
    this.state_.drawEffect += this.card_.draw;
    // Rules Lawyer
    if (this.initial_.rulesLawyer && this.dmgTaken_ >= 2) {
      this.state_.drawEffect += 1;
    }
    if (this.card_.cardStorm) this.state_.discardEffect += 4;
    //this.state_.stealEffect += this.card_.steal;
    //this.state_.concealEffect += this.card_.conceal;
    this.state_.physicalNextEffect += this.card_.physicalNext;
    this.state_.magicNextEffect += this.card_.magicNext;
    const player = this.state_.type == 'player' ?
          this.state_ : this.enemy_.state_;
    player.cycleEffect += this.card_.cycle;
    // Spellsword
    if (this.initial_.spellsword && this.enemy_.magicDmgTakenFromEnemy_) {
      this.state_.physicalNextEffect += 1;
    }
  }
}
