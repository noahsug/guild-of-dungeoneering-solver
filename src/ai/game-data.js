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
    'D': 'draw',
    'Co': 'conceal',
    'CoID': 'concealIfDmg',
    'H6': 'healthSix',
    'PVU': 'physicalVsUnblockable',
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

    // Cove - 1
    'Deckhand': {
      health: 7,
      sets: ['Armed III', 'Rage III', 'Stupidity I'],
    },
    'Eel': {
      health: 6,
      sets: ['Electrical III', 'Aquatic II', 'Nature I', 'Venom III'],
    },
    'Mermaid': {
      health: 7,
      sets: ['Aquatic III', 'Irritable V', 'Feral V'],
      traits: ['Mundane'],
    },
    'Oarsman': {
      health: 5,
      sets: ['Armed V', 'Rage II', 'Irritable IV'],
      traits: ['Fury'],
    },
    'One-Headed Monkey': {
      health: 6,
      sets: ['Feral III', 'Irritable III', 'Pickpocket III'],
    },
    // Cove - 2
    'Cabin Boy': {
      health: 7,
      sets: ['Armed III', 'Irritable III', 'Stupidity I'],
      traits: ['Mundane'],
    },
    'Giant Crab': {
      health: 9,
      sets: ['Spooky II', 'Armed V', 'Aquatic III', 'Nature I'],
      traits: ['Tough'],
    },
    'Gunner': {
      health: 7,
      sets: ['Armed III', 'Burly II', 'Rage II', 'Gunnery IV'],
      traits: ['Spikey', 'Rum'],
    },
    'Hermit Crab': {
      health: 9,
      sets: ['Armed IV', 'Aquatic III', 'Nature I'],
      traits: ['Tough'],
    },
    'Merman': {
      health: 8,
      sets: ['Aquatic IV', 'Irritable V', 'Feral V'],
      traits: ['Mundane'],
    },
    'Sea Monkey': {
      health: 8,
      sets: ['Feral III', 'Irritable II', 'Pickpocket III', 'Aquatic III', 'Electrical I'],
    },
    'Werecrab Mage': {
      health: 9,
      sets: ['Spooky III', 'Sorcery III', 'Aquatic II', 'Electrical IV'],
      traits: ['Frail'],
    },
    // Cove - 3
    'Ancient Mariner': {
      health: 10,
      sets: ['Armed III', 'Irritable III', 'Stupidity I'],
      traits: ['Decay', 'Rum'],
    },
    'Buccaneer': {
      health: 9,
      sets: ['Armed II', 'Rage IV'],
      traits: ['Fury', 'Aggressive', 'Crewmate'],
    },
    'Cranky Parrot': {
      health: 9,
      sets: ['Feral V', 'Pickpocket II', 'Nature I', 'Stupidity II'],
      traits: ['Ferocious'],
    },
    'First Mate': {
      health: 9,
      sets: ['Armed II', 'Burly III', 'Gunnery II', 'Irritable III', 'Pickpocket II'],
      traits: ['Crewmate'],
    },
    'Flaming Gallah': {
      health: 9,
      sets: ['Flame IV', 'Feral V', 'Rage I', 'Nature I', 'Pickpocket III'],
      traits: ['Burn', 'Ferocious'],
    },
    'Ghost Pirate': {
      health: 10,
      sets: ['Sorcery III', 'Death II', 'Pickpocket II'],
      traits: ['Bulwark', 'Aggressive'],
    },
    'Master Gunner': {
      health: 14,
      sets: ['Gunnery V', 'Burly II', 'Armed II', 'Rage II'],
      traits: ['Tough', 'Spikey', 'Aggressive'],
    },
    'Pearl Guard': {
      health: 10,
      sets: ['Feral III', 'Irritable II', 'Aquatic IV'],
    },
    'Pirate': {
      health: 8,
      sets: ['Armed III', 'Rage II', 'Pickpocket I'],
      traits: ['Aggressive', 'Rum', 'Crewmate'],
    },
    'Ships Cook': {
      health: 9,
      sets: ['Pickpocket III', 'Rage II', 'Irritable II', 'Burly II'],
      traits: ['Fury', 'Rum', 'Respite'],
    },
    'Three-Headed Monkey': {
      health: 10,
      sets: ['Irritable V', 'Burly IV', 'Feral III', 'Nature I'],
      traits: ['Aggressive', 'Bulwark', 'Fury', 'Mundane'],
    },
    'Werecrab': {
      health: 10,
      sets: ['Spooky II', 'Armed IV', 'Nature I'],
      traits: ['Tough'],
    },
    // Cove - 4
    'Bullseye Bill': {
      health: 12,
      sets: ['Irritable V', 'Burly III', 'Gunnery II', 'Armed II', 'Pickpocket II'],
      traits: ['Bulwark', 'Crewmate'],
    },
    'Captain Rosalita': {
      health: 14,
      sets: ['Rage II', 'Irritable IV', 'Pickpocket IV', 'Armed IV'],
      traits: ['Skilled', 'Crewmate'],
    },
    'Cleaver Joe': {
      health: 13,
      sets: ['Flame II', 'Rage II', 'Irritable III', 'Burly II', 'Pickpocket III'],
      traits: ['Fury', 'Rum', 'Respite'],
    },
    'Crab King': {
      health: 12,
      sets: ['Spooky IV', 'Armed V', 'Nature I'],
      traits: ['Tough', 'Spikey', 'Leader'],
    },
    'Fishbone': {
      health: 15,
      sets: ['Feral III', 'Electrical II', 'Aquatic IV'],
    },
    'Grey Beard': {
      health: 14,
      sets: ['Armed IV', 'Irritable IV', 'Stupidity I'],
      traits: ['Decay', 'Rum'],
    },
    'Quartermaster': {
      health: 14,
      sets: ['Armed V', 'Irritable IV', 'Burly III'],
      traits: ['Spikey', 'Rum', 'Respite'],
    },
    'Reverse Mermaid': {
      health: 9,
      sets: ['Aquatic III', 'Armed V', 'Spooky II', 'Nature I'],
      traits: ['Aggressive', 'Decay'],
    },
    'Skeleton Pirate': {
      health: 15,
      sets: ['Death II', 'Spooky II', 'Ghoulish III', 'Pickpocket I'],
      traits: ['Brittle', 'Aggressive', 'Crewmate'],
    },
    'Angry Bunny': {
      health: 14,
      sets: ['Demonic IV', 'Burly IV', 'Rage IV', 'Irritable V', 'Feral V'],
      traits: ['Fury', 'Skilled', 'Mundane'],
    },
    // Grasslands - 0
    'Rubber Ducky': {
      health: 4,
      sets: ['Irritable II', 'Stupidity I'],
    },
    // Grasslands - 1
    'Fire Imp': {
      health: 5,
      sets: ['Flame III', 'Stupidity I'],
      traits: ['Night Owl'],
    },
    'Giant Bat': {
      health: 4,
      sets: ['Spooky III', 'Feral II'],
      traits: ['Loner'],
    },
    'Goblin': {
      health: 6,
      sets: ['Armed II', 'Irritable III'],
    },
    'Gray Ooze': {
      health: 7,
      sets: ['Flame II', 'Spooky II', 'Death I'],
      traits: ['Mundane'],
    },
    'Nasty Rat': {
      health: 5,
      sets: ['Nature II', 'Feral II'],
    },
    'Scary Spider': {
      health: 6,
      sets: ['Nature II', 'Spooky III'],
      traits: ['Frail'],
    },
    // Grasslands - 2
    'Ghost': {
      health: 5,
      sets: ['Death III', 'Spooky IV'],
      traits: ['Tenacious', 'Night Owl'],
    },
    'Gnoll': {
      health: 6,
      sets: ['Nature II', 'Irritable III', 'Armed II'],
      traits: ['Fury'],
    },
    'Mimic': {
      health: 7,
      sets: ['Death III', 'Irritable III', 'Feral III'],
    },
    'Rat Man': {
      health: 6,
      sets: ['Armed III', 'Irritable III', 'Feral II'],
    },
    'Skeleton': {
      health: 8,
      sets: ['Armed III', 'Irritable II', 'Spooky III'],
      traits: ['Brittle'],
    },
    'Snake': {
      health: 7,
      sets: ['Death II', 'Feral IV', 'Nature III'],
    },
    'Zombie': {
      health: 9,
      sets: ['Death III', 'Irritable III', 'Spooky III'],
      traits: ['Decay'],
    },
    // Grasslands - 3
    'Bandito': {
      health: 7,
      sets: ['Armed V'],
      traits: ['Loner'],
    },
    'Bear Owl': {
      health: 7,
      sets: ['Nature III', 'Armed III', 'Feral II'],
      traits: ['Fury'],
    },
    'Fire Elemental': {
      health: 8,
      sets: ['Flame IV', 'Death IV'],
      traits: ['Burn'],
    },
    'Minotaur': {
      health: 10,
      sets: ['Armed IV', 'Irritable V'],
      traits: ['Fury', 'Decay'],
    },
    'Mummy': {
      health: 9,
      sets: ['Death III', 'Irritable III', 'Spooky IV'],
      traits: ['Brittle'],
    },
    'Scorpion': {
      health: 8,
      sets: ['Nature IV', 'Armed IV', 'Feral IV'],
    },
    'Shade': {
      health: 7,
      sets: ['Death V', 'Spooky IV'],
      traits: ['Tenacious', 'Night Owl'],
    },
    'Sorceress': {
      health: 7,
      sets: ['Death III', 'Flame IV'],
    },
    // Grasslands - 4
    'Black knight': {
      health: 10,
      sets: ['Armed V', 'Death V'],
      traits: ['Mundane'],
    },
    'Embro': {
      health: 10,
      sets: ['Irritable V', 'Armed V', 'Flame V'],
      traits: ['Skilled'],
    },
    'Lich': {
      health: 13,
      sets: ['Death V', 'Spooky V'],
      traits: ['Frail'],
    },
    'Eye Beast': {
      health: 11,
      sets: ['Death V', 'Flame V'],
      traits: ['Frail'],
    },
    'Mimic Queen': {
      health: 11,
      sets: ['Death V', 'Irritable V', 'Feral IV'],
      traits: ['Brittle'],
    },
    'Orc Warlord': {
      health: 11,
      sets: ['Armed V', 'Irritable V', 'Stupidity II'],
      traits: ['Predictable'],
    },
    'Rat King': {
      health: 7,
      sets: ['Armed III', 'Irritable III', 'Feral III'],
      traits: ['Leader'],
    },
    // Jungle - 1
    'Bloodstarved Bat': {
      health: 6,
      sets: ['Rage II', 'Spooky II'],
      traits: ['Predictable'],
    },
    'Frenzied Goblin': {
      health: 6,
      sets: ['Rage II', 'Armed II'],
      traits: ['Fury', 'Aggressive'],
    },
    'Jungle Warrior': {
      health: 6,
      sets: ['Burly II', 'Nature III'],
      traits: ['Leader'],
    },
    'Leggy Spider': {
      health: 7,
      sets: ['Venom III', 'Spooky II'],
      traits: ['Frail'],
    },
    'Pixies': {
      health: 5,
      sets: ['Nature II', 'Demonic I', 'Sorcery I'],
      traits: ['Tenacious', 'Thief'],
    },
    'Plague Rat': {
      health: 6,
      sets: ['Venom II', 'Feral II'],
      traits: ['Loner'],
    },
    // Jungle - 2
    'Harpy': {
      health: 8,
      sets: ['Demonic II', 'Feral III'],
    },
    'Hilly Gnoll': {
      health: 8,
      sets: ['Irritable I', 'Burly II', 'Armed II'],
      traits: ['Fury'],
    },
    'Lizardman': {
      health: 8,
      sets: ['Burly II', 'Nature III'],
      traits: ['Night Owl'],
    },
    'Maneating Plant': {
      health: 8,
      sets: ['Venom III', 'Stupidity I'],
    },
    'Poisonous Snake': {
      health: 8,
      sets: ['Venom II', 'Nature III'],
      traits: ['Wandering'],
    },
    'Rat Berserker': {
      health: 9,
      sets: ['Rage III', 'Armed III'],
      traits: ['Sluggish'],
    },
    // Jungle - 3
    'Air elemental': {
      health: 9,
      sets: ['Sorcery III', 'Irritable III'],
      traits: ['Bulwark', 'Wandering'],
    },
    'Dire Scorpion': {
      health: 8,
      sets: ['Burly II', 'Nature II'],
      traits: ['Bulwark'],
    },
    'Gargoyle': {
      health: 10,
      sets: ['Demonic III', 'Feral III'],
      traits: ['Brittle'],
    },
    'Jungle Shaman': {
      health: 8,
      sets: ['Flame III', 'Sorcery III'],
      traits: ['Leader'],
    },
    'Owl Bear': {
      health: 8,
      sets: ['Rage III', 'Nature II'],
      traits: ['Fury'],
    },
    'Worm': {
      health: 9,
      sets: ['Ghoulish II', 'Venom III', 'Stupidity II'],
      traits: ['Tenacious', 'Night Owl'],
    },
    // Jungle - 4
    'Chimera': {
      health: 9,
      sets: ['Venom II', 'Rage II', 'Feral II'],
      traits: ['Fury'],
    },
    'Dragon': {
      health: 11,
      sets: ['Flame V', 'Demonic II', 'Sorcery II'],
    },
    'Ettin': {
      health: 13,
      sets: ['Rage III', 'Stupidity I', 'Demonic II'],
      traits: ['Sluggish'],
    },
    'Medusa': {
      health: 8,
      sets: ['Venom III', 'Demonic II', 'Ghoulish II'],
      traits: ['Night Owl'],
    },
    'Ogre': {
      health: 13,
      sets: ['Burly III', 'Rage II', 'Stupidity II'],
      traits: ['Predictable'],
    },
    // Mines - 1
    'Albino Goblin': {
      health: 8,
      sets: ['Ghoulish II', 'Rage II', 'Irritable I'],
      traits: ['Tenacious', 'Night Owl'],
    },
    'Digger': {
      health: 8,
      sets: ['Burly III', 'Rage II'],
      traits: ['Brittle', 'Leader'],
    },
    'Dwarven Explosives': {
      health: 7,
      sets: ['Venom I', 'Demonic II', 'Sorcery I'],
      traits: ['Retribution'],
    },
    'Infected Slime': {
      health: 10,
      sets: ['Venom III', 'Ghoulish II'],
      traits: ['Decay'],
    },
    'Miner': {
      health: 6,
      sets: ['Burly III', 'Rage II'],
      traits: ['Fury', 'Leader'],
    },
    'Rust Monster': {
      health: 6,
      sets: ['Venom II', 'Burly II'],
      traits: ['Wandering'],
    },
    // Mines - 2
    'Blind Worm': {
      health: 11,
      sets: ['Stupidity I', 'Demonic II', 'Ghoulish III'],
      traits: ['Sluggish', 'Night Owl'],
    },
    'Clattering Bones': {
      health: 10,
      sets: ['Burly II', 'Demonic II', 'Ghoulish III'],
      traits: ['Brittle'],
    },
    'Gelatinous Cube': {
      health: 8,
      sets: ['Venom II', 'Demonic II'],
      traits: ['Tenacious'],
    },
    'Rotting Corpse': {
      health: 12,
      sets: ['Rage II', 'Burly II', 'Ghoulish II'],
      traits: ['Decay', 'Wandering'],
    },
    'Spider Drill': {
      health: 9,
      sets: ['Sorcery III', 'Burly II'],
      traits: ['Bulwark', 'Aggressive'],
    },
    'Wailing Ghost': {
      health: 7,
      sets: ['Sorcery II', 'Demonic II', 'Ghoulish III'],
      traits: ['Tenacious', 'Loner'],
    },
    // Mines - 3
    'Cave Troll': {
      health: 9,
      sets: ['Burly III', 'Rage IV', 'Irritable II'],
      traits: ['Fury', 'Aggressive'],
    },
    'Cursed Mummy': {
      health: 13,
      sets: ['Demonic I', 'Ghoulish IV', 'Irritable III'],
      traits: ['Brittle'],
    },
    'Earth Elemental': {
      health: 11,
      sets: ['Burly III', 'Demonic II'],
      traits: ['Brittle'],
    },
    'Genii': {
      health: 9,
      sets: ['Demonic II', 'Sorcery III'],
    },
    'Nymph': {
      health: 9,
      sets: ['Venom III', 'Sorcery III'],
      traits: ['Tenacious'],
    },
    'Vampire': {
      health: 9,
      sets: ['Demonic III', 'Ghoulish III'],
      traits: ['Leader'],
    },
    // Mines - 4
    'Cyclops': {
      health: 12,
      sets: ['Burly IV', 'Ghoulish II'],
      traits: ['Sluggish'],
    },
    'Dwarf Magnate': {
      health: 10,
      sets: ['Demonic II', 'Sorcery IV'],
      traits: ['Fury'],
    },
    'Dwarf Masterpiece': {
      health: 13,
      sets: ['Venom IV', 'Sorcery IV'],
      traits: ['Brittle'],
    },
    'Dwarf Mecha': {
      health: 14,
      sets: ['Burly IV', 'Sorcery III'],
      traits: ['Predictable', 'Frail'],
    },
    'Dwarf Sentry': {
      health: 12,
      sets: ['Burly III', 'Demonic II'],
      traits: ['Retribution'],
    },
    'Troll': {
      health: 14,
      sets: ['Venom III', 'Burly III'],
      traits: ['Fury', 'Mundane'],
    },
  },

  items: {
    // Body - C1
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
    // Body - C2
    'Tattered Mail': {
      sets: ['Armour I', 'Stupidity I'],
      traits: ['+1HP'],
    },
    'Shimmering Cloak': {
      sets: ['Arcane I', 'Fire I'],
    },
    // Body - C3
    'Red Mail': {
      sets: ['Armour I'],
      traits: ['+1HP'],
    },
    'Bone Armour': {
      sets: ['Arcane I'],
      traits: ['+1HP'],
    },
    // Body - U1
    'Sash': {
      sets: ['Swift I', 'Growth I'],
    },
    // Body - U2
    'Mage Robes': {
      sets: ['Fire I', 'Arcane I', 'Holy I'],
    },
    'Corset': {
      sets: ['Armour I', 'Growth I'],
    },
    // Body - U3
    'Wolf Pelt': {
      sets: ['Growth II'],
      traits: ['+1HP'],
    },
    'Scale Mail': {
      sets: ['Armour I'],
      traits: ['+2HP'],
    },
    // Body - R1
    'Bark Vest': {
      sets: ['Growth I', 'Stupidity I'],
      traits: ['Tenacious'],
    },
    'Fish Scale Cowl': {
      sets: ['Arcane I'],
      traits: ['+1HP'],
    },
    // Body - R2
    'Seafarers Brace': {
      sets: ['Armour I', 'Arcane I'],
      traits: ['Retribution'],
    },
    // Body - R3
    'Doom Plate': {
      sets: ['Armour I'],
      traits: ['Bulwark'],
    },
    'Padded Vest': {
      sets: ['Arcane II', 'Armour I'],
    },
    // Body - E3
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

    // Head
    'Pigeon Nest': {
      sets: ['Growth I'],
      slot: 'Head',
      rarity: 'C1',
    },
    'Paper Crown': {
      sets: ['Holy I'],
      slot: 'Head',
      rarity: 'C1',
    },
    'Newspaper Hat': {
      sets: ['Stupidity I'],
      traits: ['Wise'],
      slot: 'Head',
      rarity: 'C1',
    },
    'Sparkly Headband': {
      sets: ['Fire I', 'Holy I'],
      slot: 'Head',
      rarity: 'C2',
    },
    'Cooking Pot': {
      sets: ['Fire I', 'Crush I'],
      slot: 'Head',
      rarity: 'C2',
    },
    'Mail Coif': {
      sets: ['Stupidity II'],
      traits: ['+2HP'],
      slot: 'Head',
      rarity: 'C2',
    },
    'Bone Helmet': {
      sets: ['Arcane II'],
      slot: 'Head',
      rarity: 'C3',
    },
    'Feathered Cap': {
      sets: ['Growth II'],
      slot: 'Head',
      rarity: 'C3',
    },
    'Bandana': {
      sets: ['Armour I', 'Swift I'],
      slot: 'Head',
      rarity: 'U1',
    },
    'Soldiers Helmet': {
      traits: ['+1HP'],
      slot: 'Head',
      rarity: 'U1',
    },
    'Skull Cap': {
      sets: ['Armour II'],
      slot: 'Head',
      rarity: 'U2',
    },
    'Daisy Chain': {
      sets: ['Growth I'],
      traits: ['+1HP'],
      slot: 'Head',
      rarity: 'U2',
    },
    'Tricorne': {
      sets: ['Blade II'],
      slot: 'Head',
      rarity: 'U2',
    },
    'Masquerade Mask': {
      sets: ['Arcane I', 'Holy II'],
      slot: 'Head',
      rarity: 'U3',
    },
    'Spiky Hat': {
      sets: ['Blade II', 'Armour I'],
      slot: 'Head',
      rarity: 'R2',
    },
    'Fez': {
      sets: ['Arcane II'],
      traits: ['Wise'],
      slot: 'Head',
      rarity: 'R2',
    },
    'Cultist Hood': {
      sets: ['Holy II', 'Fire I'],
      slot: 'Head',
      rarity: 'R2',
    },
    'Eyepatch': {
      sets: ['Swift II'],
      slot: 'Head',
      rarity: 'R2',
    },
    'Horned Helm': {
      sets: ['Blade I'],
      traits: ['Fury'],
      slot: 'Head',
      rarity: 'R3',
    },
    'Cavaliers Hat': {
      sets: ['Blade I', 'Swift II'],
      slot: 'Head',
      rarity: 'R3',
    },
    'Coral Crown': {
      traits: ['+2HP', 'Spikey'],
      slot: 'Head',
      rarity: 'R3',
    },
    'Seaweed': {
      sets: ['Armour II', 'Growth II'],
      traits: ['Decay'],
      slot: 'Head',
      rarity: 'E1',
    },
    'Wolf Hat': {
      traits: ['Fury'],
      slot: 'Head',
      rarity: 'E2',
    },
    'Voodoo Mask': {
      sets: ['Holy II'],
      traits: ['+1HP'],
      slot: 'Head',
      rarity: 'E2',
    },
    'Winged Fury': {
      sets: ['Holy I'],
      traits: ['Retribution'],
      slot: 'Head',
      rarity: 'E3',
    },
    // Offhand
    'Wooden Stool': {
      sets: ['Crush I', 'Stupidity I', 'Armour I'],
      slot: 'Offhand',
      rarity: 'C1',
    },
    'Wooden Board': {
      sets: ['Armour I'],
      slot: 'Offhand',
      rarity: 'C1',
    },
    'Cuppa': {
      sets: ['Fire I'],
      slot: 'Offhand',
      rarity: 'C1',
    },
    'Glyph': {
      sets: ['Arcane I', 'Holy I'],
      slot: 'Offhand',
      rarity: 'C2',
    },
    'Hook': {
      sets: ['Blade I', 'Swift I'],
      slot: 'Offhand',
      rarity: 'C2',
    },
    'Wooden Shield': {
      sets: ['Armour I'],
      traits: ['Tenacious'],
      slot: 'Offhand',
      rarity: 'C3',
    },
    'War Horn': {
      sets: ['Holy I', 'Growth I', 'Fire I'],
      slot: 'Offhand',
      rarity: 'C3',
    },
    'Leatherbound Tome': {
      sets: ['Arcane I', 'Fire I'],
      slot: 'Offhand',
      rarity: 'U1',
    },
    'Spyglass': {
      traits: ['Ranged'],
      slot: 'Offhand',
      rarity: 'U1',
    },
    'Heater Shield': {
      sets: ['Fire II'],
      traits: ['+1HP'],
      slot: 'Offhand',
      rarity: 'U3',
    },
    'Conch': {
      sets: ['Arcane III', 'Stupidity I'],
      slot: 'Offhand',
      rarity: 'U3',
    },
    'Mariners Medallion': {
      sets: ['Holy I'],
      traits: ['Blessed'],
      slot: 'Offhand',
      rarity: 'U3',
    },
    'Dead Lizard Charm': {
      sets: ['Arcane II'],
      slot: 'Offhand',
      rarity: 'R1',
    },
    'Eyeball Charm': {
      sets: ['Fire I'],
      traits: ['+1HP'],
      slot: 'Offhand',
      rarity: 'R1',
    },
    'Sea Charts': {
      sets: ['Growth I'],
      traits: ['Wise'],
      slot: 'Offhand',
      rarity: 'R1',
    },
    'Scroll Of Souls': {
      sets: ['Holy II', 'Arcane II', 'Stupidity I'],
      slot: 'Offhand',
      rarity: 'R2',
    },
    'Parrot': {
      sets: ['Crush I', 'Growth I'],
      traits: ['Spikey'],
      slot: 'Offhand',
      rarity: 'R2',
    },
    'Spiked Shield': {
      sets: ['Armour I', 'Blade II'],
      traits: ['Spikey'],
      slot: 'Offhand',
      rarity: 'R3',
    },
    'Owl Familiar': {
      sets: ['Holy II'],
      traits: ['Wise'],
      slot: 'Offhand',
      rarity: 'R3',
    },
    'Net': {
      sets: ['Stupidity I', 'Swift III'],
      slot: 'Offhand',
      rarity: 'E1',
    },
    'Rum Barrel': {
      sets: ['Armour I', 'Arcane I'],
      traits: ['+1HP'],
      slot: 'Offhand',
      rarity: 'E1',
    },
    'Duelling Buckler': {
      sets: ['Armour II', 'Swift I'],
      traits: ['Tenacious'],
      slot: 'Offhand',
      rarity: 'E3',
    },
    // Weapon
    'Twig': {
      sets: ['Crush I'],
      slot: 'Weapon',
      rarity: 'C1',
    },
    'Fork': {
      sets: ['Blade I'],
      slot: 'Weapon',
      rarity: 'C1',
    },
    'Stiletto': {
      sets: ['Blade I', 'Swift I'],
      slot: 'Weapon',
      rarity: 'C2',
    },
    'Club': {
      sets: ['Crush I', 'Growth I'],
      slot: 'Weapon',
      rarity: 'C2',
    },
    'Anchor': {
      sets: ['Crush II'],
      slot: 'Weapon',
      rarity: 'C2',
    },
    'Spear': {
      sets: ['Swift II'],
      slot: 'Weapon',
      rarity: 'C3',
    },
    'Sword': {
      sets: ['Blade II'],
      slot: 'Weapon',
      rarity: 'C3',
    },
    'Broken Bottle': {
      sets: ['Blade I', 'Growth I', 'Swift I'],
      slot: 'Weapon',
      rarity: 'C3',
    },
    'Troll Femur': {
      sets: ['Stupidity I', 'Crush II', 'Growth I'],
      slot: 'Weapon',
      rarity: 'U1',
    },
    'Hand-Axe': {
      sets: ['Blade I', 'Crush I'],
      slot: 'Weapon',
      rarity: 'U1',
    },
    'Arcane Wand': {
      sets: ['Arcane I', 'Growth I'],
      slot: 'Weapon',
      rarity: 'U1',
    },
    'Scimitar': {
      sets: ['Blade II'],
      slot: 'Weapon',
      rarity: 'U2',
    },
    'Crossbow': {
      sets: ['Swift II'],
      slot: 'Weapon',
      rarity: 'U2',
    },
    'Winged Staff': {
      sets: ['Arcane I', 'Holy II'],
      slot: 'Weapon',
      rarity: 'U3',
    },
    'Mace': {
      sets: ['Blade I', 'Crush II'],
      slot: 'Weapon',
      rarity: 'U3',
    },
    'Flintlock': {
      sets: ['Fire II'],
      traits: ['Fury'],
      slot: 'Weapon',
      rarity: 'U3',
    },
    'Brass Knuckles': {
      sets: ['Crush II'],
      slot: 'Weapon',
      rarity: 'R1',
    },
    'Demon Claw': {
      sets: ['Blade II'],
      slot: 'Weapon',
      rarity: 'R1',
    },
    'Grenade': {
      sets: ['Fire II'],
      slot: 'Weapon',
      rarity: 'R1',
    },
    'Cursed Bow': {
      sets: ['Swift II'],
      traits: ['Decay', 'Ranged'],
      slot: 'Weapon',
      rarity: 'R3',
    },
    'Mind Staff': {
      sets: ['Arcane I', 'Fire I'],
      traits: ['Wise'],
      slot: 'Weapon',
      rarity: 'R3',
    },
    'Cleaver': {
      sets: ['Stupidity I', 'Blade I'],
      traits: ['Fury'],
      slot: 'Weapon',
      rarity: 'E1',
    },
    'Gnarled Oak': {
      sets: ['Growth II', 'Holy I'],
      slot: 'Weapon',
      rarity: 'E1',
    },
    'Cutlass': {
      sets: ['Blade II'],
      traits: ['Tenacious'],
      slot: 'Weapon',
      rarity: 'E1',
    },
    'Broadsword': {
      sets: ['Crush I'],
      traits: ['Ferocious'],
      slot: 'Weapon',
      rarity: 'E2',
    },
    'Trident': {
      sets: ['Blade III'],
      slot: 'Weapon',
      rarity: 'E2',
    },
    'Ocean Staff': {
      sets: ['Holy II'],
      traits: ['Blessed'],
      slot: 'Weapon',
      rarity: 'E2',
    },
    'Battle Axe': {
      sets: ['Crush II', 'Blade III'],
      slot: 'Weapon',
      rarity: 'E3',
    },
    'Sword of the Sea': {
      sets: ['Blade II', 'Growth III'],
      slot: 'Weapon',
      rarity: 'E3',
    },
  },
};
