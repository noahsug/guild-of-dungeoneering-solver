import _ from '../../utils/common';

export default class Inspector {
  static inspect(solver) {
    const inspector = new Inspector();
    inspector.inspect(solver);
    return inspector;
  }

  inspect(solver) {
    this.breakdown = this.getBreakdown_(solver.record);
  }

  getBreakdown_(record) {
    const breakdown = {};
    record.forEach((r) => {
      const byHand = this.addPlayerHand_(breakdown, r);
      this.addEnemyCard_(byHand.byEnemyCard, r);
    });

    // Sort by result.
    _.each(breakdown, (byHand) => {
      byHand.byEnemyCard = this.sortByResult_(byHand.byEnemyCard);
    });
    return this.sortByResult_(breakdown);
  }

  addPlayerHand_(breakdown, r) {
    const hash = JSON.stringify(r.state.player.hand);
    let entry = breakdown[hash];
    if (!entry) {
      entry = {
        state: r.state,
        sum: 0,
        count: 0,
        byEnemyCard: {},
      };
      breakdown[hash] = entry;
    }
    entry.sum += r.result;
    entry.count++;
    entry.result = entry.sum / entry.count;
    return entry;
  }

  addEnemyCard_(byEnemyCard, r) {
    let entry = byEnemyCard[r.enemyCard];
    if (!entry) {
      entry = {
        card: r.enemyCard,
        sum: 0,
        count: 0,
      };
      byEnemyCard[r.enemyCard] = entry;
    }
    entry.sum += r.result;
    entry.count++;
    entry.result = entry.sum / entry.count;
  }

  sortByResult_(breakdown) {
    return _.sortBy(_.values(breakdown), (b) => {
      return -b.result;
    });
  }
}
