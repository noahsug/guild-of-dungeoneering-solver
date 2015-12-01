import _ from '../utils/common';

export default class SelectionStrategy {
  selectChild(children, rootNode) {
    const parent = children[0].parent;
    if (parent.generateChild) {
      if (1 / Math.pow(parent.childrenWeight, 2) > Math.random()) {
        return parent.generateChild();
      }
    }

    if (children[0].type == 'chance') {
      const child = _.sample(parent.nonuniqueChildren);
      if (!child.result) return child;
      // Select a child without a result.
      parent.nonuniqueChildren = parent.nonuniqueChildren.filter(child => {
        return !child.result;
      });
      if (parent.nonuniqueChildren.length == 0) {
        if (parent.generateChild) return parent.generateChild();
        throw new Error('Expected > 0 children');
      }
      return _.sample(parent.nonuniqueChildren);
    }

    return _.max(children, (child) => {
      if (child.bestResult <= parent.worstResult || child.result) {
        return -Infinity;
      }
      const randomness = Math.random() / 100;
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
