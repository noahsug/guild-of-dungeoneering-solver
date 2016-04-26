import _ from '../../utils/common';

class GameState {

  STARTING_HAND_SIZE = 3;

  create(player = {}, enemy = {}) {
    return {
      player: _.defaults(player, {
        health: 5,
        deck: [],
        hand: [],
        discard: [],

        magicNextEffect: 0,
        physicalNextEffect: 0,
        magicRoundEffect: 0,
        physicalRoundEffect: 0,
        withstandEffect: 0,

        blessing: 0,
        frail: 0,
        mundane: 0,
        fury: 0,
        predictable: 0,
        brittle: 0,
        tenacious: 0,
        sluggish: 0,
        bulwark: 0,
        retribution: 0,
        decay: 0,
        tough: 0,
        spikey: 0,
        ferocious: 0,
        burn: 0,
        respite: 0,
        ranged: 0,
        rulesLawyer: 0,
        spellsword: 0,
        showoff: 0,
        punchDrunk: 0,
        extraHandSizeEffect: 0,

        discardEffect: 0,
        drawEffect: 0,
        cycleEffect: 0,
      }),
      enemy: _.defaults(enemy, {
        health: 5,
        deck: [],
        hand: [],
        discard: [],

        magicNextEffect: 0,
        physicalNextEffect: 0,
        magicRoundEffect: 0,
        physicalRoundEffect: 0,
        withstandEffect: 0,
        rum: 0,

        blessing: 0,
        frail: 0,
        mundane: 0,
        fury: 0,
        predictable: 0,
        brittle: 0,
        tenacious: 0,
        sluggish: 0,
        bulwark: 0,
        retribution: 0,
        decay: 0,
        tough: 0,
        spikey: 0,
        ferocious: 0,
        burn: 0,
        respite: 0,
        ranged: 0,
        rulesLawyer: 0,
        spellsword: 0,
        showoff: 0,
        punchDrunk: 0,

        stealEffect: 0,
      }),
      playerDraw: -1,
      enemyDraw: -1,
    };
  }

  clone(state) {
    return {
      player: {
        health: state.player.health,
        deck: _.clone(state.player.deck),
        hand: _.clone(state.player.hand),
        discard: _.clone(state.player.discard),

        magicNextEffect: state.player.magicNextEffect,
        physicalNextEffect: state.player.physicalNextEffect,
        magicRoundEffect: state.player.magicRoundEffect,
        physicalRoundEffect: state.player.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,

        discardEffect: state.player.discardEffect,
        drawEffect: state.player.drawEffect,
        cycleEffect: state.player.cycleEffect,
      },
      enemy: {
        health: state.enemy.health,
        deck: _.clone(state.enemy.deck),
        hand: _.clone(state.enemy.hand),
        discard: _.clone(state.enemy.discard),

        magicNextEffect: state.enemy.magicNextEffect,
        physicalNextEffect: state.enemy.physicalNextEffect,
        magicRoundEffect: state.enemy.magicRoundEffect,
        physicalRoundEffect: state.enemy.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,
        rum: state.enemy.rum,

        stealEffect: state.enemy.stealEffect,
      },
      playerDraw: -1,
      enemyDraw: -1,
    };
  }

  shallowClone(state) {
    return {
      player: state.player,
      enemy: state.enemy,
      playerDraw: state.playerDraw,
      enemyDraw: state.enemyDraw,
    };
  }

  newTurnClone(state) {
    const clone = {
      player: {
        health: state.player.health,
        deck: _.clone(state.player.deck),
        hand: _.clone(state.player.hand),
        discard: _.clone(state.player.discard),

        magicNextEffect: state.player.magicNextEffect,
        physicalNextEffect: state.player.physicalNextEffect,
        magicRoundEffect: state.player.magicRoundEffect,
        physicalRoundEffect: state.player.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,

        discardEffect: 0,
        drawEffect: 0,
        cycleEffect: 0,
      },
      enemy: {
        health: state.enemy.health,
        deck: _.clone(state.enemy.deck),
        hand: _.clone(state.enemy.hand),
        discard: _.clone(state.enemy.discard),

        magicNextEffect: state.enemy.magicNextEffect,
        physicalNextEffect: state.enemy.physicalNextEffect,
        magicRoundEffect: state.enemy.magicRoundEffect,
        physicalRoundEffect: state.enemy.physicalRoundEffect,
        withstandEffect: state.player.withstandEffect,
        rum: state.enemy.rum,

        stealEffect: 0,
      },
      playerDraw: -1,
      enemyDraw: -1,
    };
    if (state.playerDraw != -1) {
      // Perform player and enemy draw.
      clone.player.hand.push(clone.player.deck.splice(state.playerDraw, 1)[0]);
      clone.enemy.hand.push(clone.enemy.deck.splice(state.enemyDraw, 1)[0]);
    }
    return clone;
  }

  drawForNextTurn(state) {
    // Perform player and enemy draw.
    state.player.hand.push(state.player.deck.splice(state.playerDraw, 1)[0]);
    state.enemy.hand.push(state.enemy.deck.splice(state.enemyDraw, 1)[0]);
  }

  // Returns 1, -1 or 0 if player won, lost or neither.
  result(state) {
    return (state.player.health <= 0) * -1 || (state.enemy.health <= 0) * 1;
  }

  cards(player) {
    return player.hand.concat(player.deck).concat(player.discard);
  }

  isInitialGameState(state) {
    return state.player.hand.length == 0 && state.playerDraw == -1;
  }

  draw(player, index) {
    this.prepDraw(player);
    player.hand.push(player.deck[index]);
    return player.deck.splice(index, 1)[0];
  }

  drawAll(player) {
    const originalHandLen = player.hand.length;
    if (!originalHandLen) {
      const temp = player.hand;
      player.hand = player.deck;
      player.deck = temp;
      return;
    }
    const originalDeckLen = player.deck.length;
    player.hand.length = originalHandLen + originalDeckLen;
    for (let i = 0; i < originalDeckLen; i++) {
      player.hand[originalHandLen + i] = player.deck[i];
    }
    player.deck = [];
  }

  prepDraw(player) {
    if (player.deck.length == 0) {
      const temp = player.deck;
      player.deck = player.discard;
      player.discard = temp;
    }
  }

  discard(player, index) {
    player.discard.push(player.hand[index]);
    return player.hand.splice(index, 1)[0];
  }

  discardAll(player) {
    const originalDiscardLen = player.discard.length;
    if (!originalDiscardLen) {
      const temp = player.discard;
      player.discard = player.hand;
      player.hand = temp;
      return;
    }
    const originalHandLen = player.hand.length;
    player.discard.length =
        originalDiscardLen + originalHandLen;
    for (let i = 0; i < originalHandLen; i++) {
      player.discard[originalDiscardLen + i] =
          player.hand[i];
    }
    player.hand = [];
  }

  steal(player, enemy, index) {
    const card = enemy.hand.splice(index, 1)[0];
    player.deck.push(card);
    return card;
  }
}

export default new GameState();
