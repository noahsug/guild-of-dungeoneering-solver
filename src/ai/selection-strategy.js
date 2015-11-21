import _ from '../utils/common';

export default class SelectionStrategy {
  selectChild(children, rootNode) {
    return _.max(children, (child) => {
      const randomness = Math.random() / 100;
      const numSims = child.wins + child.losses;
      if (children[0].type == 'chance') {
        if (numSims == 0) return 2 + randomness;
        return 1 / numSims + randomness;
      }

      const uct = this.uct_(
          child.wins, child.losses, rootNode.wins, rootNode.losses);
      //child.selection = uct;
      return uct + randomness;
    });
  }

  // See https://en.wikipedia.org/wiki/Monte_Carlo_tree_search.
  uct_(wins, losses, totalWins, totalLosses) {
    const numSims = wins + losses;
    if (wins == Infinity || numSims == 0) {
      return Number.MAX_SAFE_INTEGER / 10000;
    }
    const totalNumSims = totalWins + totalLosses;
    return wins / numSims +
        Math.SQRT2 * Math.sqrt(Math.log(totalNumSims) / numSims);
  }
}
