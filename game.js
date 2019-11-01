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
    karmas: initiateKarmas(playersNo, roles[i], maxSaboteurs, i),
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

const isDeadEndCard = (cardType) => {
  const deadEndsTypes = [0, 1, 2, 3, 4, 9, 10, 12, 13];
  return deadEndsTypes.includes(cardType);
}

const complementKarmas = (karmasArray, maxSaboteurs) => {
  const newKarmasArray = [...karmasArray];
  const zeroKarmaPlayers = newKarmasArray.filter((el) => el === 0);
  const hundredKarmaPlayers = newKarmasArray.filter((el) => el === 100);
  if (hundredKarmaPlayers.length === maxSaboteurs) {
    for (let i = 0; i < newKarmasArray.length; ++i) {
      if (newKarmasArray[i] !== 100) {
        newKarmasArray[i] = 0;
      }
    }
    return newKarmasArray;
  }
  if (zeroKarmaPlayers.length === newKarmasArray.length - maxSaboteurs + 1) {
    for (let i = 0; i < newKarmasArray.length; ++i) {
      if (newKarmasArray[i] !== 0) {
        newKarmasArray[i] = 100;
      }
    }
    return newKarmasArray;
  }
  return karmasArray;
}

const updateKarmasValues = (karmasArray, index, value, maxSaboteurs) => {
  if (karmasArray[index] === value || karmasArray[index] === 0 || karmasArray[index] === 100) {
    return karmasArray;
  }

  let newKarmasArray = [...karmasArray];
  const difference = value - karmasArray[index];
  newKarmasArray[index] = value;

  let remainingDifference = 0;
  let nonConfirmedPlayers = newKarmasArray.filter((el) => (el !== 0 && el !== 100));
  let valueToSplit = Math.floor(difference / nonConfirmedPlayers.length);
  for (let i = 0; i < newKarmasArray.length; ++i) {
    if (newKarmasArray[i] !== 0 && newKarmasArray[i] !== 100) {
      newKarmasArray[i] -= valueToSplit;
      if (newKarmasArray[i] < 0) {
        remainingDifference = -newKarmasArray[i];
        newKarmasArray[i] = 0;
      }
    }
  }

  nonConfirmedPlayers = newKarmasArray.filter((el) => (el !== 0 && el !== 100));
  valueToSplit = Math.floor(remainingDifference / nonConfirmedPlayers.length);
  for (let i = 0; i < newKarmasArray.length; ++i) {
    if (newKarmasArray[i] !== 0 && newKarmasArray[i] !== 100) {
      newKarmasArray[i] -= valueToSplit;
    }
  }

  newKarmasArray = complementKarmas(newKarmasArray, maxSaboteurs);

  return newKarmasArray;
}

const updateKarmas = (playersData, playerIndex, operation, cardType, maxSaboteurs, oldBoard, newBoard) => {
  if (operation === 'build') {
    let currentEval = null;
    let newEval = null;
    let probs = null;

    for (let i = 0; i < playersData.length; ++i) {
      probs = calculateTargetsPropabilities(playersData[i].targetsKnowledge);
      currentEval = evaluateBoard(oldBoard, probs[0], probs[1], probs[2]);
      newEval = evaluateBoard(newBoard, probs[0], probs[1], probs[2]);

      if (isDeadEndCard(cardType)) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
      }
      if (newEval < currentEval) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, playersData[i].karmas[playerIndex] - Math.floor(currentEval - newEval) * 10, maxSaboteurs);
      }

    }
  } else if (operation === 'rockfall') {
    let currentEval = null;
    let newEval = null;
    let probs = null;
    for (let i = 0; i < playersData.length; ++i) {
      probs = calculateTargetsPropabilities(playersData[i].targetsKnowledge);
      currentEval = evaluateBoard(oldBoard, probs[0], probs[1], probs[2]);
      newEval = evaluateBoard(newBoard, probs[0], probs[1], probs[2]);

      if (newEval > currentEval) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
      }
      if (newEval < currentEval) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 0, maxSaboteurs);
      }

    }
  }
}

while (playersData[playersNo - 1].cards.length > 0) {
  console.log('TURN ' + turnNo++);
  saboteurNo = 1;
  diggerNo = 1;
  for (let i = 0; i < playersNo; ++i) {
    console.log((playersData[i].role === 1 ? 'Saboteur ' + saboteurNo++  : 'Digger ' + diggerNo++) + ', player ' + (i + 1));

    move = calculateMove(
      playersData[i].cards, 
      playersData[i].role === 1,
      board,
      calculateTargetsPropabilities(playersData[i].targetsKnowledge),
      playersData[i].targetsKnowledge
    );
    oldBoard = cloneBoard(board);
    if (move.operation === 'build') {
      console.log('BUILD');
      board = cloneBoard(move.board);
    } else if (move.operation === 'rockfall') {
      console.log('ROCKFALL');
      board = cloneBoard(move.board);
    } else if (move.operation === 'throwaway') {
      console.log('THROWAWAY');
    } else if (move.operation === 'map') {
      console.log('MAP');
      playersData[i].targetsKnowledge = move.knowledge;
    }

    updateKarmas(playersData, i, move.operation, move.cardType, maxSaboteurs, oldBoard, board);

    checkTargets(board, move.i, move.j);
    
    graphBoard(board);
    console.log('KARMAS');
    for (let i = 0; i < playersNo; ++i) {
      console.log(playersData[i].karmas);
    }

    playersData[i].cards.splice(move.cardIndex, 1);
    if (shuffled.length > 0) {
      playersData[i].cards.push(shuffled.pop());
    }
  }
}

console.log('SABOTEURS WIN');
process.exit(0);
