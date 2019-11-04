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
}

let turnNo = 1;

if (targets[0] === 3) {
  console.log('GOLD TOP');
}
if (targets[0] === 5) {
  console.log('GOLD MIDDLE');
}
if (targets[0] === 7) {
  console.log('GOLD BOTTOM');
}

let oldBoard = null;
let move = null;
let saboteurNo = 1;
let diggerNo = 1;
let operationTarget = null;

while (playersData[playersNo - 1].cards.length > 0) {

  operationTarget = null;

  console.log(' ');
  console.log('TURN ' + turnNo++);
  saboteurNo = 1;
  diggerNo = 1;
  for (let i = 0; i < playersNo; ++i) {
    // console.log(' ');
    // console.log((playersData[i].role === 1 ? 'Saboteur ' + saboteurNo++  : 'Digger ' + diggerNo++) + ', player ' + (i + 1));
    console.log('Player ' + (i+1) + ', ' + playersData[i].name);

    console.log(playersData[i].pickaxe + ' ' + playersData[i].truck + ' ' + playersData[i].lamp);

    move = calculateMove(playersData, i, maxSaboteurs, board, turnNo);
    oldBoard = cloneBoard(board);

    board = move.board;
    playersData = move.playersData;

    console.log(move.description);

    // console.log('PROBABILITIEs');
    // console.log(calculateTargetsPropabilities(playersData, i, maxSaboteurs));

    checkTargets(board, move.i, move.j, playersData);
    
    graphBoard(board);
    // console.log('KARMAS');
    // for (let i = 0; i < playersNo; ++i) {
    //   console.log(playersData[i].karmas);
    // }

    if (shuffled.length > 0) {
      playersData[i].cards.push(shuffled.pop());
    }
  }
}

console.log('SABOTEURS WIN');
finalReveal(playersData, board, true);
process.exit(0);
