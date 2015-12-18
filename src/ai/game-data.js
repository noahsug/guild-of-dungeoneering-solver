export default {
  CARD_ATTRS: {
    'H': 'heal',
    'HPD': 'healPerDmg',
    'HID': 'healIfDmg',
    'Di': 'discardIfDmg',
    'P': 'physical',
    'M': 'magic',
    'Q': 'quick',
    'B': 'block',
    'BP': 'blockPhysical',
    'BM': 'blockMagic',
    'U': 'unblockable',
    '?': 'stupidity',
    '-H': 'selfDmg',

    'C': 'cycle',
    'S': 'steal',
    'SPB': 'stealPerBlock',
    'SID': 'stealIfDmg',
    'MRID': 'magicRoundIfDmg',
    'PRID': 'physicalRoundIfDmg',
    'MN': 'magicNext',
    'PN': 'physicalNext',
    'HPB': 'healPerBlock',
    'BMA': 'blockMagicAll',
    'BPA': 'blockPhysicalAll',
    'BA': 'blockAll',
    'H6': 'healthSix',
    'PVU': 'physicalVsUnblockable',
    'D': 'draw',
    'Co': 'conceal',
    'CoID': 'concealIfDmg',
  },

  sets: {
    // Player sets
    'Chump': ['P', 'P', 'P', 'P/P', 'B', 'B'],

    // Enemy sets
    'Feral I':   ['P/U'],
    'Feral II':  ['P/U', 'P/U'],
    'Feral III': ['P/U', 'P/U', 'P/P/BM'],
    'Feral IV':  ['P/U', 'P/U', 'P/P/BM', 'P/P/BM'],
    'Feral V':   ['P/U', 'P/U', 'P/P/BM', 'P/P/BM', 'P/P/P'],

    'Nature I':   ['P'],
    'Nature II':  ['P', 'P/Di'],
    'Nature III': ['P', 'P/Di', 'M/HID/HID'],
    'Nature IV':  ['P', 'P/Di', 'M/HID/HID', 'P/M/M'],

    'Spooky I':   ['M/BP'],
    'Spooky II':  ['M/BP', 'M/HPD'],
    'Spooky III': ['M/BP', 'M/HPD', 'M/HPD'],
    'Spooky IV':  ['M/BP', 'M/HPD', 'M/HPD', 'M/M/BP/BP'],
    'Spooky V':   ['M/BP', 'M/HPD', 'M/HPD', 'M/M/BP/BP', 'M/M/HPD'],

    'Flame I':   ['M'],
    'Flame II':  ['M', 'M/U'],
    'Flame III': ['M', 'M/U', 'M/P'],
    'Flame IV':  ['M', 'M/U', 'M/P', 'M/M'],
    'Flame V':   ['M', 'M/U', 'M/P', 'M/M', 'M/M/M'],

    'Armed I':   ['P'],
    'Armed II':  ['P', 'P/Di'],
    'Armed III': ['P', 'P/Di', 'P/P/BP'],
    'Armed IV':  ['P', 'P/Di', 'P/P/BP', 'P/P/U'],
    'Armed V':   ['P', 'P/Di', 'P/P/BP', 'P/P/U', 'P/P/P/BP/BP'],

    'Burly I':   ['P/P/BP'],
    'Burly II':  ['P/P/BP', 'P/P/P'],
    'Burly III': ['P/P/BP', 'P/P/P', 'BP/BP/H/H'],
    'Burly IV':  ['P/P/BP', 'P/P/P', 'BP/BP/H/H', 'P/P/P/P'],

    'Irritable I':   ['P/-H'],
    'Irritable II':  ['P/-H', 'P/P/-H'],
    'Irritable III': ['P/-H', 'P/P/-H', 'P/P/-H'],
    'Irritable IV':  ['P/-H', 'P/P/-H', 'P/P/-H', 'P/P/P/-H'],
    'Irritable V':   ['P/-H', 'P/P/-H', 'P/P/-H', 'P/P/P/-H', 'P/P/P/-H'],

    'Death I':   ['M'],
    'Death II':  ['M', 'M/BM'],
    'Death III': ['M', 'M/BM', 'M/M/BM'],
    'Death IV':  ['M', 'M/BM', 'M/M/BM', 'M/M/U'],
    'Death V':   ['M', 'M/BM', 'M/M/BM', 'M/M/U', 'M/M/Di'],

    'Demonic I':   ['M/M/BM'],
    'Demonic II':  ['M/M/BM', 'M/M/M'],
    'Demonic III': ['M/M/BM', 'M/M/M', 'M/M/M/BM'],
    'Demonic IV':  ['M/M/BM', 'M/M/M', 'M/M/M/BM', 'M/M/M/M'],

    'Aquatic I':   ['M/M/C'],
    'Aquatic II':  ['M/M/C', 'BM/BM/C'],
    'Aquatic III': ['M/M/C', 'BM/BM/C', 'M/M/BM/BM'],
    'Aquatic IV':  ['M/M/C', 'BM/BM/C', 'M/M/BM/BM', 'M/M/M/C/C'],

    'Electrical I':   ['M/Di'],
    'Electrical II':  ['M/Di', 'M/U'],
    'Electrical III': ['M/Di', 'M/U', 'M/M/Di'],
    'Electrical IV':  ['M/Di', 'M/U', 'M/M/Di', 'M/M/U'],

    'Ghoulish I':   ['M/M'],
    'Ghoulish II':  ['M/M', 'M/M/M/BP'],
    'Ghoulish III': ['M/M', 'M/M/M/BP', 'M/M/HPD'],
    'Ghoulish IV':  ['M/M', 'M/M/M/BP', 'M/M/HPD', 'M/M/HPD'],

    'Gunnery I':   ['P/P/U'],
    'Gunnery II':  ['P/P/U', 'BP/BP/PN'],
    'Gunnery III': ['P/P/U', 'BP/BP/PN', 'BP/BP/PN'],
    'Gunnery IV':  ['P/P/U', 'BP/BP/PN', 'BP/BP/PN', 'P/Co'],
    'Gunnery V ':  ['P/P/U', 'BP/BP/PN', 'BP/BP/PN', 'P/Co', 'P/P/P/P'],

    'Pickpocket I':   ['BP/SPB'],
    'Pickpocket II':  ['BP/SPB', 'P/P/SID'],
    'Pickpocket III': ['BP/SPB', 'P/P/SID', 'H/S'],
    'Pickpocket IV':  ['BP/SPB', 'P/P/SID', 'H/S', 'BP/BP/SPB'],

    'Rage I':   ['P/P/U'],
    'Rage II':  ['P/P/U', 'P/P/P/-H'],
    'Rage III': ['P/P/U', 'P/P/P/-H', 'P/P/P/-H'],
    'Rage IV':  ['P/P/U', 'P/P/P/-H', 'P/P/P/-H', 'P/P/P/P/-H'],

    'Sorcery I':   ['M/M/HID'],
    'Sorcery II':  ['M/M/HID', 'M/M/Di'],
    'Sorcery III': ['M/M/HID', 'M/M/Di', 'M/M/M/CoID'],
    'Sorcery IV':  ['M/M/HID', 'M/M/Di', 'M/M/M/CoID', 'M/M/M/M'],

    'Venom I':   ['P/P'],
    'Venom II':  ['P/P', 'P/P/U'],
    'Venom III': ['P/P', 'P/P/U', 'P/P/M'],
    'Venom IV':  ['P/P', 'P/P/U', 'P/P/M', 'P/P/PRID'],

    // Item sets
    'Fire I':   ['M/M'],
    'Fire II':  ['M/M', 'M/M/Q'],
    'Fire III': ['M/M', 'M/M/Q', 'M/MRID'],
    'Fire IV':  ['M/M', 'M/M/Q', 'M/MRID', 'M/M/M/M/U'],

    'Stupidity I ':  ['?'],
    'Stupidity II ': ['?', '?'],
    'Stupidity III': ['?', '?', '?'],
    'Stupidity IV ': ['?', '?', '?', '?'],

    'Growth I':   ['M/H'],
    'Growth II':  ['M/H', 'M/HID/HID'],
    'Growth III': ['M/H', 'M/HID/HID', 'H6/Q'],
    'Growth IV':  ['M/H', 'M/HID/HID', 'H6/Q', 'M/M/H/H/H'],

    'Swift I':   ['P/Q/D'],
    'Swift II':  ['P/Q/D', 'P/Q/BM/BM'],
    'Swift III': ['P/Q/D', 'P/Q/BM/BM', 'P/P/U/Q'],
    'Swift IV':  ['P/Q/D', 'P/Q/BM/BM', 'P/P/U/Q', 'BA/D/D'],

    'Armour I':   ['BP/BP/BP'],
    'Armour II':  ['BP/BP/BP', 'P/P/BP'],
    'Armour III': ['BP/BP/BP', 'P/P/BP', 'BA/D'],
    'Armour IV':  ['BP/BP/BP', 'P/P/BP', 'BA/D', 'BPA/PN/PN'],

    'Blade I':   ['P/P'],
    'Blade II':  ['P/P', 'P/P/PVU'],
    'Blade III': ['P/P', 'P/P/PVU', 'P/P/P/BM'],
    'Blade IV':  ['P/P', 'P/P/PVU', 'P/P/P/BM', 'P/P/PRID'],

    'Crush I':   ['P/BP'],
    'Crush II':  ['P/BP', 'P/P/U'],
    'Crush III': ['P/BP', 'P/P/U', 'P/P/P/BP'],
    'Crush IV':  ['P/BP', 'P/P/U', 'P/P/P/BP', 'P/P/P/P/BP/BP'],

    'Arcane I':   ['M/D'],
    'Arcane II':  ['M/D', 'MN/H/D'],
    'Arcane III': ['M/D', 'MN/H/D', 'M/M/M/U'],
    'Arcane IV':  ['M/D', 'MN/H/D', 'M/M/M/U', 'H/H/H/D/D'],

    'Holy I':   ['B/HPB'],
    'Holy II':  ['B/HPB', 'M/M/BM'],
    'Holy III': ['B/HPB', 'M/M/BM', 'B/B/HPB'],
    'Holy IV':  ['B/HPB', 'M/M/BM', 'B/B/HPB', 'M/M/M/BMA'],
  },

  players: {
    // Dungeoneers
    'Chump': {
      sets: ['Chump'],
      health: 5,
    },

    // Enemies

    // - Grasslands 1
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

    // - Grasslands 2
    'Mimic': {
      sets: ['Death III', 'Irritable III', 'Feral III'],
      health: 7,
    },
    'Rat Man': {
      sets: ['Armed III', 'Irritable III', 'Feral II'],
      health: 6,
    },
    'Snake': {
      sets: ['Death II', 'Feral IV', 'Nature III'],
      health: 7,
    },
  },

  items: {
    // Body
    // - C1
    'Straightjacket': {
      traits: ['+1HP'],
    },
    'Ruffled Shirt': {
      sets: ['Swift I'],
    },
    'Barrel': {
      sets: ['Stupidity I'],
      traits: ['+1HP'],
    },
    // - C2
    'Tattered Mail': {
      sets: ['Armour I', 'Stupidity I'],
      traits: ['+1HP'],
    },
    'Shimmering Cloak': {
      sets: ['Arcane I', 'Fire I'],
    },
    // - C3
    'Red Mail': {
      sets: ['Armour I'],
      traits: ['+1HP'],
    },
    'Bone Armour': {
      sets: ['Arcane I'],
      traits: ['+1HP'],
    },
    // - U1
    'Sash': {
      sets: ['Swift I', 'Growth I'],
    },
    // - U2
    'Mage Robes': {
      sets: ['Fire I', 'Arcane I, Holy I'],
    },
    'Corset': {
      sets: ['Armour I', 'Growth I'],
    },
    // - U3
    'Wolf Pelt': {
      sets: ['Growth II'],
      traits: ['+1HP'],
    },
    'Scale Mail': {
      sets: ['Armour I'],
      traits: ['+2HP'],
    },
    // - R1
    'Bark Vest': {
      sets: ['Growth I', 'Stupidity I'],
      traits: ['Tenacious'],
    },
    'Fish Scale Cowl': {
      sets: ['Arcane I'],
      traits: ['+1HP'],
    },
    // - R2
    'Seafarers Brace': {
      sets: ['Armour I', 'Arcane I'],
      traits: ['Retribution'],
    },
    // - R3
    'Doom Plate': {
      sets: ['Armour I'],
      traits: ['Bulwark'],
    },
    'Padded Vest': {
      sets: ['Arcane II', 'Armour I'],
    },
    // - E3
    'Dragon Scale': {
      sets: ['Armour III', 'Fire II'],
    },
    'Coat Of Thorns': {
      sets: ['Armour II', 'Growth I'],
      traits: ['Spikey'],
    },
    'Long Coat': {
      sets: ['Swift II'],
      traits: ['Showoff'],
    },
  },
};
