import results from './results';
import gameData from './game-data';
import _ from '../utils/common';

export default class ResultAccessor {
  get(player, enemy) {
    return (this.getResultObj_(player, enemy) || {}).result;
  }

  getResultObj_(player, enemy) {
    return _.find(results, (r) => {
      return this.playerEquals_(r.player, player) &&
          this.playerEquals_(r.enemy, enemy);
    });
  }

  playerEquals_(player1, player2) {
    return player1.name == player2.name &&
      _.arrayEquals((player1.sets || []).sort(),
                    (player2.sets || []).sort()) &&
      _.arrayEquals((player1.traits || []).sort(),
                    (player2.traits || []).sort()) &&
      _.arrayEquals((player1.items || []).sort(),
                    (player2.items || []).sort());
  }

  save(player, enemy, result) {
    let resultObj = this.getResultObj_(player, enemy);
    if (!resultObj) {
      resultObj = {
        player: this.buildPlayerObj_(player),
        enemy: this.buildPlayerObj_(enemy),
      };
      results.push(resultObj);
    } else if (!_.floatEquals(resultObj.result, result, 0.000001)) {
      console.warn('Updating result from ', resultObj.result, 'to', result,
                   'for player:', player, 'enemy:', enemy);
    }
    resultObj.result = result;
  }

  buildPlayerObj_(player) {
    const obj = {name: player.name};
    if (player.sets && player.sets.length) {
      obj.sets = player.sets.sort().slice();
    }
    if (player.traits && player.traits.length) {
      obj.traits = player.traits.sort().slice();
    }
    if (player.items && player.items.length) {
      obj.items = player.items.sort().slice();
    }
    return obj;
  }
}
