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

    'Flame I':   ['M'],
    'Flame II':  ['M', 'M/U'],
    'Flame III': ['M', 'M/U', 'M/P'],
    'Flame IV':  ['M', 'M/U', 'M/P', 'M/M'],
    'Flame V':   ['M', 'M/U', 'M/P', 'M/M', 'M/M/M'],

    'Armed I':   ['P'],
    'Armed II':  ['P', 'P/DI'],
    'Armed III': ['P', 'P/DI', 'P/P/BP'],
    'Armed IV':  ['P', 'P/DI', 'P/P/BP', 'P/P/U'],
    'Armed V':   ['P', 'P/DI', 'P/P/BP', 'P/P/U', 'P/P/P/BP/BP'],

    'Irritable I':   ['P/-H'],
    'Irritable II':  ['P/-H', 'P/P/-H'],
    'Irritable III': ['P/-H', 'P/P/-H', 'P/P/-H'],
    'Irritable IV':  ['P/-H', 'P/P/-H', 'P/P/-H', 'P/P/P/-H'],
    'Irritable V':   ['P/-H', 'P/P/-H', 'P/P/-H', 'P/P/P/-H', 'P/P/P/-H'],

    'Death I':   ['M'],
    'Death II':  ['M', 'M/BM'],
    'Death III': ['M', 'M/BM', 'M/M/BM'],
    'Death IV':  ['M', 'M/BM', 'M/M/BM', 'M/M/U'],
    'Death V':   ['M', 'M/BM', 'M/M/BM', 'M/M/U', 'M/M/DI'],

    // Item sets.
    'Stupidity I':  ['?'],
    'Stupidity II': ['?', '?'],
  },

  players: {
    // Dungeoneers.
    'Chump': {
      sets: ['Chump'],
      health: 5,
    },

    // Enemies.
    'Fire Imp': {
      sets: ['Flame III', 'Stupidity I'],
      health: 5,
    },
    'Giant Bat': {
      sets: ['Spooky III', 'Feral II'],
      health: 4,
    },
    'Goblin': {
      sets: ['Armed II', 'Irritable III'],
      health: 6,
    },
    'Gray Ooze': {
      sets: ['Flame II', 'Spooky II', 'Death I'],
      health: 7,
      traits: ['Mundane'],
    },
    'Nasty Rat': {
      sets: ['Nature II', 'Feral II'],
      health: 5,
    },
    'Scary Spider': {
      sets: ['Nature II', 'Spooky III'],
      health: 6,
      traits: ['Frail'],
    },
  },
};
