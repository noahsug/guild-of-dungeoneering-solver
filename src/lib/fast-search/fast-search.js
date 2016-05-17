import CardMover from './card-mover';
import FastHash from './fast-hash';
import p from './pretty-print';
import fs from './fast-state';
import gs from '../game-engine/game-state';
import CardResolver from '../game-engine/card-resolver';
import _ from '../../utils/common';

export default class FastSearch {
  constructor() {
    this.mover_ = new CardMover();
    this.resolver_ = new CardResolver();
    this.hasher_ = new FastHash();
    this.visited_ = {};
    this.bestMoves_ = {};
    this.worstMoves_ = {};
  }

  set order(order) {
    this.order_ = order;
    this.mover_.order = order;
    this.hasher_.order = order;
  }

  set initState(initState) {
    this.resolver_.setInitialState(initState);
    const complexity = _.minZero(gs.cards(initState.player).length *
                                 gs.cards(initState.enemy).length - 50);
    this.accuracy_ = 16 - Math.min(11, Math.sqrt(complexity) * 2) | 0;
    console.log('Solving', complexity, this.accuracy_);
  }

  solve(state, depth = 0) {
    this.visited_ = {};
    if (window.d) console.log('SOLVE!');
    return this.getResult_(state, depth);
  }

  getResult_(state, depth) {
    // TODO: Don't clone last state, can just directly mutate it.
    // TODO: Look ahead to see if any moves result in a 1 so we can prune early.
    // TODO: Implement steal - need to keep track of enemy deck?
    const hash = this.hasher_.hash(state, depth);
    const enemyCard = this.order_.enemyDraws[depth];
    const bestMove = this.bestMoves_[hash];
    if (bestMove != undefined) {
      const moveHash = this.hasher_.hashMove(hash, bestMove);
      if (window.d) {
        console.log(p.depth(depth), depth, '->',
                    p.card(bestMove), 'vs', p.card(enemyCard),
                    p.cards(state.player.hand));
      }
      const result = this.getResultForMove_(
          state, bestMove, enemyCard, hash, moveHash, depth);
      return result;
    }

    const hand = _.uniq(state.player.hand, true);
    const len = hand.length;
    const indexes = _.range(len);
    _.shuffleInPlace(indexes);

    if (window.d) {
      console.log(p.depth(depth), depth, '?', p.card(enemyCard),
                  p.cards(state.player.hand));
    }

    for (let i = 0; i < len; i++) {
      const playerCard = hand[indexes[i]];
      const moveHash = this.hasher_.hashMove(hash, playerCard);
      if (this.worstMoves_[moveHash] > this.accuracy_ * 4) continue;

      if (window.d) {
        console.log(p.depth(depth), depth, 'trying',
                    p.card(playerCard), this.bestMoves_[moveHash]);
      }
      const result = this.getResultForMove_(
          state, playerCard, enemyCard, hash, moveHash, depth);
      if (result) {
        this.updateBestMoves_(
            state, playerCard, enemyCard, hash, moveHash, depth);
        return 1;
      }
      this.updateWorstMoves_(
          state, playerCard, enemyCard, hash, moveHash, depth);
    }
    return 0;
  }

  getResultForMove_(state, playerCard, enemyCard, hash, moveHash, depth) {
    if (this.visited_[moveHash]) return 0;
    this.visited_[moveHash] = true;
    const result = this.searchForResult_(
        state, playerCard, enemyCard, hash, depth);
    if (window.d) {
      console.log(p.depth(depth), depth, 'R ', result, '=',
                  p.card(playerCard), 'vs',
                  p.card(enemyCard), p.cards(state.player.hand));
    }
    return result;
  }

  searchForResult_(state, playerCard, enemyCard, hash, depth) {
    const nextState = fs.clone(state);
    let result = this.resolver_.resolve(nextState, playerCard, enemyCard);
    if (result) {
      this.bestMoves_[hash] = playerCard;
    } else if (depth < fs.MAX_DEPTH && result == undefined) {
      const i = state.player.hand.indexOf(playerCard);
      this.mover_.moveCards(nextState, i, depth);
      // TODO: Check visited to see if nextState has a result?
      result = this.getResult_(nextState, depth + 1);
    }
    return result;
  }

  updateWorstMoves_(state, playerCard, enemyCard, hash, moveHash, depth) {
    const worstMove = this.worstMoves_[moveHash];
    if (worstMove == undefined) {
      this.worstMoves_[moveHash] = 1;
    } else if (worstMove != -1) {
      this.worstMoves_[moveHash]++;
    }
  }

  updateBestMoves_(state, playerCard, enemyCard, hash, moveHash, depth) {
    this.worstMoves_[moveHash] = -1;
    if (this.bestMoves_[hash]) return;
    if (state.debug == p.card(enemyCard)) {
      console.log(p.card(playerCard), this.bestMoves_[moveHash]);
    }

    const bestMove = this.bestMoves_[moveHash];
    if (bestMove == undefined) {
      this.bestMoves_[moveHash] = 1;
    } else if (bestMove > this.accuracy_) {
      this.bestMoves_[hash] = playerCard;
    } else {
      this.bestMoves_[moveHash]++;
    }
  }
}
