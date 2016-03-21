import CardResolver from './../game-engine/card-resolver';
import Card from './../game-engine/card';
import GameStateAccessor from './../game-engine/game-state-accessor';
import GameStateFactory from './../game-state-factory';
import _ from '../../utils/common';

export default class GameStateEvaluator {
  constructor() {
    this.cardResolver_ = new CardResolver();
    this.accessor_ = new GameStateAccessor();
    this.resolved_ = new GameStateAccessor();
    this.player_ = this.accessor_.player;
    this.enemy_ = this.accessor_.enemy;

    this.matchups_ = {};
  }

  evaluate(player, enemy) {
    this.initialState_ = GameStateFactory.create(player, enemy);
    this.cardResolver_.setInitialState(this.initialState_);
    this.accessor_.setState(this.initialState_);

    const handSize = GameStateAccessor.STARTING_HAND_SIZE +
          this.player_.extraHandSizeEffect;
    this.player_.hand = {length: handSize};
    this.enemy_.hand = {length: 1};

    this.evaluateMatchups_();
    this.getSequences_();
  }

  evaluateMatchups_() {
    this.player_.deck.forEach(playerCard => {
      this.enemy_.deck.forEach(enemyCard => {
        const key = this.hash_(playerCard, enemyCard);
        if (this.matchups_.hasOwnProperty(key)) return;
        const evaluation = this.evaluateMatchup_(playerCard, enemyCard);
        this.matchups_[key] = evaluation;
      });
    });
  }

  hash_(playerCard, enemyCard) {
    return Card.list[playerCard].desc + ' ' + Card.list[enemyCard].desc;
    //return playerCard * 1000 + enemyCard;
  }

  evaluateMatchup_(playerCard, enemyCard) {
    const state = _.clone(this.initialState_);
    this.resolved_.setState(state);
    this.cardResolver_.resolve(state, playerCard, enemyCard);
    if (this.resolved_.player.dead) return -Infinity;
    if (this.resolved_.enemy.dead) return Infinity;
    const dph = this.resolved_.player.health - this.player_.health -
          this.enemy_.physicalNextEffect -
          this.enemy_.magicNextEffect;
    const deh = this.resolved_.enemy.health - this.enemy_.health -
          this.player_.physicalNextEffect -
          this.player_.magicNextEffect;
    return dph - deh;
  }

  getSequences_(depthLeft) {
    //const matchupGenerator =
    //    _.arrayCombinate(this.player_.deck, this.enemy_.deck);
    //console.log(this.player_.deck.length, this.enemy_.deck.length);
    //const matchupGenerator = _.combinate(this.player_.deck, 9);
    //const sequences = Array.from(matchupGenerator);

    //const combinations = _.combinationsGenerator(new Array(20), 6);
    //console.log('C:', Array.from(combinations).length);
    //
    //let count = 0;
    //for (const deck of _.permutate(new Array(6))) {
    //  count++;
    //}
    //console.log('P:', count);
    //
    //800M iterations = 10s
    //count = 0;
    //const a = performance.now();
    //for (let i = 0; i < 800000000; i++) {
    //  count++;
    //}
    //console.log(count, performance.now() - a);
  }
}
