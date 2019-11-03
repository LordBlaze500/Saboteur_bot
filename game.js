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
  targets,
} = require('./utils');

let board = prepareBoard();

const shuffled = shuffle([...deck]);

const playersNo = 5;
const maxSaboteurs = getMaxSaboteurs(5);
const roles = shuffle(playersConfigs[playersNo]); 

const playersData = [];
for (let i = 0; i < playersNo; ++i) {
  playersData.push({
    id: i,
    role: roles[i],
    pickaxe: true,
    truck: true,
    lamp: true,
    cards: [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()],
    karmas: initiateKarmas(playersNo, roles[i], maxSaboteurs, i, playersConfigs[playersNo]),
    claims: getClaimsArray(playersNo),
    targetsKnowledge: [0, 0, 0]
  })
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
    console.log(' ');
    console.log((playersData[i].role === 1 ? 'Saboteur ' + saboteurNo++  : 'Digger ' + diggerNo++) + ', player ' + (i + 1));
    console.log(playersData[i].pickaxe + ' ' + playersData[i].truck + ' ' + playersData[i].lamp);

    move = calculateMove(playersData, i, maxSaboteurs, board);

console.log('PROBABILITIEs');
console.log(calculateTargetsPropabilities(playersData, i, maxSaboteurs));

    oldBoard = cloneBoard(board);
    if (move.operation === 'build') {
      console.log('BUILD');
      board = cloneBoard(move.board);
    } else if (move.operation === 'rockfall') {
      console.log('ROCKFALL');
      board = cloneBoard(move.board);
    } else if (move.operation === 'throwaway') {
      console.log('THROWAWAY');
      console.log(playersData[i].cards[move.cardIndex]);
    } else if (move.operation === 'map') {
      console.log('MAP');
      playersData[i].targetsKnowledge = move.knowledge;
      makeClaim(playersData, i, move.target, playersData[i].targetsKnowledge[move.target], maxSaboteurs);
    } else if (move.operation === 'block') {
      console.log('BLOCK ' + (move.blockTarget + 1) + ' by ' + move.blockType);
      console.log(move.value);
      playersData[move.blockTarget][move.blockType] = false;
      operationTarget = move.blockTarget;
    } else if (move.operation === 'fix') {
      console.log('FIX ' + (move.fixTarget + 1) + ' by ' + move.fixType);
      console.log(move.value);
      playersData[move.fixTarget][move.fixType] = true;
      operationTarget = move.fixTarget;
    }

    updateKarmas(playersData, i, move.operation, move.cardType, maxSaboteurs, oldBoard, board, operationTarget);

    checkTargets(board, move.i, move.j);
    
    graphBoard(board);
    console.log('KARMAS');
    for (let i = 0; i < playersNo; ++i) {
      console.log(playersData[i].karmas);
    }

    // console.log('CLAIMS');
    // for (let i = 0; i < playersNo; ++i) {
    //   console.log(playersData[i].claims);
    // }

    // console.log('KNOWLEDGES');
    // for (let i = 0; i < playersNo; ++i) {
    //   console.log(playersData[i].targetsKnowledge);
    // }

    playersData[i].cards.splice(move.cardIndex, 1);
    if (shuffled.length > 0) {
      playersData[i].cards.push(shuffled.pop());
    }
  }
}

console.log('SABOTEURS WIN');
process.exit(0);
