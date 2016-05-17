class FastState {
  // Max possible depth.
  MAX_DEPTH = 200;

  clone(state) {
    return {
      player: {
        health: state.player.health,
        deck: state.player.deck.slice(),
        hand: state.player.hand.slice(),
        discard: state.player.discard.slice(),

        magicNextEffect: state.player.magicNextEffect,
        physicalNextEffect: state.player.physicalNextEffect,
        magicRoundEffect: state.player.magicRoundEffect,
        physicalRoundEffect: state.player.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,

        stealEffect: 0,
        discardEffect: 0,
        drawEffect: 0,
        cycleEffect: 0,
      },
      enemy: {
        health: state.enemy.health,

        magicNextEffect: state.enemy.magicNextEffect,
        physicalNextEffect: state.enemy.physicalNextEffect,
        magicRoundEffect: state.enemy.magicRoundEffect,
        physicalRoundEffect: state.enemy.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,
        rum: state.enemy.rum,

        stealEffect: 0,
        discardEffect: 0,
        drawEffect: 0,
      },
    };
  }

  // Same as clone, but copies draw / discard / etc effects.
  incrementalClone(state) {
    return {
      player: {
        health: state.player.health,
        deck: state.player.deck.slice(),
        hand: state.player.hand.slice(),
        discard: state.player.discard.slice(),

        magicNextEffect: state.player.magicNextEffect,
        physicalNextEffect: state.player.physicalNextEffect,
        magicRoundEffect: state.player.magicRoundEffect,
        physicalRoundEffect: state.player.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,

        stealEffect: state.player.stealEffect,
        discardEffect: state.player.discardEffect,
        drawEffect: state.player.drawEffect,
        cycleEffect: state.player.cycleEffect,
      },
      enemy: {
        health: state.enemy.health,

        magicNextEffect: state.enemy.magicNextEffect,
        physicalNextEffect: state.enemy.physicalNextEffect,
        magicRoundEffect: state.enemy.magicRoundEffect,
        physicalRoundEffect: state.enemy.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,
        rum: state.enemy.rum,

        stealEffect: 0,
        discardEffect: 0,
        drawEffect: 0,
      },
    };
  }

  // Same as clone but w/o copying deck, hand, discard info.
  cloneStats(state) {
    return {
      player: {
        health: state.player.health,

        magicNextEffect: state.player.magicNextEffect,
        physicalNextEffect: state.player.physicalNextEffect,
        magicRoundEffect: state.player.magicRoundEffect,
        physicalRoundEffect: state.player.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,
      },
      enemy: {
        health: state.enemy.health,

        magicNextEffect: state.enemy.magicNextEffect,
        physicalNextEffect: state.enemy.physicalNextEffect,
        magicRoundEffect: state.enemy.magicRoundEffect,
        physicalRoundEffect: state.enemy.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,
        rum: state.enemy.rum,
      },
    };
  }

  drawOne(player, indexValue) {
    if (!player.deck.length) {
      player.deck = player.discard;
      player.discard = [];
    }
    const index = player.deck.length * indexValue | 0;
    player.hand.push(player.deck.splice(index, 1)[0]);
  }

  draw(player, indexValue, count) {
    if (!player.deck.length) {
      if (!player.discard.length) return;
      player.deck = player.discard;
      player.discard = [];
    }
    if (this.moveCards_(player.deck, player.hand, indexValue, count)) {
      player.deck = [];
    }
  }

  discard(player, indexValue, count) {
    if (this.moveCards_(player.hand, player.discard, indexValue, count)) {
      player.hand = [];
    }
  }

  // Returns true if all cards were moved and the source should be cleared.
  moveCards_(from, to, indexValue, count) {
    const fromLen = from.length;
    if (fromLen <= count) {
      to.push(...from);
      return true;
    }

    let index = fromLen * indexValue | 0;
    const endIndex = index + count;
    if (endIndex >= fromLen) {
      const overflow = endIndex - fromLen;
      to.push(...from.splice(0, overflow));
      count -= overflow;
      index -= overflow;
    }
    to.push(...from.splice(index, count));
    return false;
  }
}

export default new FastState();
