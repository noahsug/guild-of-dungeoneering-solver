import GameStateAccessor from '../game-engine/game-state-accessor';
import Card from '../game-engine/card';
import Node from './node';
import _ from '../../utils/common';

export default class GameStateCache {
  constructor() {
    this.cache_ = {};
    this.healthCache_ = {};
    //this.hintCache_ = {};
    this.accessor_ = new GameStateAccessor();

    this.hashes_ = {};
    const numCards = Card.list.length;
    this.hashes_.playerDeck = this.getHashes_(numCards);
    this.hashes_.playerHand = this.getHashes_(numCards);
    this.hashes_.playerDiscardPile = this.getHashes_(numCards);
    this.hashes_.enemyDeck = this.getHashes_(numCards);
    this.hashes_.enemyHand = this.getHashes_(numCards);
    this.hashes_.enemyDiscardPile = this.getHashes_(numCards);
    this.hashes_.stats = this.getHashes_(30);

    // Keep consistant hashes for debugging purposes.
    this.hashes_.playerDeck = [479506832, 3119266331, 2060665560, 541672445, 3308394105, 866171536, 1883903402, 4262454899, 1261465003, 248268991, 3456141289, 2359664650, 1146262149, 4271907736, 830882994, 1942252331, 2895027109, 3932564983, 403896688, 485233390, 1124842140, 1356415448, 3719942824, 3554680026, 4185682957, 4196688071, 2791539881, 2424866880, 3656821474, 2776227808, 2555985782, 3848849596, 4016683238, 1131474987, 37728278, 3358433415, 1940413624, 275585130, 1756789434, 2094446920, 1967913966, 1890081582, 3423911273, 1289559173, 2007549105, 358007238, 1739968519, 10448838, 1550790731, 1053149266, 1654609131, 732088446, 3203807525, 1153835534, 130713951, 254978220, 4103487964, 531900453, 3341085665, 3079277023, 904052616, 3691591020, 1677283610, 2860412565, 1043380978, 3606213935, 2761502073, 422828547, 35209703, 641121919, 3472859344, 3241377590, 2076845347, 869228437, 3792071670, 3868363397, 727857438, 1069160242, 2368252277, 1290484298, 512297249, 3000753618, 39353399, 1627016982, 85596575, 3727464436, 2876735573, 87999932, 716537215, 3614447061, 3829823617, 151863231, 3283808252, 3693772756, 1267753899, 2434435520, 3378103376, 3691359479, 2809217197];
    this.hashes_.playerHand = [3192073901, 1569007496, 3773484173, 3686228940, 377542154, 3720353938, 4058373358, 1580019029, 1185772838, 3194278940, 2888712982, 4237720644, 3187673359, 2924113080, 2764304638, 1548139307, 745216290, 2757918250, 3716008549, 2954804878, 327199759, 3254491223, 43538430, 2793695552, 2650562946, 964554053, 2175801293, 101207240, 1750029454, 2157040828, 2171807497, 2232002947, 1043525864, 3408889566, 697165700, 1675539900, 1011686761, 828310349, 360900127, 414447554, 1071850650, 808580421, 1013010338, 979846400, 192707886, 3925452480, 707083242, 2426664453, 3110479751, 4285419282, 4178777228, 114875739, 2641298662, 1764953672, 1793307719, 2066073621, 3208412115, 2375010168, 115571357, 1939698770, 1775310805, 1869239483, 1314932932, 3195015893, 993300588, 1486440625, 868609640, 665899857, 3086065729, 187229651, 167260723, 1111962225, 3486215715, 4163711418, 2121867998, 525660073, 760077378, 1639411785, 4211613101, 3188725459, 2390033116, 3502542862, 825559908, 3255528711, 2630988577, 1760267947, 1498685754, 1586806671, 690139847, 754579123, 2932455935, 4039169572, 3827477078, 3468046679, 2439834947, 942130996, 442724826, 12553925, 1051884894];
    this.hashes_.playerDiscardPile = [1950535054, 150311089, 829495807, 2856894688, 3324355178, 4176724778, 2812610097, 1806549416, 903310933, 641547160, 1164076450, 356141006, 4034677585, 2387222758, 2677625728, 325321461, 1887408824, 1072845951, 3988768767, 3236238821, 144825519, 4033779281, 2182938447, 1414919923, 2833498295, 2192199305, 2171702655, 1717289393, 2333529842, 137209994, 2078292973, 3270140809, 236044061, 1826084408, 2912183440, 1683076329, 1169915532, 754084764, 2390399943, 924481147, 3698121809, 2638421230, 2265603592, 267736031, 1940431399, 3459200588, 1901792006, 1377561904, 2326494900, 2061842709, 3589337842, 997808081, 3230810023, 3510543875, 1374613258, 1052515132, 1688342536, 2351517475, 2405479010, 4287581483, 1588547814, 2533203280, 3105425219, 1738179062, 3375089966, 4148575318, 1178599668, 1076853645, 4208824691, 205633803, 749108608, 1708816295, 2284798623, 2067614550, 3929886920, 4097424487, 3147792366, 1482265953, 2397024710, 1385436527, 567127494, 2536321110, 730837946, 2004192054, 4294715283, 4043399094, 69002650, 703327362, 4198096628, 2229060704, 2780299148, 1204448208, 3502366964, 3049676376, 2325043842, 3181790590, 3278339179, 1507660195, 3395771799];
    this.hashes_.enemyDeck = [887594693, 2334563126, 3592849823, 620841989, 345072683, 628017652, 3968388693, 1136533314, 2773440198, 3477156, 1790910729, 2695267467, 2800725125, 3324351488, 1074485208, 3306170818, 4117909933, 749262249, 180849253, 4040234855, 1041774566, 2492674784, 1069477426, 3335435920, 999675502, 2364925511, 568887250, 851280512, 1657951436, 390797934, 1963762889, 2417831231, 196360445, 3078824755, 714556241, 4056366928, 1477062398, 564578218, 3621726174, 430318019, 322887449, 2405100675, 1989053067, 4012383663, 3306746675, 3216308243, 2461995947, 1872280950, 881069152, 4062315558, 1532441330, 2936677167, 73926535, 2694767817, 3555785309, 1120206506, 4162396452, 1861156380, 1483010047, 2750896394, 1471704820, 1938107258, 3412536724, 3001156218, 930488886, 3588429742, 4115604323, 2654158643, 2814565045, 3946217480, 4147470745, 2464696319, 3278814245, 1743564425, 4171472575, 3120109864, 1394671286, 3656105754, 3325076538, 4153892735, 984388020, 3122062549, 3218148727, 3733992603, 4250344161, 861141796, 2441952506, 2189095320, 2463812425, 326473459, 1853865989, 1670828100, 736864419, 2917804614, 3408790851, 4044957632, 4013401371, 3137682572, 3690893096];
    this.hashes_.enemyHand = [231452532, 1902261793, 2123726198, 481606204, 1506064910, 2184499355, 1935937744, 2446121789, 2426123985, 3662619663, 847496356, 673398519, 2736243076, 1774206021, 1389722262, 1096330392, 3316876833, 636261281, 924946823, 3304284058, 2170363451, 155840414, 4156949069, 2082194582, 1562103805, 2688271490, 3108937807, 720248391, 3846759189, 2307540528, 2282107577, 2973010847, 4115035554, 1360487489, 2749671630, 1341759180, 204675189, 1751028935, 2851644025, 4140562443, 2209190384, 1963897565, 4167559967, 2154210598, 1571272736, 1018194174, 764290077, 1923806765, 248197811, 3548302164, 3330326239, 688954473, 4261075824, 2446683843, 3605372115, 2310228614, 2904414816, 151087864, 1100314466, 443127587, 874097152, 2373634305, 4049345376, 2301280636, 3357478770, 68760562, 2915571134, 2023082417, 1755880791, 2739768137, 1122228527, 2836277433, 3316635631, 3897576819, 3265570409, 643799909, 3519761816, 1832267208, 775007337, 2413941501, 998451784, 2284462649, 1020414129, 1116701460, 585927294, 3879798417, 1924285824, 214799216, 1009979687, 423211101, 2281296265, 3619432908, 217280111, 2459322223, 2483631343, 57365008, 3881260098, 1082581636, 3491221125];
    this.hashes_.enemyDiscardPile = [3977587141, 1023950325, 2063154281, 2720919859, 1031618501, 3894464771, 1258842339, 106564332, 1879223222, 2437370527, 1005954447, 2053389024, 3370705721, 3764572915, 3065069171, 3851597541, 2353640545, 2574806821, 3602599155, 3662922062, 2121806748, 3082409327, 3553817122, 1298073838, 422950163, 2596832815, 976630133, 1375473379, 2034612681, 1540910934, 1220877700, 2676339903, 2376259155, 1394114581, 1091973008, 3998499421, 826341050, 3225995017, 110426208, 434171819, 205229590, 2401139088, 2951573223, 3369313397, 408768825, 1459368535, 2223960779, 2928911978, 2404062250, 367320876, 1278595708, 2546216090, 2058295732, 1365221235, 1157665483, 3489614781, 155526676, 1318404324, 3588108861, 353843554, 1220951697, 3320518746, 3941735985, 3711392807, 2197051534, 647074469, 3064240521, 4169870952, 2447183730, 3581946448, 1164730186, 1709819656, 1990351403, 279426882, 926855303, 1409699521, 4014530854, 2422718424, 724471855, 3353129315, 228562425, 1843374023, 1105913480, 405058528, 1488609270, 2178153882, 2485540963, 3536949424, 2315305175, 2409869971, 2780233913, 3448915168, 460849545, 75149504, 2554017923, 1080795607, 2240370503, 2323144549, 3945819525];
    this.hashes_.stats = [3688489011, 1905445812, 3481041665, 3001178373, 2051238122, 1732558065, 1100254499, 672747179, 2562160507, 2604289784, 1089939284, 3462076059, 1517334893, 3331583993, 1456059594, 3936810563, 1744952991, 2416201420, 847805900, 665201445, 3386175332, 1454089672, 3023763668, 1901141198, 3418464328, 1129148614, 4293769604, 2870646300, 3322820799, 773790106];
  }

  getHashes_(len) {
    const hashes = new Uint32Array(len);
    window.crypto.getRandomValues(hashes);
    return hashes;
  }

  hash(node) {
    if (node.__id === undefined) {
      node.__id = this.hashGameState_(node.gameState.state);
      //this.validateHashFunction_(node);
    }
    return node.__id;
  }

  cacheResult(node) {
    let id = this.hash(node);
    this.cache_[id] = node.result;

    if (node.result != 1 || node.result != -1) return;
    const state = node.gameState.state;
    id -= state.playerHealth * this.hashes_.stats[0] +
        state.enemyHealth * this.hashes_.stats[1];
    if (!this.healthCache_[id]) {
      this.healthCache_[id] =
          [state.playerHealth, state.enemyHealth, node.result];
    } else if (node.result == 1) {
      if (this.healthCache_[id][0] <= state.playerHealth &&
          this.healthCache_[id][1] >= state.enemyHealth) {
        this.healthCache_[id][0] = state.playerHealth;
        this.healthCache_[id][1] = state.enemyHealth;
      }
    } else if (this.healthCache_[id][0] >= state.playerHealth &&
          this.healthCache_[id][1] <= state.enemyHealth) {
      this.healthCache_[id][0] = state.playerHealth;
      this.healthCache_[id][1] = state.enemyHealth;
    }
    //this.cacheHint_(node);
  }

  //cacheHint_(node) {
  //  const parent = node.parent;
  //  if (parent.type == Node.Type.ROOT) return;
  //  this.accessor_.enemy.state = parent.gameState.state;
  //  const hash = parent.gameState.move +
  //          1000 * this.accessor_.enemy.hand[0];
  //  if (!this.hintCache_[hash]) {
  //    this.hintCache_[hash] = {count: 0, results: 0};
  //  }
  //  this.hintCache_[hash].count++;
  //  this.hintCache_[hash].results += node.result;
  //}

  getResult(node) {
    const id = this.hash(node);
    if (!this.cache_[id]) {
      const state = node.gameState.state;
      const healthId = id - state.playerHealth * this.hashes_.stats[0] -
          state.enemyHealth * this.hashes_.stats[1];
      const healthInfo = this.healthCache_[healthId];
      if (healthInfo) {
        if (healthInfo[2] == 1 &&
            healthInfo[0] <= state.playerHealth &&
            healthInfo[1] >= state.enemyHealth) {
          this.cache_[id] = 1;
        }
        if (healthInfo[2] == -1 &&
            healthInfo[0] >= state.playerHealth &&
            healthInfo[1] <= state.enemyHealth) {
          this.cache_[id] = -1;
        }
      }
    }

    return this.cache_[id];
  }

  markAsVisited(node) {
    this.cache_[this.hash(node)] = 0;
  }

  markAsUnvisited(node) {
    this.cache_[this.hash(node)] = undefined;
  }

  hasVisitedWithNoResult(node) {
    return this.cache_[this.hash(node)] === 0;
  }

  hashGameState_(state) {
    let hash = this.hashCards_(state.playerDeck, this.hashes_.playerDeck) +
        this.hashCards_(state.playerHand, this.hashes_.playerHand) +
        this.hashCards_(state.playerDiscardPile,
                        this.hashes_.playerDiscardPile) +
        this.hashCards_(state.enemyDeck, this.hashes_.enemyDeck) +
        this.hashCards_(state.enemyHand, this.hashes_.enemyHand) +
        this.hashCards_(state.enemyDiscardPile,
                        this.hashes_.enemyDiscardPile) +
        this.hashStats_(state);

    if (state.playerDraw != undefined) {
      const playerCard = state.playerDeck[state.playerDraw];
      const enemyCard = state.enemyDeck[state.enemyDraw];
      hash += this.hashes_.playerHand[playerCard] -
          this.hashes_.playerDeck[playerCard] +
          this.hashes_.enemyHand[enemyCard] -
          this.hashes_.enemyDeck[enemyCard];
    }
    return hash;
  }

  hashCards_(cards, hashes) {
    let result = 0;
    const len = cards.length;
    for (let i = 0; i < len; i++) {
      result += hashes[cards[i]];
    }
    return result;
  }

  hashStats_(state) {
    // TODO: Implement conceal and predictable.
    return state.playerHealth * this.hashes_.stats[0] +
        state.enemyHealth * this.hashes_.stats[1] +
        (state.playerMagicNextEffect || 0) * this.hashes_.stats[2] +
        (state.playerPhysicalNextEffect || 0) * this.hashes_.stats[3] +
        (state.playerMagicRoundEffect || 0) * this.hashes_.stats[4] +
        (state.playerPhysicalRoundEffect || 0) * this.hashes_.stats[5] +
        (state.playerWithstandEffect || 0) * this.hashes_.stats[11] +
        (state.enemyMagicNextEffect || 0) * this.hashes_.stats[6] +
        (state.enemyMagicNextEffect || 0) * this.hashes_.stats[7] +
        (state.enemyMagicRoundEffect || 0) * this.hashes_.stats[8] +
        (state.enemyPhysicalRoundEffect || 0) * this.hashes_.stats[9] +
        (state.enemyRum || 0) * this.hashes_.stats[10];
  }

  //validateHashFunction_(node) {
  //  const {player, enemy} = this.accessor_;
  //  const clone = {
  //    v1: player.deck.sort(),
  //    v2: player.hand.sort(),
  //    v3: player.discardPile.sort(),
  //    v4: enemy.deck.sort(),
  //    v5: enemy.hand.sort(),
  //    v6: enemy.discardPile.sort(),
  //    v7: enemy.health,
  //    v8: player.health,
  //  };
  //  const testId = JSON.stringify(clone);
  //  if (!this.testCache_) this.testCache_ = {};
  //  if (this.testCache_[node.__id] != this.testCache_[testId]) {
  //    console.log(node, this.testCache_[node.__id], this.testCache_[testId]);
  //    _.fail();
  //  }
  //  this.testCache_[node.__id] = node;
  //  this.testCache_[testId] = node;
  //}
}
