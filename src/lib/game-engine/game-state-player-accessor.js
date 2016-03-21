import _ from '../../utils/common';

export class GameStatePlayerAccessor {
  constructor() {
    this.state = null;
    this.type = 'player';
  }

  get deck() {
    return this.state.playerDeck;
  }
  set deck(cards) {
    this.state.playerDeck = cards;
  }

  get hand() {
    return this.state.playerHand;
  }
  set hand(hand) {
    this.state.playerHand = hand;
  }

  get discardPile() {
    return this.state.playerDiscardPile;
  }
  set discardPile(cards) {
    this.state.playerDiscardPile = cards;
  }

  get health() {
    return this.state.playerHealth;
  }
  set health(health) {
    this.state.playerHealth = health;
  }

  get dead() {
    return this.state.playerHealth <= 0;
  }

  draw(index) {
    this.prepDraw();
    this.state.playerHand.push(this.state.playerDeck[index]);
    return this.state.playerDeck.splice(index, 1)[0];
  }

  indicateDraw(index) {
    this.state.playerDraw = index;
  }

  get toBeDrawn() {
    return this.state.playerDraw;
  }

  drawAll() {
    const originalHandLen = this.state.playerHand.length;
    if (!originalHandLen) {
      const temp = this.state.playerHand;
      this.state.playerHand = this.state.playerDeck;
      this.state.playerDeck = temp;
      return;
    }
    const originalDeckLen = this.state.playerDeck.length;
    this.state.playerHand.length = originalHandLen + originalDeckLen;
    for (let i = 0; i < originalDeckLen; i++) {
      this.state.playerHand[originalHandLen + i] = this.state.playerDeck[i];
    }
    this.state.playerDeck = [];
  }

  // Moves discard pile to deck if deck is empty.
  prepDraw() {
    if (this.state.playerDeck.length == 0) {
      const temp = this.state.playerDeck;
      this.state.playerDeck = this.state.playerDiscardPile;
      this.state.playerDiscardPile = temp;
    }
  }

  discard(index) {
    this.state.playerDiscardPile.push(this.state.playerHand[index]);
    return this.state.playerHand.splice(index, 1)[0];
  }

  discardAll() {
    const originalDiscardPileLen = this.state.playerDiscardPile.length;
    if (!originalDiscardPileLen) {
      const temp = this.state.playerDiscardPile;
      this.state.playerDiscardPile = this.state.playerHand;
      this.state.playerHand = temp;
      return;
    }
    const originalHandLen = this.state.playerHand.length;
    this.state.playerDiscardPile.length =
        originalDiscardPileLen + originalHandLen;
    for (let i = 0; i < originalHandLen; i++) {
      this.state.playerDiscardPile[originalDiscardPileLen + i] =
          this.state.playerHand[i];
    }
    this.state.playerHand = [];
  }

  discardMultiple(indexes) {
    this.state.playerHand = this.state.playerHand.filter((c, i) => {
      if (indexes.indexOf(i) >= 0) {
        this.state.playerDiscardPile.push(this.state.playerHand[i]);
        return false;
      }
      return true;
    });
  }

  steal(index) {
    const card = this.state.enemyHand.splice(index, 1)[index];
    this.state.playerDeck.push(card);
    return card;
  }

  putInPlay(index) {
    return this.state.playerHand.splice(index, 1)[0];
  }

  removeFromPlay(card) {
    this.state.playerDiscardPile.push(card);
  }

  // Effects
  get discardEffect() {
    return this.state.playerDiscardEffect || 0;
  }
  set discardEffect(value) {
    this.state.playerDiscardEffect = value;
  }

  get drawEffect() {
    return this.state.playerDrawEffect || 0;
  }
  set drawEffect(value) {
    this.state.playerDrawEffect = value;
  }

  get cycleEffect() {
    return this.state.playerCycleEffect || 0;
  }
  set cycleEffect(value) {
    this.state.playerCycleEffect = value;
  }

  get stealEffect() {
    return this.state.playerStealEffect || 0;
  }
  set stealEffect(value) {
    this.state.playerStealEffect = value;
  }

  get concealEffect() {
    return this.state.playerConcealEffect || 0;
  }
  set concealEffect(value) {
    this.state.playerConcealEffect = value;
  }

  get magicNextEffect() {
    return this.state.playerMagicNextEffect || 0;
  }
  set magicNextEffect(value) {
    this.state.playerMagicNextEffect = value;
  }

  get physicalNextEffect() {
    return this.state.playerPhysicalNextEffect || 0;
  }
  set physicalNextEffect(value) {
    this.state.playerPhysicalNextEffect = value;
  }

  get magicRoundEffect() {
    return this.state.playerMagicRoundEffect || 0;
  }
  set magicRoundEffect(value) {
    this.state.playerMagicRoundEffect = value;
  }

  get physicalRoundEffect() {
    return this.state.playerPhysicalRoundEffect || 0;
  }
  set physicalRoundEffect(value) {
    this.state.playerPhysicalRoundEffect = value;
  }

  get extraHandSizeEffect() {
    return this.state.playerExtraHandSizeEffect || 0;
  }
  set extraHandSizeEffect(value) {
    this.state.playerExtraHandSizeEffect = value;
  }

  get withstandEffect() {
    return this.state.playerWithstandEffect || 0;
  }
  set withstandEffect(value) {
    this.state.playerWithstandEffect = value;
  }

  get cloneEffect() {
    return this.state.playerCloneEffect || 0;
  }
  set cloneEffect(value) {
    this.state.playerCloneEffect = value;
  }

  // Traits
  get blessing() {
    return this.state.playerBlessing || 0;
  }
  set blessing(value) {
    this.state.playerBlessing = value;
  }

  get frail() {
    return this.state.playerFrail || 0;
  }
  set frail(value) {
    this.state.playerFrail = value;
  }

  get mundane() {
    return this.state.playerMundane || 0;
  }
  set mundane(value) {
    this.state.playerMundane = value;
  }

  get fury() {
    return this.state.playerFury || 0;
  }
  set fury(value) {
    this.state.playerFury = value;
  }

  get predictable() {
    return this.state.playerPredictable || 0;
  }
  set predictable(value) {
    this.state.playerPredictable = value;
  }

  get brittle() {
    return this.state.playerBrittle || 0;
  }
  set brittle(value) {
    this.state.playerBrittle = value;
  }

  get tenacious() {
    return this.state.playerTenacious || 0;
  }
  set tenacious(value) {
    this.state.playerTenacious = value;
  }

  get sluggish() {
    return this.state.playerSluggish || 0;
  }
  set sluggish(value) {
    this.state.playerSluggish = value;
  }

  get bulwark() {
    return this.state.playerBulwark || 0;
  }
  set bulwark(value) {
    this.state.playerBulwark = value;
  }

  get retribution() {
    return this.state.playerRetribution || 0;
  }
  set retribution(value) {
    this.state.playerRetribution = value;
  }

  get decay() {
    return this.state.playerDecay || 0;
  }
  set decay(value) {
    this.state.playerDecay = value;
  }

  get tough() {
    return this.state.playerTough || 0;
  }
  set tough(value) {
    this.state.playerTough = value;
  }

  get spikey() {
    return this.state.playerSpikey || 0;
  }
  set spikey(value) {
    this.state.playerSpikey = value;
  }

  get rum() {
    return this.state.playerRum || 0;
  }
  set rum(value) {
    this.state.playerRum = value;
  }

  get ferocious() {
    return this.state.playerFerocious || 0;
  }
  set ferocious(value) {
    this.state.playerFerocious = value;
  }

  get burn() {
    return this.state.playerBurn || 0;
  }
  set burn(value) {
    this.state.playerBurn = value;
  }

  get respite() {
    return this.state.playerRespite || 0;
  }
  set respite(value) {
    this.state.playerRespite = value;
  }

  get ranged() {
    return this.state.playerRanged || 0;
  }
  set ranged(value) {
    this.state.playerRanged = value;
  }

  get rulesLawyer() {
    return this.state.playerRulesLawyer || 0;
  }
  set rulesLawyer(value) {
    this.state.playerRulesLawyer = value;
  }

  get spellsword() {
    return this.state.playerSpellsword || 0;
  }
  set spellsword(value) {
    this.state.playerSpellsword = value;
  }

  get showoff() {
    return this.state.playerShowoff || 0;
  }
  set showoff(value) {
    this.state.playerShowoff = value;
  }
}

// Copied from above, but 'player' replaced by 'enemy'.
export class GameStateEnemyAccessor {
  constructor() {
    this.state = null;
    this.type = 'enemy';
  }

  get deck() {
    return this.state.enemyDeck;
  }
  set deck(cards) {
    this.state.enemyDeck = cards;
  }

  get hand() {
    return this.state.enemyHand;
  }
  set hand(hand) {
    this.state.enemyHand = hand;
  }

  get discardPile() {
    return this.state.enemyDiscardPile;
  }
  set discardPile(cards) {
    this.state.enemyDiscardPile = cards;
  }

  get health() {
    return this.state.enemyHealth;
  }
  set health(health) {
    this.state.enemyHealth = health;
  }

  get dead() {
    return this.state.enemyHealth <= 0;
  }

  draw(index) {
    this.prepDraw();
    this.state.enemyHand.push(this.state.enemyDeck[index]);
    return this.state.enemyDeck.splice(index, 1)[0];
  }

  indicateDraw(index) {
    this.state.enemyDraw = index;
  }

  get toBeDrawn() {
    return this.state.enemyDraw;
  }

  drawAll() {
    const originalHandLen = this.state.enemyHand.length;
    if (!originalHandLen) {
      const temp = this.state.enemyHand;
      this.state.enemyHand = this.state.enemyDeck;
      this.state.enemyDeck = temp;
      return;
    }
    const originalDeckLen = this.state.enemyDeck.length;
    this.state.enemyHand.length = originalHandLen + originalDeckLen;
    for (let i = 0; i < originalDeckLen; i++) {
      this.state.enemyHand[originalHandLen + i] = this.state.enemyDeck[i];
    }
    this.state.enemyDeck = [];
  }

  // Moves discard pile to deck if deck is empty.
  prepDraw() {
    if (this.state.enemyDeck.length == 0) {
      const temp = this.state.enemyDeck;
      this.state.enemyDeck = this.state.enemyDiscardPile;
      this.state.enemyDiscardPile = temp;
    }
  }

  discard(index) {
    this.state.enemyDiscardPile.push(this.state.enemyHand[index]);
    return this.state.enemyHand.splice(index, 1)[0];
  }

  discardAll() {
    const originalDiscardPileLen = this.state.enemyDiscardPile.length;
    if (!originalDiscardPileLen) {
      const temp = this.state.enemyDiscardPile;
      this.state.enemyDiscardPile = this.state.enemyHand;
      this.state.enemyHand = temp;
      return;
    }
    const originalHandLen = this.state.enemyHand.length;
    this.state.enemyDiscardPile.length =
        originalDiscardPileLen + originalHandLen;
    for (let i = 0; i < originalHandLen; i++) {
      this.state.enemyDiscardPile[originalDiscardPileLen + i] =
          this.state.enemyHand[i];
    }
    this.state.enemyHand = [];
  }

  discardMultiple(indexes) {
    this.state.enemyHand = this.state.enemyHand.filter((c, i) => {
      if (indexes.indexOf(i) >= 0) {
        this.state.enemyDiscardPile.push(this.state.enemyHand[i]);
        return false;
      }
      return true;
    });
  }

  steal(index) {
    const card = this.state.playerHand.splice(index, 1)[0];
    this.state.enemyDeck.push(card);
    return card;
  }

  putInPlay(index) {
    return this.state.enemyHand.splice(index, 1)[0];
  }

  removeFromPlay(card) {
    this.state.enemyDiscardPile.push(card);
  }

  // Effects
  get discardEffect() {
    return this.state.enemyDiscardEffect || 0;
  }
  set discardEffect(value) {
    this.state.enemyDiscardEffect = value;
  }

  get drawEffect() {
    return this.state.enemyDrawEffect || 0;
  }
  set drawEffect(value) {
    this.state.enemyDrawEffect = value;
  }

  get cycleEffect() {
    return this.state.enemyCycleEffect || 0;
  }
  set cycleEffect(value) {
    this.state.enemyCycleEffect = value;
  }

  get stealEffect() {
    return this.state.enemyStealEffect || 0;
  }
  set stealEffect(value) {
    this.state.enemyStealEffect = value;
  }

  get concealEffect() {
    return this.state.enemyConcealEffect || 0;
  }
  set concealEffect(value) {
    this.state.enemyConcealEffect = value;
  }

  get magicNextEffect() {
    return this.state.enemyMagicNextEffect || 0;
  }
  set magicNextEffect(value) {
    this.state.enemyMagicNextEffect = value;
  }

  get physicalNextEffect() {
    return this.state.enemyPhysicalNextEffect || 0;
  }
  set physicalNextEffect(value) {
    this.state.enemyPhysicalNextEffect = value;
  }

  get magicRoundEffect() {
    return this.state.enemyMagicRoundEffect || 0;
  }
  set magicRoundEffect(value) {
    this.state.enemyMagicRoundEffect = value;
  }

  get physicalRoundEffect() {
    return this.state.enemyPhysicalRoundEffect || 0;
  }
  set physicalRoundEffect(value) {
    this.state.enemyPhysicalRoundEffect = value;
  }

  get extraHandSizeEffect() {
    return this.state.enemyExtraHandSizeEffect || 0;
  }
  set extraHandSizeEffect(value) {
    this.state.enemyExtraHandSizeEffect = value;
  }

  get withstandEffect() {
    return this.state.enemyWithstandSizeEffect || 0;
  }
  set withstandEffect(value) {
    this.state.enemyWithstandEffect = value;
  }

  get cloneEffect() {
    return this.state.enemyCloneEffect || 0;
  }
  set cloneEffect(value) {
    this.state.enemyCloneEffect = value;
  }

  // Traits
  get blessing() {
    return this.state.enemyblessing || 0;
  }
  set blessing(value) {
    this.state.enemyblessing = value;
  }

  get frail() {
    return this.state.enemyFrail || 0;
  }
  set frail(value) {
    this.state.enemyFrail = value;
  }

  get mundane() {
    return this.state.enemyMundane || 0;
  }
  set mundane(value) {
    this.state.enemyMundane = value;
  }

  get fury() {
    return this.state.enemyFury || 0;
  }
  set fury(value) {
    this.state.enemyFury = value;
  }

  get predictable() {
    return this.state.enemyPredictable || 0;
  }
  set predictable(value) {
    this.state.enemyPredictable = value;
  }

  get brittle() {
    return this.state.enemyBrittle || 0;
  }
  set brittle(value) {
    this.state.enemyBrittle = value;
  }

  get tenacious() {
    return this.state.enemyTenacious || 0;
  }
  set tenacious(value) {
    this.state.enemyTenacious = value;
  }

  get sluggish() {
    return this.state.enemySluggish || 0;
  }
  set sluggish(value) {
    this.state.enemySluggish = value;
  }

  get bulwark() {
    return this.state.enemyBulwark || 0;
  }
  set bulwark(value) {
    this.state.enemyBulwark = value;
  }

  get retribution() {
    return this.state.enemyRetribution || 0;
  }
  set retribution(value) {
    this.state.enemyRetribution = value;
  }

  get decay() {
    return this.state.enemyDecay || 0;
  }
  set decay(value) {
    this.state.enemyDecay = value;
  }

  get tough() {
    return this.state.enemyTough || 0;
  }
  set tough(value) {
    this.state.enemyTough = value;
  }

  get spikey() {
    return this.state.enemySpikey || 0;
  }
  set spikey(value) {
    this.state.enemySpikey = value;
  }

  get rum() {
    return this.state.enemyRum || 0;
  }
  set rum(value) {
    this.state.enemyRum = value;
  }

  get ferocious() {
    return this.state.enemyFerocious || 0;
  }
  set ferocious(value) {
    this.state.enemyFerocious = value;
  }

  get burn() {
    return this.state.enemyBurn || 0;
  }
  set burn(value) {
    this.state.enemyBurn = value;
  }

  get respite() {
    return this.state.enemyRespite || 0;
  }
  set respite(value) {
    this.state.enemyRespite = value;
  }

  get ranged() {
    return this.state.enemyRanged || 0;
  }
  set ranged(value) {
    this.state.enemyRanged = value;
  }

  get rulesLawyer() {
    return this.state.enemyRulesLawyer || 0;
  }
  set rulesLawyer(value) {
    this.state.enemyRulesLawyer = value;
  }

  get spellsword() {
    return this.state.enemySpellsword || 0;
  }
  set spellsword(value) {
    this.state.enemySpellsword = value;
  }

  get showoff() {
    return this.state.enemyShowoff || 0;
  }
  set showoff(value) {
    this.state.enemyShowoff = value;
  }
}
