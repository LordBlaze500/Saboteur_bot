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
  findShortestPath,
  flattenNodesTree,
  anyCardsLeft,
  prepareSaboteurAccuses,
  getCardsForPlayer,
  chatMessage,
  getCardsDescriptions,
} = require('./utils');
const { consoleSpam } = require('./debugVars');

let board = prepareBoard();

const shuffled = shuffle([...deck]);

const playersNo = 5;
const maxSaboteurs = getMaxSaboteurs(playersNo);
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
    cards: getCardsForPlayer(shuffled, playersNo),
    karmas: initiateKarmas(playersNo, roles[i], maxSaboteurs, i, playersConfigs[playersNo]),
    claims: getClaimsArray(playersNo),
    targetsKnowledge: [0, 0, 0],
    cardsAmountsInGame: [],
    saboteurAccuses: prepareSaboteurAccuses(playersNo),
  })
}

for (let i = 0; i < playersNo; ++i) {
  playersData[i].cardsAmountsInGame = initiateCardsAmounts(playersData[i].cards);
  playersData[i].strategy = getInitialStrategy(playersData, i);
  if (consoleSpam) {
    console.log(playersData[i].strategy);
  }
}

let turnNo = 1;

let oldBoard = null;
let move = null;
let saboteurNo = 1;
let diggerNo = 1;
let operationTarget = null;

while (anyCardsLeft(playersData)) {

  operationTarget = null;

  console.log(' ');
  console.log('TURN ' + turnNo);
  console.log('Cards in deck: ' + shuffled.length);
  saboteurNo = 1;
  diggerNo = 1;
  for (let i = 0; i < playersNo; ++i) {
    console.log(' ');
    console.log('Player ' + (i + 1) + ', "' + playersData[i].name + '"');

    console.log('Pickaxe: ' + playersData[i].pickaxe + ', truck: ' + playersData[i].truck + ', lamp: ' + playersData[i].lamp);

    if (!playersData[i].cards.length) {
      chatMessage(playersData, i, 'I don\'t have any cards.')
      continue;
    }

    if (consoleSpam) {
      console.log(getCardsDescriptions(playersData[i].cards));
    }

    move = getBestMove(playersData, i, maxSaboteurs, board, turnNo);
    oldBoard = cloneBoard(board);

    board = move.board;
    playersData = move.playersData;

    console.log(move.description);

    if (consoleSpam) {
      console.log('PROBABILITIEs');
      console.log(calculateTargetsPropabilities(playersData, i, maxSaboteurs));
    }

    // console.log('CLAIMS');
    // for (let i = 0; i < playersData.length; ++i) {
    //   console.log(playersData[i].claims);
    // }

    checkTargets(board, move.i, move.j, playersData);
    
    graphBoard(board);
    if (consoleSpam) {
      console.log('KARMAS');
      for (let i = 0; i < playersNo; ++i) {
        console.log(playersData[i].karmas);
      }
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
