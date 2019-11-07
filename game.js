const { deck } = require('./deck');
const { playersConfigs, getMaxSaboteurs } = require('./playersConfigs');
const { graphBoard } = require('./graphBoard');
const { 
  boardPiece, 
  cloneBoard, 
  shuffle,
  markPossiblePoints, 
  markAccessiblity, 
  checkConnections, 
  canCardBeBuilt, 
  refreshAccess,
  buildCard,
  doRockFall,
  flipCard,
  prepareBoard,
  diggersVictory,
  checkTargets,
  calculateMove,
  evaluateBoard,
  getDistanceToTarget,
  getClaimsArray,
  isGoldKnown,
  addKnowledge,
  useMap,
  calculateTargetsPropabilities,
  initiateKarmas,
  isDeadEndCard,
  complementKarmas,
  updateKarmasValues,
  updateKarmas,
  makeClaim,
  sabsNoChances,
  initiateCardsAmounts,
  removeCardFromCardsAmounts,
  finalReveal,
  getInitialStrategy,
  getBestMove,
  targets,
} = require('./utils');

let board = prepareBoard();

const shuffled = shuffle([...deck]);

const playersNo = 5;
const maxSaboteurs = getMaxSaboteurs(5);
const roles = shuffle(playersConfigs[playersNo]); 

let playersData = [];
for (let i = 0; i < playersNo; ++i) {
  playersData.push({
    name: 'Bot ' + (i + 1),
    id: i,
    role: roles[i],
    pickaxe: true,
    truck: true,
    lamp: true,
    cards: [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()],
    karmas: initiateKarmas(playersNo, roles[i], maxSaboteurs, i, playersConfigs[playersNo]),
    claims: getClaimsArray(playersNo),
    targetsKnowledge: [0, 0, 0],
    cardsAmountsInGame: [],
  })
}

for (let i = 0; i < playersNo; ++i) {
  playersData[i].cardsAmountsInGame = initiateCardsAmounts(playersData[i].cards);
  playersData[i].strategy = getInitialStrategy(playersData, i);
  console.log(playersData[i].strategy);
}

let turnNo = 1;

let oldBoard = null;
let move = null;
let saboteurNo = 1;
let diggerNo = 1;
let operationTarget = null;

const getCardsDescriptions = (card) => {
  let descriptions = [];
  for (let i = 0; i < card.length; ++i) {
    if (card[i].type === 0) {
        descriptions.push('┼');
      }
      if (card[i].type === 1) {
        descriptions.push('┴');
      }
      if (card[i].type === 2) {
        descriptions.push('┤');
      }
      if (card[i].type === 12) {
        descriptions.push('┘');
      }
      if (card[i].type === 3) {
        descriptions.push('│');
      }
      if (card[i].type === 4) {
        descriptions.push('¡');
      }
      if (card[i].type === 5) {
        descriptions.push('║');
      }
      if (card[i].type === 6) {
        descriptions.push('╬');
      }
      if (card[i].type=== 7) {
        descriptions.push('╩');
      }
      if (card[i].type === 8) {
        descriptions.push('═');
      }
      if (card[i].type === 9) {
        descriptions.push('─');
      }
      if (card[i].type === 10) {
        descriptions.push('»');
      }
      if (card[i].type === 11) {
        descriptions.push('╚');
      }
      if (card[i].type === 13) {
        descriptions.push('└');
      }
      if (card[i].type === 14) {
        descriptions.push('╣');
      }
      if (card[i].type === 15) {
        descriptions.push('╝');
      }
      if (card[i].type === 16) {
        descriptions.push('map');
      }
      if (card[i].type === 17) {
        descriptions.push('rockfall');
      }
      if (card[i].type === 18) {
        descriptions.push('break_pickaxe');
      }
      if (card[i].type === 19) {
        descriptions.push('break_truck');
      }
      if (card[i].type === 20) {
        descriptions.push('break_lamp');
      }
      if (card[i].type === 21) {
        descriptions.push('fix_pickaxe');
      }
      if (card[i].type === 22) {
        descriptions.push('fix_truck');
      }
      if (card[i].type === 23) {
        descriptions.push('fix_lamp');
      }
      if (card[i].type === 24) {
        descriptions.push('fix_truck_lamp');
      }
      if (card[i].type === 25) {
        descriptions.push('fix_pickaxe_truck');
      }
      if (card[i].type === 26) {
        descriptions.push('fix_pickaxe_lamp');
      }
  }
  return descriptions;
}

while (playersData[playersNo - 1].cards.length > 0) {

  operationTarget = null;

  console.log(' ');
  console.log('TURN ' + turnNo);
  console.log('Cards in deck: ' + shuffled.length);
  console.log(' ');
  saboteurNo = 1;
  diggerNo = 1;
  for (let i = 0; i < playersNo; ++i) {
    // console.log(' ');
    // console.log((playersData[i].role === 1 ? 'Saboteur ' + saboteurNo++  : 'Digger ' + diggerNo++) + ', player ' + (i + 1));
    console.log('Player ' + (i + 1) + ', "' + playersData[i].name + '"');

    console.log('Pickaxe: ' + playersData[i].pickaxe + ', truck: ' + playersData[i].truck + ', lamp: ' + playersData[i].lamp);

    console.log(getCardsDescriptions(playersData[i].cards));

    move = getBestMove(playersData, i, maxSaboteurs, board, turnNo);
    oldBoard = cloneBoard(board);

    board = move.board;
    playersData = move.playersData;

    console.log(move.description);

    console.log('PROBABILITIEs');
    console.log(calculateTargetsPropabilities(playersData, i, maxSaboteurs));

    // console.log('CLAIMS');
    // for (let i = 0; i < playersData.length; ++i) {
    //   console.log(playersData[i].claims);
    // }

    checkTargets(board, move.i, move.j, playersData);
    
    graphBoard(board);
    console.log('KARMAS');
    for (let i = 0; i < playersNo; ++i) {
      console.log(playersData[i].karmas);
    }

    if (shuffled.length > 0) {
      playersData[i].cards.push(shuffled.pop());
    }
  }
  ++turnNo;
}

console.log('SABOTEURS WIN');
finalReveal(playersData, board, true);
process.exit(0);
