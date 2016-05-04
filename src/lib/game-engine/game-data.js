export default {
  CARD_ATTRS: {
    'H': 'heal',
    'HPD': 'healPerDmg',
    'HID': 'healIfDmg',
    'DID': 'discardIfDmg',
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
    'ClID': 'cloneIfDmg',  // TODO: implement
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
    'Co': 'conceal',  // TODO: implement
    'CoID': 'concealIfDmg',  // TODO: implement
    'H6': 'healthSix',
    'PVU': 'physicalVsUnblockable',
    'W': 'withstand',
    'Cs': 'cardStorm',
    'Ps': 'paperShield',
  },

  sets: {
    // Player sets
    'Chump': ['P', 'P', 'P', 'P/P', 'B', 'B'],
    'Cat Burglar': ['PN', 'PN', 'P/U', 'P/Q', 'P/P', 'P/P'],
    'Bruiser': ['P', 'P', 'BP/BP', 'P/BP', 'P/U', 'BM/BM'],
    'Apprentice': ['M/BM', 'M/BM', 'D/D', 'M/U', 'M/U', 'M/Q'],
    'Shapeshifter': ['H/H', 'M/U', 'P/P', 'P/P', 'M/BM/BM', 'BP/BP/BP'],
    'Alchemist': ['M/M', 'M/M', 'H', 'H', 'M/Q', 'BM/BM/MN/MN'],
    'Barbarian': ['P/P/-H', 'P/P/-H', 'P/P/P/-H', 'P/P/BM', 'P/P/U', 'W'],
    'Ranger': ['P', 'P/U', 'M/M', 'P/P', 'B/PN', 'B/PN'],
    'Cartomancer': ['M/M', 'Cs', 'P/U/Q', 'Ps', 'M/BM/BM', 'H/D'],
    'Most Holy Grail Knight': ['P/HID', 'P/HID', 'M/HID/HID', 'P/P/U', 'P/P/-H', 'H/H/H/-H'],
    'Troubador': ['M/U', 'P/P/Q', 'P/P/BP/BP', 'P/P/BM/BM', 'P/M', 'P/M'],
    //'Artificer': ['ClID'],

    // Enemy sets
    'Feral 1': ['P/U'],
    'Feral 2': ['P/U', 'P/U'],
    'Feral 3': ['P/U', 'P/U', 'P/P/BM'],
    'Feral 4': ['P/U', 'P/U', 'P/P/BM', 'P/P/BM'],
    'Feral 5': ['P/U', 'P/U', 'P/P/BM', 'P/P/BM', 'P/P/P'],

    'Nature 1': ['P'],
    'Nature 2': ['P', 'P/DID'],
    'Nature 3': ['P', 'P/DID', 'M/HID/HID'],
    'Nature 4': ['P', 'P/DID', 'M/HID/HID', 'P/M/M'],

    'Spooky 1': ['M/BP'],
    'Spooky 2': ['M/BP', 'M/HPD'],
    'Spooky 3': ['M/BP', 'M/HPD', 'M/HPD'],
    'Spooky 4': ['M/BP', 'M/HPD', 'M/HPD', 'M/M/BP/BP'],
    'Spooky 5': ['M/BP', 'M/HPD', 'M/HPD', 'M/M/BP/BP', 'M/M/HPD'],

    'Flame 1': ['M'],
    'Flame 2': ['M', 'M/U'],
    'Flame 3': ['M', 'M/U', 'M/P'],
    'Flame 4': ['M', 'M/U', 'M/P', 'M/M'],
    'Flame 5': ['M', 'M/U', 'M/P', 'M/M', 'M/M/M'],

    'Armed 1': ['P'],
    'Armed 2': ['P', 'P/DID'],
    'Armed 3': ['P', 'P/DID', 'P/P/BP'],
    'Armed 4': ['P', 'P/DID', 'P/P/BP', 'P/P/U'],
    'Armed 5': ['P', 'P/DID', 'P/P/BP', 'P/P/U', 'P/P/P/BP/BP'],

    'Burly 1': ['P/P/BP'],
    'Burly 2': ['P/P/BP', 'P/P/P'],
    'Burly 3': ['P/P/BP', 'P/P/P', 'BP/BP/H/H'],
    'Burly 4': ['P/P/BP', 'P/P/P', 'BP/BP/H/H', 'P/P/P/P'],

    'Irritable 1': ['P/-H'],
    'Irritable 2': ['P/-H', 'P/P/-H'],
    'Irritable 3': ['P/-H', 'P/P/-H', 'P/P/-H'],
    'Irritable 4': ['P/-H', 'P/P/-H', 'P/P/-H', 'P/P/P/-H'],
    'Irritable 5': ['P/-H', 'P/P/-H', 'P/P/-H', 'P/P/P/-H', 'P/P/P/-H'],

    'Death 1': ['M'],
    'Death 2': ['M', 'M/BM'],
    'Death 3': ['M', 'M/BM', 'M/M/BM'],
    'Death 4': ['M', 'M/BM', 'M/M/BM', 'M/M/U'],
    'Death 5': ['M', 'M/BM', 'M/M/BM', 'M/M/U', 'M/M/DID'],

    'Demonic 1': ['M/M/BM'],
    'Demonic 2': ['M/M/BM', 'M/M/M'],
    'Demonic 3': ['M/M/BM', 'M/M/M', 'M/M/M/BM'],
    'Demonic 4': ['M/M/BM', 'M/M/M', 'M/M/M/BM', 'M/M/M/M'],

    'Aquatic 1': ['M/M/C'],
    'Aquatic 2': ['M/M/C', 'BM/BM/C'],
    'Aquatic 3': ['M/M/C', 'BM/BM/C', 'M/M/BM/BM'],
    'Aquatic 4': ['M/M/C', 'BM/BM/C', 'M/M/BM/BM', 'M/M/M/C/C'],

    'Electrical 1': ['M/DID'],
    'Electrical 2': ['M/DID', 'M/U'],
    'Electrical 3': ['M/DID', 'M/U', 'M/M/DID'],
    'Electrical 4': ['M/DID', 'M/U', 'M/M/DID', 'M/M/U'],

    'Ghoulish 1': ['M/M'],
    'Ghoulish 2': ['M/M', 'M/M/M/BP'],
    'Ghoulish 3': ['M/M', 'M/M/M/BP', 'M/M/HPD'],
    'Ghoulish 4': ['M/M', 'M/M/M/BP', 'M/M/HPD', 'M/M/HPD'],

    'Gunnery 1': ['P/P/U'],
    'Gunnery 2': ['P/P/U', 'BP/BP/PN'],
    'Gunnery 3': ['P/P/U', 'BP/BP/PN', 'BP/BP/PN'],
    'Gunnery 4': ['P/P/U', 'BP/BP/PN', 'BP/BP/PN', 'P/Co'],
    'Gunnery 5': ['P/P/U', 'BP/BP/PN', 'BP/BP/PN', 'P/Co', 'P/P/P/P'],

    'Pickpocket 1': ['BP/SPB'],
    'Pickpocket 2': ['BP/SPB', 'P/P/SID'],
    'Pickpocket 3': ['BP/SPB', 'P/P/SID', 'H/S'],
    'Pickpocket 4': ['BP/SPB', 'P/P/SID', 'H/S', 'BP/BP/SPB'],

    'Rage 1': ['P/P/U'],
    'Rage 2': ['P/P/U', 'P/P/P/-H'],
    'Rage 3': ['P/P/U', 'P/P/P/-H', 'P/P/P/-H'],
    'Rage 4': ['P/P/U', 'P/P/P/-H', 'P/P/P/-H', 'P/P/P/P/-H'],

    'Sorcery 1': ['M/M/HID'],
    'Sorcery 2': ['M/M/HID', 'M/M/DID'],
    'Sorcery 3': ['M/M/HID', 'M/M/DID', 'M/M/M/CoID'],
    'Sorcery 4': ['M/M/HID', 'M/M/DID', 'M/M/M/CoID', 'M/M/M/M'],

    'Venom 1': ['P/P'],
    'Venom 2': ['P/P', 'P/P/U'],
    'Venom 3': ['P/P', 'P/P/U', 'P/P/M'],
    'Venom 4': ['P/P', 'P/P/U', 'P/P/M', 'P/P/PRID'],

    // Item sets
    'Fire 1': ['M/M'],
    'Fire 2': ['M/M', 'M/M/Q'],
    'Fire 3': ['M/M', 'M/M/Q', 'M/MRID'],
    'Fire 4': ['M/M', 'M/M/Q', 'M/MRID', 'M/M/M/M/U'],

    'Stupidity 1': ['?'],
    'Stupidity 2': ['?', '?'],
    'Stupidity 3': ['?', '?', '?'],
    'Stupidity 4': ['?', '?', '?', '?'],

    'Growth 1': ['M/H'],
    'Growth 2': ['M/H', 'M/HID/HID'],
    'Growth 3': ['M/H', 'M/HID/HID', 'H6/Q'],
    'Growth 4': ['M/H', 'M/HID/HID', 'H6/Q', 'M/M/H/H/H'],

    'Swift 1': ['P/Q/D'],
    'Swift 2': ['P/Q/D', 'P/Q/BM/BM'],
    'Swift 3': ['P/Q/D', 'P/Q/BM/BM', 'P/P/U/Q'],
    'Swift 4': ['P/Q/D', 'P/Q/BM/BM', 'P/P/U/Q', 'BA/D/D'],

    'Armour 1': ['BP/BP/BP'],
    'Armour 2': ['BP/BP/BP', 'P/P/BP'],
    'Armour 3': ['BP/BP/BP', 'P/P/BP', 'BA/D'],
    'Armour 4': ['BP/BP/BP', 'P/P/BP', 'BA/D', 'BPA/PN/PN'],

    'Blade 1': ['P/P'],
    'Blade 2': ['P/P', 'P/P/PVU'],
    'Blade 3': ['P/P', 'P/P/PVU', 'P/P/P/BM'],
    'Blade 4': ['P/P', 'P/P/PVU', 'P/P/P/BM', 'P/P/PRID'],

    'Crush 1': ['P/BP'],
    'Crush 2': ['P/BP', 'P/P/U'],
    'Crush 3': ['P/BP', 'P/P/U', 'P/P/P/BP'],
    'Crush 4': ['P/BP', 'P/P/U', 'P/P/P/BP', 'P/P/P/P/BP/BP'],

    'Arcane 1': ['M/D'],
    'Arcane 2': ['M/D', 'MN/H/D'],
    'Arcane 3': ['M/D', 'MN/H/D', 'M/M/M/U'],
    'Arcane 4': ['M/D', 'MN/H/D', 'M/M/M/U', 'H/H/H/D/D'],

    'Holy 1': ['B/HPB'],
    'Holy 2': ['B/HPB', 'M/M/BM'],
    'Holy 3': ['B/HPB', 'M/M/BM', 'B/B/HPB'],
    'Holy 4': ['B/HPB', 'M/M/BM', 'B/B/HPB', 'M/M/M/BMA'],
  },

  players: {
    // Tier 1
    'Chump': {
      sets: ['Chump'],
      health: 5,
    },
    'Cat Burglar': {
      sets: ['Cat Burglar'],
      health: 5,
    },
    'Bruiser': {
      sets: ['Bruiser'],
      health: 5,
      traits: ['Spikey'],
    },
    'Apprentice': {
      sets: ['Apprentice', 'Fire 1'],
      health: 5,
    },
    //'Mime': {
    //},
    // Tier 2
    'Alchemist': {
      sets: ['Alchemist'],
      traits: ['Blessing'],
      health: 4,
    },
    'Barbarian': {
      sets: ['Barbarian'],
      health: 5,
      situationalTraits: ['Deathwish'],
    },
    'Ranger': {
      sets: ['Ranger'],
      health: 5,
      traits: ['Ranged'],
    },
    'Shapeshifter': {
      sets: ['Shapeshifter', 'Growth 1'],
      health: 5,
    },
    // Tier 3
    //'Artificer': {
    //},
    'Cartomancer': {
      sets: ['Cartomancer'],
      health: 6,
      traits: ['Rules Lawyer'],
    },
    //'Mathemagician': {
    //},
    'Most Holy Grail Knight': {
      sets: ['Most Holy Grail Knight'],
      health: 7,
      traits: ['Retribution'],
    },
    'Troubador': {
      sets: ['Troubador'],
      health: 6,
      traits: ['Spellsword'],
    },
  },

  enemies: {
    // Cove - 1
    'Deckhand': {
      health: 7,
      sets: ['Armed 3', 'Rage 3', 'Stupidity 1'],
    },
    'Eel': {
      health: 6,
      sets: ['Electrical 3', 'Aquatic 2', 'Nature 1', 'Venom 3'],
    },
    'Mermaid': {
      health: 7,
      sets: ['Aquatic 3', 'Irritable 5', 'Feral 5'],
      traits: ['Mundane'],
    },
    'Oarsman': {
      health: 5,
      sets: ['Armed 5', 'Rage 2', 'Irritable 4'],
      traits: ['Fury'],
    },
    'One-Headed Monkey': {
      health: 6,
      sets: ['Feral 3', 'Irritable 3', 'Pickpocket 3'],
    },
    // Cove - 2
    'Cabin Boy': {
      health: 7,
      sets: ['Armed 3', 'Irritable 3', 'Stupidity 1'],
      traits: ['Mundane'],
    },
    'Giant Crab': {
      health: 9,
      sets: ['Spooky 2', 'Armed 5', 'Aquatic 3', 'Nature 1'],
      traits: ['Tough'],
    },
    //'Gunner': {
    //  health: 7,
    //  sets: ['Armed 3', 'Burly 2', 'Rage 2', 'Gunnery 4'],
    //  traits: ['Spikey', 'Rum'],
    //},
    'Hermit Crab': {
      health: 9,
      sets: ['Armed 4', 'Aquatic 3', 'Nature 1'],
      traits: ['Tough'],
    },
    'Merman': {
      health: 8,
      sets: ['Aquatic 4', 'Irritable 5', 'Feral 5'],
      traits: ['Mundane'],
    },
    'Sea Monkey': {
      health: 8,
      sets: ['Feral 3', 'Irritable 2', 'Pickpocket 3', 'Aquatic 3', 'Electrical 1'],
    },
    //'Werecrab Mage': {
    //  health: 9,
    //  sets: ['Spooky 3', 'Sorcery 3', 'Aquatic 2', 'Electrical 4'],
    //  traits: ['Frail'],
    //},
    // Cove - 3
    'Ancient Mariner': {
      health: 10,
      sets: ['Armed 3', 'Irritable 3', 'Stupidity 1'],
      traits: ['Decay', 'Rum'],
    },
    'Buccaneer': {
      health: 9,
      sets: ['Armed 2', 'Rage 4'],
      traits: ['Fury', 'Aggressive'],
      situationalTraits: ['Crewmate', 'Crewmate x2', 'Crewmate x3', 'Crewmate x4', 'Crewmate x5'],
    },
    'Cranky Parrot': {
      health: 9,
      sets: ['Feral 5', 'Pickpocket 2', 'Nature 1', 'Stupidity 2'],
      traits: ['Ferocious'],
    },
    'First Mate': {
      health: 9,
      sets: ['Armed 2', 'Burly 3', 'Gunnery 2', 'Irritable 3', 'Pickpocket 2'],
      situationalTraits: ['Crewmate', 'Crewmate x2', 'Crewmate x3', 'Crewmate x4', 'Crewmate x5'],
    },
    'Flaming Gallah': {
      health: 9,
      sets: ['Flame 4', 'Feral 5', 'Rage 1', 'Nature 1', 'Pickpocket 3'],
      traits: ['Burn', 'Ferocious'],
    },
    //'Ghost Pirate': {
    //  health: 10,
    //  sets: ['Sorcery 3', 'Death 2', 'Pickpocket 2'],
    //  traits: ['Bulwark', 'Aggressive'],
    //},
    //'Master Gunner': {
    //  health: 14,
    //  sets: ['Gunnery 5', 'Burly 2', 'Armed 2', 'Rage 2'],
    //  traits: ['Tough', 'Spikey', 'Aggressive'],
    //},
    'Pearl Guard': {
      health: 10,
      sets: ['Feral 3', 'Irritable 2', 'Aquatic 4'],
    },
    'Pirate': {
      health: 8,
      sets: ['Armed 3', 'Rage 2', 'Pickpocket 1'],
      traits: ['Aggressive', 'Rum'],
      situationalTraits: ['Crewmate', 'Crewmate x2', 'Crewmate x3', 'Crewmate x4', 'Crewmate x5'],
    },
    'Ships Cook': {
      health: 9,
      sets: ['Pickpocket 3', 'Rage 2', 'Irritable 2', 'Burly 2'],
      traits: ['Fury', 'Rum', 'Respite'],
    },
    'Three-Headed Monkey': {
      health: 10,
      sets: ['Irritable 5', 'Burly 4', 'Feral 3', 'Nature 1'],
      traits: ['Aggressive', 'Bulwark', 'Fury', 'Mundane'],
    },
    'Werecrab': {
      health: 10,
      sets: ['Spooky 2', 'Armed 4', 'Nature 1'],
      traits: ['Tough'],
    },
    // Cove - 4
    'Bullseye Bill': {
      health: 12,
      sets: ['Irritable 5', 'Burly 3', 'Gunnery 2', 'Armed 2', 'Pickpocket 2'],
      traits: ['Bulwark'],
      situationalTraits: ['Crewmate', 'Crewmate x2', 'Crewmate x3', 'Crewmate x4', 'Crewmate x5'],
    },
    'Captain Rosalita': {
      health: 14,
      sets: ['Rage 2', 'Irritable 4', 'Pickpocket 4', 'Armed 4'],
      traits: ['Skilled'],
      situationalTraits: ['Crewmate', 'Crewmate x2', 'Crewmate x3', 'Crewmate x4', 'Crewmate x5'],
    },
    'Cleaver Joe': {
      health: 13,
      sets: ['Flame 2', 'Rage 2', 'Irritable 3', 'Burly 2', 'Pickpocket 3'],
      traits: ['Fury', 'Rum', 'Respite'],
    },
    'Crab King': {
      health: 12,
      sets: ['Spooky 4', 'Armed 5', 'Nature 1'],
      traits: ['Tough', 'Spikey'],
      situationalTraits: ['Leader', 'Leader x2', 'Leader x3', 'Leader x4', 'Leader x5'],
    },
    'Fishbone': {
      health: 15,
      sets: ['Feral 3', 'Electrical 2', 'Aquatic 4'],
    },
    'Grey Beard': {
      health: 14,
      sets: ['Armed 4', 'Irritable 4', 'Stupidity 1'],
      traits: ['Decay', 'Rum'],
    },
    'Quartermaster': {
      health: 14,
      sets: ['Armed 5', 'Irritable 4', 'Burly 3'],
      traits: ['Spikey', 'Rum', 'Respite'],
    },
    'Reverse Mermaid': {
      health: 9,
      sets: ['Aquatic 3', 'Armed 5', 'Spooky 2', 'Nature 1'],
      traits: ['Aggressive', 'Decay'],
    },
    'Skeleton Pirate': {
      health: 15,
      sets: ['Death 2', 'Spooky 2', 'Ghoulish 3', 'Pickpocket 1'],
      traits: ['Brittle', 'Aggressive'],
      situationalTraits: ['Crewmate', 'Crewmate x2', 'Crewmate x3', 'Crewmate x4', 'Crewmate x5'],
    },
    // Final
    'Angry Bunny': {
      health: 14,
      sets: ['Demonic 4', 'Burly 4', 'Rage 4', 'Irritable 5', 'Feral 5'],
      traits: ['Fury', 'Skilled', 'Mundane'],
    },
    // Grasslands - 0
    'Rubber Ducky': {
      health: 4,
      sets: ['Irritable 2', 'Stupidity 1'],
    },
    // Grasslands - 1
    'Fire Imp': {
      health: 5,
      sets: ['Flame 3', 'Stupidity 1'],
      situationalTraits: ['Night Owl'],
    },
    'Giant Bat': {
      health: 4,
      sets: ['Spooky 3', 'Feral 2'],
      situationalTraits: ['Loner'],
    },
    'Goblin': {
      health: 6,
      sets: ['Armed 2', 'Irritable 3'],
    },
    'Gray Ooze': {
      health: 7,
      sets: ['Flame 2', 'Spooky 2', 'Death 1'],
      traits: ['Mundane'],
    },
    'Nasty Rat': {
      health: 5,
      sets: ['Nature 2', 'Feral 2'],
    },
    'Scary Spider': {
      health: 6,
      sets: ['Nature 2', 'Spooky 3'],
      traits: ['Frail'],
    },
    // Grasslands - 2
    'Ghost': {
      health: 5,
      sets: ['Death 3', 'Spooky 4'],
      traits: ['Tenacious'],
      situationalTraits: ['Night Owl'],
    },
    'Gnoll': {
      health: 6,
      sets: ['Nature 2', 'Irritable 3', 'Armed 2'],
      traits: ['Fury'],
    },
    'Mimic': {
      health: 7,
      sets: ['Death 3', 'Irritable 3', 'Feral 3'],
    },
    'Rat Man': {
      health: 6,
      sets: ['Armed 3', 'Irritable 3', 'Feral 2'],
    },
    'Skeleton': {
      health: 8,
      sets: ['Armed 3', 'Irritable 2', 'Spooky 3'],
      traits: ['Brittle'],
    },
    'Snake': {
      health: 7,
      sets: ['Death 2', 'Feral 4', 'Nature 3'],
    },
    'Zombie': {
      health: 9,
      sets: ['Death 3', 'Irritable 3', 'Spooky 3'],
      traits: ['Decay'],
    },
    // Grasslands - 3
    'Bandito': {
      health: 7,
      sets: ['Armed 5'],
      situationalTraits: ['Loner'],
    },
    'Bear Owl': {
      health: 7,
      sets: ['Nature 3', 'Armed 3', 'Feral 2'],
      traits: ['Fury'],
    },
    'Fire Elemental': {
      health: 8,
      sets: ['Flame 4', 'Death 4'],
      traits: ['Burn'],
    },
    'Minotaur': {
      health: 10,
      sets: ['Armed 4', 'Irritable 5'],
      traits: ['Fury', 'Decay'],
    },
    'Mummy': {
      health: 9,
      sets: ['Death 3', 'Irritable 3', 'Spooky 4'],
      traits: ['Brittle'],
    },
    'Scorpion': {
      health: 8,
      sets: ['Nature 4', 'Armed 4', 'Feral 4'],
    },
    'Shade': {
      health: 7,
      sets: ['Death 5', 'Spooky 4'],
      traits: ['Tenacious'],
      situationalTraits: ['Night Owl'],
    },
    'Sorceress': {
      health: 7,
      sets: ['Death 3', 'Flame 4'],
    },
    // Grasslands - 4
    'Black knight': {
      health: 10,
      sets: ['Armed 5', 'Death 5'],
      traits: ['Mundane'],
    },
    'Embro': {
      health: 10,
      sets: ['Irritable 5', 'Armed 5', 'Flame 5'],
      traits: ['Skilled'],
    },
    'Lich': {
      health: 13,
      sets: ['Death 5', 'Spooky 5'],
      traits: ['Frail'],
    },
    'Eye Beast': {
      health: 11,
      sets: ['Death 5', 'Flame 5'],
      traits: ['Frail'],
    },
    'Mimic Queen': {
      health: 11,
      sets: ['Death 5', 'Irritable 5', 'Feral 4'],
      traits: ['Brittle'],
    },
    //'Orc Warlord': {
    //  health: 11,
    //  sets: ['Armed 5', 'Irritable 5', 'Stupidity 2'],
    //  traits: ['Predictable'],
    //},
    'Rat King': {
      health: 7,
      sets: ['Armed 3', 'Irritable 3', 'Feral 3'],
      situationalTraits: ['Leader', 'Leader x2', 'Leader x3', 'Leader x4', 'Leader x5'],
    },
    // Jungle - 1
    //'Bloodstarved Bat': {
    //  health: 6,
    //  sets: ['Rage 2', 'Spooky 2'],
    //  traits: ['Predictable'],
    //},
    'Frenzied Goblin': {
      health: 6,
      sets: ['Rage 2', 'Armed 2'],
      traits: ['Fury', 'Aggressive'],
    },
    'Jungle Warrior': {
      health: 6,
      sets: ['Burly 2', 'Nature 3'],
      situationalTraits: ['Leader', 'Leader x2', 'Leader x3', 'Leader x4', 'Leader x5'],
    },
    'Leggy Spider': {
      health: 7,
      sets: ['Venom 3', 'Spooky 2'],
      traits: ['Frail'],
    },
    'Pixies': {
      health: 5,
      sets: ['Nature 2', 'Demonic 1', 'Sorcery 1'],
      traits: ['Tenacious', 'Thief'],
    },
    'Plague Rat': {
      health: 6,
      sets: ['Venom 2', 'Feral 2'],
      situationalTraits: ['Loner'],
    },
    // Jungle - 2
    'Harpy': {
      health: 8,
      sets: ['Demonic 2', 'Feral 3'],
    },
    'Hilly Gnoll': {
      health: 8,
      sets: ['Irritable 1', 'Burly 2', 'Armed 2'],
      traits: ['Fury'],
    },
    'Lizardman': {
      health: 8,
      sets: ['Burly 2', 'Nature 3'],
      situationalTraits: ['Night Owl'],
    },
    'Maneating Plant': {
      health: 8,
      sets: ['Venom 3', 'Stupidity 1'],
    },
    'Poisonous Snake': {
      health: 8,
      sets: ['Venom 2', 'Nature 3'],
      traits: ['Wandering'],
    },
    'Rat Berserker': {
      health: 9,
      sets: ['Rage 3', 'Armed 3'],
      traits: ['Sluggish'],
    },
    // Jungle - 3
    //'Air elemental': {
    //  health: 9,
    //  sets: ['Sorcery 3', 'Irritable 3'],
    //  traits: ['Bulwark', 'Wandering'],
    //},
    'Dire Scorpion': {
      health: 8,
      sets: ['Burly 2', 'Nature 2'],
      traits: ['Bulwark'],
    },
    'Gargoyle': {
      health: 10,
      sets: ['Demonic 3', 'Feral 3'],
      traits: ['Brittle'],
    },
    //'Jungle Shaman': {
    //  health: 8,
    //  sets: ['Flame 3', 'Sorcery 3'],
    //  situationalTraits: ['Leader', 'Leader x2', 'Leader x3', 'Leader x4', 'Leader x5'],
    //},
    'Owl Bear': {
      health: 8,
      sets: ['Rage 3', 'Nature 2'],
      traits: ['Fury'],
    },
    'Worm': {
      health: 9,
      sets: ['Ghoulish 2', 'Venom 3', 'Stupidity 2'],
      traits: ['Tenacious'],
      situationalTraits: ['Night Owl'],
    },
    // Jungle - 4
    'Chimera': {
      health: 9,
      sets: ['Venom 2', 'Rage 2', 'Feral 2'],
      traits: ['Fury'],
    },
    'Dragon': {
      health: 11,
      sets: ['Flame 5', 'Demonic 2', 'Sorcery 2'],
    },
    'Ettin': {
      health: 13,
      sets: ['Rage 3', 'Stupidity 1', 'Demonic 2'],
      traits: ['Sluggish'],
    },
    'Medusa': {
      health: 8,
      sets: ['Venom 3', 'Demonic 2', 'Ghoulish 2'],
      situationalTraits: ['Night Owl'],
    },
    //'Ogre': {
    //  health: 13,
    //  sets: ['Burly 3', 'Rage 2', 'Stupidity 2'],
    //  traits: ['Predictable'],
    //},
    // Mines - 1
    'Albino Goblin': {
      health: 8,
      sets: ['Ghoulish 2', 'Rage 2', 'Irritable 1'],
      traits: ['Tenacious'],
      situationalTraits: ['Night Owl'],
    },
    'Digger': {
      health: 8,
      sets: ['Burly 3', 'Rage 2'],
      traits: ['Brittle'],
      situationalTraits: ['Leader', 'Leader x2', 'Leader x3', 'Leader x4', 'Leader x5'],
    },
    'Dwarven Explosives': {
      health: 7,
      sets: ['Venom 1', 'Demonic 2', 'Sorcery 1'],
      traits: ['Retribution'],
    },
    'Infected Slime': {
      health: 10,
      sets: ['Venom 3', 'Ghoulish 2'],
      traits: ['Decay'],
    },
    'Miner': {
      health: 6,
      sets: ['Burly 3', 'Rage 2'],
      traits: ['Fury'],
      situationalTraits: ['Leader', 'Leader x2', 'Leader x3', 'Leader x4', 'Leader x5'],
    },
    'Rust Monster': {
      health: 6,
      sets: ['Venom 2', 'Burly 2'],
      traits: ['Wandering'],
    },
    // Mines - 2
    'Blind Worm': {
      health: 11,
      sets: ['Stupidity 1', 'Demonic 2', 'Ghoulish 3'],
      traits: ['Sluggish'],
      situationalTraits: ['Night Owl'],
    },
    'Clattering Bones': {
      health: 10,
      sets: ['Burly 2', 'Demonic 2', 'Ghoulish 3'],
      traits: ['Brittle'],
    },
    'Gelatinous Cube': {
      health: 8,
      sets: ['Venom 2', 'Demonic 2'],
      traits: ['Tenacious'],
    },
    'Rotting Corpse': {
      health: 12,
      sets: ['Rage 2', 'Burly 2', 'Ghoulish 2'],
      traits: ['Decay', 'Wandering'],
    },
    //'Spider Drill': {
    //  health: 9,
    //  sets: ['Sorcery 3', 'Burly 2'],
    //  traits: ['Bulwark', 'Aggressive'],
    //},
    'Wailing Ghost': {
      health: 7,
      sets: ['Sorcery 2', 'Demonic 2', 'Ghoulish 3'],
      traits: ['Tenacious'],
      situationalTraits: ['Loner'],
    },
    // Mines - 3
    'Cave Troll': {
      health: 9,
      sets: ['Burly 3', 'Rage 4', 'Irritable 2'],
      traits: ['Fury', 'Aggressive'],
    },
    'Cursed Mummy': {
      health: 13,
      sets: ['Demonic 1', 'Ghoulish 4', 'Irritable 3'],
      traits: ['Brittle'],
    },
    'Earth Elemental': {
      health: 11,
      sets: ['Burly 3', 'Demonic 2'],
      traits: ['Brittle'],
    },
    //'Genii': {
    //  health: 9,
    //  sets: ['Demonic 2', 'Sorcery 3'],
    //},
    //'Nymph': {
    //  health: 9,
    //  sets: ['Venom 3', 'Sorcery 3'],
    //  traits: ['Tenacious'],
    //},
    'Vampire': {
      health: 9,
      sets: ['Demonic 3', 'Ghoulish 3'],
      situationalTraits: ['Leader', 'Leader x2', 'Leader x3', 'Leader x4', 'Leader x5'],
    },
    // Mines - 4
    'Cyclops': {
      health: 12,
      sets: ['Burly 4', 'Ghoulish 2'],
      traits: ['Sluggish'],
    },
    //'Dwarf Magnate': {
    //  health: 10,
    //  sets: ['Demonic 2', 'Sorcery 4'],
    //  traits: ['Fury'],
    //},
    //'Dwarf Masterpiece': {
    //  health: 13,
    //  sets: ['Venom 4', 'Sorcery 4'],
    //  traits: ['Brittle'],
    //},
    //'Dwarf Mecha': {
    //  health: 14,
    //  sets: ['Burly 4', 'Sorcery 3'],
    //  traits: ['Predictable', 'Frail'],
    //},
    'Dwarf Sentry': {
      health: 12,
      sets: ['Burly 3', 'Demonic 2'],
      traits: ['Retribution'],
    },
    'Troll': {
      health: 14,
      sets: ['Venom 3', 'Burly 3'],
      traits: ['Fury', 'Mundane'],
    },
  },

  // Trinkets are passed in via traits.
  // Other valid traits include: +1HP, -1HP, +2HP, etc.
  trinkets: {
    'Warriors Might': {},
    'Phlogis Tonic': {},
    'Crones Discipline': {},
  },

  items: {
    // Body - C1
    'Straightjacket': {
      traits: ['+1HP'],
      slot: 'Body',
      rarity: 'C1',
    },
    'Ruffled Shirt': {
      sets: ['Swift 1'],
      slot: 'Body',
      rarity: 'C1',
    },
    'Barrel': {
      sets: ['Stupidity 1'],
      traits: ['+1HP'],
      slot: 'Body',
      rarity: 'C1',
    },
    'Tattered Mail': {
      sets: ['Armour 1', 'Stupidity 1'],
      traits: ['+1HP'],
      slot: 'Body',
      rarity: 'C2',
    },
    'Shimmering Cloak': {
      sets: ['Arcane 1', 'Fire 1'],
      slot: 'Body',
      rarity: 'C2',
    },
    'Red Mail': {
      sets: ['Armour 1'],
      traits: ['+1HP'],
      slot: 'Body',
      rarity: 'C3',
    },
    'Bone Armour': {
      sets: ['Arcane 1'],
      traits: ['+1HP'],
      slot: 'Body',
      rarity: 'C3',
    },
    'Sash': {
      sets: ['Swift 1', 'Growth 1'],
      slot: 'Body',
      rarity: 'U1',
    },
    'Mage Robes': {
      sets: ['Fire 1', 'Arcane 1', 'Holy 1'],
      slot: 'Body',
      rarity: 'U2',
    },
    'Corset': {
      sets: ['Armour 1', 'Growth 1'],
      slot: 'Body',
      rarity: 'U2',
    },
    'Wolf Pelt': {
      sets: ['Growth 2'],
      traits: ['+1HP'],
      slot: 'Body',
      rarity: 'U3',
    },
    'Scale Mail': {
      sets: ['Armour 1'],
      traits: ['+2HP'],
      slot: 'Body',
      rarity: 'U3',
    },
    'Bark Vest': {
      sets: ['Growth 1', 'Stupidity 1'],
      traits: ['Tenacious'],
      slot: 'Body',
      rarity: 'R1',
    },
    'Fish Scale Cowl': {
      sets: ['Arcane 1'],
      traits: ['+1HP'],
      slot: 'Body',
      rarity: 'R1',
    },
    'Seafarers Brace': {
      sets: ['Armour 1', 'Arcane 1'],
      traits: ['Retribution'],
      slot: 'Body',
      rarity: 'R2',
    },
    'Doom Plate': {
      sets: ['Armour 1'],
      traits: ['Bulwark'],
      slot: 'Body',
      rarity: 'R3',
    },
    'Padded Vest': {
      sets: ['Arcane 2', 'Armour 1'],
      slot: 'Body',
      rarity: 'R3',
    },
    'Dragon Scale': {
      sets: ['Armour 3', 'Fire 2'],
      slot: 'Body',
      rarity: 'E3',
    },
    'Coat Of Thorns': {
      sets: ['Armour 2', 'Growth 1'],
      traits: ['Spikey'],
      slot: 'Body',
      rarity: 'E3',
    },
    'Long Coat': {
      sets: ['Swift 2'],
      traits: ['Showoff'],
      slot: 'Body',
      rarity: 'E3',
    },

    // Head
    'Pigeon Nest': {
      sets: ['Growth 1'],
      slot: 'Head',
      rarity: 'C1',
    },
    'Paper Crown': {
      sets: ['Holy 1'],
      slot: 'Head',
      rarity: 'C1',
    },
    'Newspaper Hat': {
      sets: ['Stupidity 1'],
      traits: ['Wise'],
      slot: 'Head',
      rarity: 'C1',
    },
    'Sparkly Headband': {
      sets: ['Fire 1', 'Holy 1'],
      slot: 'Head',
      rarity: 'C2',
    },
    'Cooking Pot': {
      sets: ['Fire 1', 'Crush 1'],
      slot: 'Head',
      rarity: 'C2',
    },
    'Mail Coif': {
      sets: ['Stupidity 2'],
      traits: ['+2HP'],
      slot: 'Head',
      rarity: 'C2',
    },
    'Bone Helmet': {
      sets: ['Arcane 2'],
      slot: 'Head',
      rarity: 'C3',
    },
    'Feathered Cap': {
      sets: ['Growth 2'],
      slot: 'Head',
      rarity: 'C3',
    },
    'Bandana': {
      sets: ['Armour 1', 'Swift 1'],
      slot: 'Head',
      rarity: 'U1',
    },
    'Soldiers Helmet': {
      traits: ['+1HP'],
      slot: 'Head',
      rarity: 'U1',
    },
    'Skull Cap': {
      sets: ['Armour 2'],
      slot: 'Head',
      rarity: 'U2',
    },
    'Daisy Chain': {
      sets: ['Growth 1'],
      traits: ['+1HP'],
      slot: 'Head',
      rarity: 'U2',
    },
    'Tricorne': {
      sets: ['Blade 2'],
      slot: 'Head',
      rarity: 'U2',
    },
    'Masquerade Mask': {
      sets: ['Arcane 1', 'Holy 2'],
      slot: 'Head',
      rarity: 'U3',
    },
    'Spiky Hat': {
      sets: ['Blade 2', 'Armour 1'],
      slot: 'Head',
      rarity: 'R2',
    },
    'Fez': {
      sets: ['Arcane 2'],
      traits: ['Wise'],
      slot: 'Head',
      rarity: 'R2',
    },
    'Cultist Hood': {
      sets: ['Holy 2', 'Fire 1'],
      slot: 'Head',
      rarity: 'R2',
    },
    'Eyepatch': {
      sets: ['Swift 2'],
      slot: 'Head',
      rarity: 'R2',
    },
    'Horned Helm': {
      sets: ['Blade 1'],
      traits: ['Fury'],
      slot: 'Head',
      rarity: 'R3',
    },
    'Cavaliers Hat': {
      sets: ['Blade 1', 'Swift 2'],
      slot: 'Head',
      rarity: 'R3',
    },
    'Coral Crown': {
      traits: ['+2HP', 'Spikey'],
      slot: 'Head',
      rarity: 'R3',
    },
    'Seaweed': {
      sets: ['Armour 2', 'Growth 2'],
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
      sets: ['Holy 2'],
      traits: ['+1HP'],
      slot: 'Head',
      rarity: 'E2',
    },
    'Winged Fury': {
      sets: ['Holy 1'],
      traits: ['Retribution'],
      slot: 'Head',
      rarity: 'E3',
    },
    // Offhand
    'Wooden Stool': {
      sets: ['Crush 1', 'Stupidity 1', 'Armour 1'],
      slot: 'Offhand',
      rarity: 'C1',
    },
    'Wooden Board': {
      sets: ['Armour 1'],
      slot: 'Offhand',
      rarity: 'C1',
    },
    'Cuppa': {
      sets: ['Fire 1'],
      slot: 'Offhand',
      rarity: 'C1',
    },
    'Glyph': {
      sets: ['Arcane 1', 'Holy 1'],
      slot: 'Offhand',
      rarity: 'C2',
    },
    'Hook': {
      sets: ['Blade 1', 'Swift 1'],
      slot: 'Offhand',
      rarity: 'C2',
    },
    'Wooden Shield': {
      sets: ['Armour 1'],
      traits: ['Tenacious'],
      slot: 'Offhand',
      rarity: 'C3',
    },
    'War Horn': {
      sets: ['Holy 1', 'Growth 1', 'Fire 1'],
      slot: 'Offhand',
      rarity: 'C3',
    },
    'Leatherbound Tome': {
      sets: ['Arcane 1', 'Fire 1'],
      slot: 'Offhand',
      rarity: 'U1',
    },
    'Spyglass': {
      traits: ['Ranged'],
      slot: 'Offhand',
      rarity: 'U1',
    },
    'Heater Shield': {
      sets: ['Fire 2'],
      traits: ['+1HP'],
      slot: 'Offhand',
      rarity: 'U3',
    },
    'Conch': {
      sets: ['Arcane 3', 'Stupidity 1'],
      slot: 'Offhand',
      rarity: 'U3',
    },
    'Mariners Medallion': {
      sets: ['Holy 1'],
      traits: ['Blessed'],
      slot: 'Offhand',
      rarity: 'U3',
    },
    'Dead Lizard Charm': {
      sets: ['Arcane 2'],
      slot: 'Offhand',
      rarity: 'R1',
    },
    'Eyeball Charm': {
      sets: ['Fire 1'],
      traits: ['+1HP'],
      slot: 'Offhand',
      rarity: 'R1',
    },
    'Sea Charts': {
      sets: ['Growth 1'],
      traits: ['Wise'],
      slot: 'Offhand',
      rarity: 'R1',
    },
    'Scroll Of Souls': {
      sets: ['Holy 2', 'Arcane 2', 'Stupidity 1'],
      slot: 'Offhand',
      rarity: 'R2',
    },
    'Parrot': {
      sets: ['Crush 1', 'Growth 1'],
      traits: ['Spikey'],
      slot: 'Offhand',
      rarity: 'R2',
    },
    'Spiked Shield': {
      sets: ['Armour 1', 'Blade 2'],
      traits: ['Spikey'],
      slot: 'Offhand',
      rarity: 'R3',
    },
    'Owl Familiar': {
      sets: ['Holy 2'],
      traits: ['Wise'],
      slot: 'Offhand',
      rarity: 'R3',
    },
    'Net': {
      sets: ['Stupidity 1', 'Swift 3'],
      slot: 'Offhand',
      rarity: 'E1',
    },
    'Rum Barrel': {
      sets: ['Armour 1', 'Arcane 1'],
      traits: ['+1HP'],
      slot: 'Offhand',
      rarity: 'E1',
    },
    'Duelling Buckler': {
      sets: ['Armour 2', 'Swift 1'],
      traits: ['Tenacious'],
      slot: 'Offhand',
      rarity: 'E3',
    },
    // Weapon
    'Twig': {
      sets: ['Crush 1'],
      slot: 'Weapon',
      rarity: 'C1',
    },
    'Fork': {
      sets: ['Blade 1'],
      slot: 'Weapon',
      rarity: 'C1',
    },
    'Stiletto': {
      sets: ['Blade 1', 'Swift 1'],
      slot: 'Weapon',
      rarity: 'C2',
    },
    'Club': {
      sets: ['Crush 1', 'Growth 1'],
      slot: 'Weapon',
      rarity: 'C2',
    },
    'Anchor': {
      sets: ['Crush 2'],
      slot: 'Weapon',
      rarity: 'C2',
    },
    'Spear': {
      sets: ['Swift 2'],
      slot: 'Weapon',
      rarity: 'C3',
    },
    'Sword': {
      sets: ['Blade 2'],
      slot: 'Weapon',
      rarity: 'C3',
    },
    'Broken Bottle': {
      sets: ['Blade 1', 'Growth 1', 'Swift 1'],
      slot: 'Weapon',
      rarity: 'C3',
    },
    'Troll Femur': {
      sets: ['Stupidity 1', 'Crush 2', 'Growth 1'],
      slot: 'Weapon',
      rarity: 'U1',
    },
    'Hand-Axe': {
      sets: ['Blade 1', 'Crush 1'],
      slot: 'Weapon',
      rarity: 'U1',
    },
    'Arcane Wand': {
      sets: ['Arcane 1', 'Growth 1'],
      slot: 'Weapon',
      rarity: 'U1',
    },
    'Scimitar': {
      sets: ['Blade 2'],
      slot: 'Weapon',
      rarity: 'U2',
    },
    'Crossbow': {
      sets: ['Swift 2'],
      slot: 'Weapon',
      rarity: 'U2',
    },
    'Winged Staff': {
      sets: ['Arcane 1', 'Holy 2'],
      slot: 'Weapon',
      rarity: 'U3',
    },
    'Mace': {
      sets: ['Blade 1', 'Crush 2'],
      slot: 'Weapon',
      rarity: 'U3',
    },
    'Flintlock': {
      sets: ['Fire 2'],
      traits: ['Fury'],
      slot: 'Weapon',
      rarity: 'U3',
    },
    'Brass Knuckles': {
      sets: ['Crush 2'],
      slot: 'Weapon',
      rarity: 'R1',
    },
    'Demon Claw': {
      sets: ['Blade 2'],
      slot: 'Weapon',
      rarity: 'R1',
    },
    'Grenade': {
      sets: ['Fire 2'],
      slot: 'Weapon',
      rarity: 'R1',
    },
    'Cursed Bow': {
      sets: ['Swift 2'],
      traits: ['Decay', 'Ranged'],
      slot: 'Weapon',
      rarity: 'R3',
    },
    'Mind Staff': {
      sets: ['Arcane 1', 'Fire 1'],
      traits: ['Wise'],
      slot: 'Weapon',
      rarity: 'R3',
    },
    'Cleaver': {
      sets: ['Stupidity 1', 'Blade 1'],
      traits: ['Fury'],
      slot: 'Weapon',
      rarity: 'E1',
    },
    'Gnarled Oak': {
      sets: ['Growth 2', 'Holy 1'],
      slot: 'Weapon',
      rarity: 'E1',
    },
    'Cutlass': {
      sets: ['Blade 2'],
      traits: ['Tenacious'],
      slot: 'Weapon',
      rarity: 'E1',
    },
    'Broadsword': {
      sets: ['Crush 1'],
      traits: ['Ferocious'],
      slot: 'Weapon',
      rarity: 'E2',
    },
    'Trident': {
      sets: ['Blade 3'],
      slot: 'Weapon',
      rarity: 'E2',
    },
    'Ocean Staff': {
      sets: ['Holy 2'],
      traits: ['Blessed'],
      slot: 'Weapon',
      rarity: 'E2',
    },
    'Battle Axe': {
      sets: ['Crush 2', 'Blade 3'],
      slot: 'Weapon',
      rarity: 'E3',
    },
    'Sword of the Sea': {
      sets: ['Blade 2', 'Growth 3'],
      slot: 'Weapon',
      rarity: 'E3',
    },
  },

  traits: {
    'Level 2': {
      health: 1,
      for: 'player',
      type: 'level',
    },
    'Level 3': {
      health: 2,
      for: 'player',
      type: 'level',
    },
    'Level 4': {
      health: 3,
      for: 'player',
      type: 'level',
    },
    'Level 5': {
      health: 4,
      for: 'player',
      type: 'level',
    },
    'Warriors Might': {
      physicalNext: 1,
      for: 'player',
      type: 'trinket',
    },
    'Phlogis Tonic': {
      health: 1,
      for: 'player',
      type: 'trinket',
    },
    'Crones Discipline': {
      extraHandSize: 1,
      for: 'player',
      type: 'trinket',
    },
    'Deathwish': {
      health: 2,
    },
    'Night Owl': {
      health: -1,
    },
    'Loner': {
      health: -1,
    },
    'Crewmate': {
      health: 1,
      type: 'crewmate',
    },
    'Crewmate x2': {
      health: 2,
      type: 'crewmate',
    },
    'Crewmate x3': {
      health: 3,
      type: 'crewmate',
    },
    'Crewmate x4': {
      health: 4,
      type: 'crewmate',
    },
    'Crewmate x5': {
      health: 5,
      type: 'crewmate',
    },
    'Leader': {
      health: 1,
      type: 'leader',
    },
    'Leader x2': {
      health: 2,
      type: 'leader',
    },
    'Leader x3': {
      health: 3,
      type: 'leader',
    },
    'Leader x4': {
      health: 4,
      type: 'leader',
    },
    'Leader x5': {
      health: 5,
      type: 'leader',
    },
    'Wise': {
      extraHandSize: 1,
    },

    // Battle scars
    'Hard-headed Early': {
      health: 1,
      extraHandSize: -1,
      for: 'player',
      type: 'battle scar',
    },
    'Hard-headed Final': {
      health: 2,
      extraHandSize: -1,
      for: 'player',
      type: 'battle scar',
    },
    'Punch Drunk Early': {
      stupidity: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Punch Drunk Final': {
      stupidity: 1,
      punchDrunk: true,
      for: 'player',
      type: 'battle scar',
    },
    'Hulking Early': {
      health: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Hulking Final': {
      health: 1,
      stupidity: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Flesh Wound Early': {
      health: -1,
      for: 'player',
      type: 'battle scar',
    },
    'Flesh Wound Final': {
      health: -1,
      tenacious: true,
      for: 'player',
      type: 'battle scar',
    },
    'Hubris Final': {
      health: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Pyromaniac Early': {
      fire: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Pyromaniac Final': {
      fire: 1,
      burn: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Paranoid Early': {
      armour: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Paranoid Final': {
      armour: 1,
      stupidity: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Veteran': {
      blade: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Scarred': {
      crush: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Zealot': {
      holy: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Mystical': {
      arcane: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Naturist': {
      growth: 1,
      for: 'player',
      type: 'battle scar',
    },
    'Agile': {
      swift: 1,
      for: 'player',
      type: 'battle scar',
    },
  },
};
