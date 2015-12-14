import _ from '../utils/common';
import Node from './node';

export default class SelectionStrategy {
  static UTC_CONST = Math.SQRT2;

  selectChild(children, rootNode) {
    const parent = children[0].parent;
    //if (parent.generateChild) {
    //  if (0.01 / Math.pow(parent.childrenWeight, 2) > Math.random()) {
    //    return parent.generateChild();
    //  }
    //}

    if (children[0].type == Node.Type.CHANCE) {
      const child = _.sample(parent.nonuniqueChildren);
      if (!child.result) return child;
      // Select a child without a result.
      parent.nonuniqueChildren = parent.nonuniqueChildren.filter(child => {
        return !child.result;
      });
      if (parent.nonuniqueChildren.length == 0) {
        if (parent.generateChild) return parent.generateChild();
        this.throwNoChildrenError_(parent);
      }
      return _.sample(parent.nonuniqueChildren);
    }

    const selection = _.max(children, (child) => {
      if (child.bestResult <= parent.worstResult || child.result) {
        return -Infinity;
      }
      return child.wins + child.losses;
      //const randomness = Math.random() / 100;
      //const uct = this.uct_(
      //    child.wins, child.losses, rootNode.wins, rootNode.losses);
      ////child.selection = uct;
      //return uct + randomness;
    });
    return selection;
  }

  throwNoChildrenError_(parent) {
    console.log('Parent:', parent.uid,
                'W', parent.totalChildrenWeight, '=', parent.childrenWeight,
                parent.result, parent.bestResult + '/' + parent.worstResult);
    parent.children.forEach(c => {
      console.log('Child:', c.uid, c.result,
                  c.bestResult + '/' + c.worstResult);
    });
    throw new Error('Expected > 0 children');
  }

  // See https://en.wikipedia.org/wiki/Monte_Carlo_tree_search.
  uct_(wins, losses, totalWins, totalLosses) {
    const numSims = wins + losses || 1;
    if (wins == Infinity) return Number.MAX_SAFE_INTEGER / 10000;
    const totalNumSims = totalWins + totalLosses;
    return wins / numSims + SelectionStrategy.UTC_CONST *
        Math.sqrt(Math.log(totalNumSims) / numSims);
  }
}
