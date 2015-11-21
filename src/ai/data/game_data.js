export default {
  CARD_ATTRS: {
    'H': 'heal',
    'HP': 'healPerDmg',
    'HI': 'healIfDmg',
    'DI': 'discardIfDmg',
    'P': 'physical',
    'M': 'magic',
    'Q': 'quick',
    'B': 'block',
    'BP': 'blockPhysical',
    'BM': 'blockMagic',
    'U': 'unblockable',
    '?': 'stupidity',
    '-H': 'selfDmg',
  },

  sets: {
    // Player sets.
    'Chump': ['P', 'P', 'P', 'P/P', 'B', 'B'],

    // Enemy sets.
    'Feral I':   ['P/U'],
    'Feral II':  ['P/U', 'P/U'],
    'Feral III': ['P/U', 'P/U', 'P/P/BM'],
    'Feral IV':  ['P/U', 'P/U', 'P/P/BM', 'P/P/BM'],
    'Feral V':   ['P/U', 'P/U', 'P/P/BM', 'P/P/BM', 'P/P/P'],

    'Nature I':   ['P'],
    'Nature II':  ['P', 'P/DI'],
    'Nature III': ['P', 'P/DI', 'M/HI/HI'],
    'Nature IV':  ['P', 'P/DI', 'M/HI/HI', 'P/M/M'],

    'Spooky I':   ['M/BP'],
    'Spooky II':  ['M/BP', 'M/HP'],
    'Spooky III': ['M/BP', 'M/HP', 'M/HP'],
    'Spooky IV':  ['M/BP', 'M/HP', 'M/HP', 'M/M/BP/BP'],
    'Spooky V':   ['M/BP', 'M/HP', 'M/HP', 'M/M/BP/BP', 'M/M/HP'],
  },

  players: {
    // Dungeoneers.
    'Chump': {
      sets: ['Chump'],
      health: 5,
    },

    // Enemies.
    'Nasty Rat': {
      sets: ['Nature II', 'Feral II'],
      health: 5,
    },
    'Giant Bat': {
      sets: ['Spooky III', 'Feral II'],
      health: 4,
    },
  },
};
