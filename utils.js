const { deck } = require('./deck');
const { graphBoard } = require('./graphBoard');
const fs = require('fs');

const debug = false;
let debugTurn = 1;
let debugPlayer = 1;

const boardPiece = {
  cardType: -1,
  flipped: false,
  special: null,
  buildable: false,
  accessible: false,
};

const boardWidth = 14;
const boardHeight = 11;

const sortAsc = (a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

const sortDesc = (a, b) => {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

const sortAscByValue = (a, b) => {
  if (a.value > b.value) {
    return 1;
  }
  if (a.value < b.value) {
    return -1;
  }
  return 0;
}

const sortDescByValue = (a, b) => {
  if (a.value > b.value) {
    return -1;
  }
  if (a.value < b.value) {
    return 1;
  }
  return 0;
}

const cloneBoard = (board) => {
  const copyBoard = [];
  copyBoard.length = boardHeight;
  for (let i = 0; i < board.length; ++i) {
    copyBoard[i] = [];
    copyBoard[i].width = boardWidth;
  }
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[i].length; ++j) {
      copyBoard[i][j] = {
        ...board[i][j]
      }
    }
  }
  return copyBoard;
}

const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const markPossiblePoints = (board) => {
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[i].length; ++j) {
      board[i][j].buildable = false;
      if (i > 0 && (board[i - 1][j].cardType > -1 || board[i - 1][j].special === 'start')) {
        board[i][j].buildable = true;
        continue;
      }
      if (i < (boardHeight - 1) && (board[i + 1][j].cardType > -1 || board[i + 1][j].special === 'start')) {
        board[i][j].buildable = true;
        continue;
      }
      if (j > 0 && (board[i][j - 1].cardType > -1 || board[i][j - 1].special === 'start')) {
        board[i][j].buildable = true;
        continue;
      }
      if (j < (boardWidth - 1) && (board[i][j + 1].cardType > -1 || board[i][j + 1].special === 'start')) {
        board[i][j].buildable = true;
        continue;
      }
    }
  }
}

const markAccessiblity = (board) => {
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[i].length; ++j) {
      board[i][j].accessible = false;
    }
  }
  board[5][2].accessible = true;
  checkConnections(board, 5, 2);
}

const checkConnections = (board, i, j) => {
  if (board[i][j].outUp && i > 0) {
    if (board[i - 1][j].cardType === -1) {
      board[i - 1][j].accessible = true;
    }
    if (board[i - 1][j].cardType !== -1 && board[i - 1][j].accessible !== true && board[i - 1][j].inDown) {
      board[i - 1][j].accessible = true;
      checkConnections(board, i - 1, j);
    }
  }

  if (board[i][j].outDown && i < (boardHeight - 1)) {
    if (board[i + 1][j].cardType === -1) {
      board[i + 1][j].accessible = true;
    }
    if (board[i + 1][j].cardType !== -1 && board[i + 1][j].accessible !== true && board[i + 1][j].inUp) {
      board[i + 1][j].accessible = true;
      checkConnections(board, i + 1, j);
    }
  }

  if (board[i][j].outLeft && j > 0) {
    if (board[i][j - 1].cardType === -1) {
      board[i][j - 1].accessible = true;
    }
    if (board[i][j - 1].cardType !== -1 && board[i][j - 1].accessible !== true && board[i][j - 1].inRight) {
      board[i][j - 1].accessible = true;
      checkConnections(board, i, j - 1);
    }
  }

  if (board[i][j].outRight && j < (boardWidth - 1)) {
    if (board[i][j + 1].cardType === -1) {
      board[i][j + 1].accessible = true;
    }
    if (board[i][j + 1].cardType !== -1 && board[i][j + 1].accessible !== true && board[i][j + 1].inLeft) {
      board[i][j + 1].accessible = true;
      checkConnections(board, i, j + 1);
    }
  }
}

const canCardBeBuilt = (board, card, i, j) => {
  const clone = cloneBoard(board);
  if (clone[3][10].cardType < 0) {
    clone[3][10] = {...boardPiece};
  }
  if (clone[5][10].cardType < 0) {
    clone[5][10] = {...boardPiece};
  }
  if (clone[7][10].cardType < 0) {
    clone[7][10] = {...boardPiece};
  }

  if (clone[i][j].cardType !== -1 || clone[i][j].buildable !== true || clone[i][j].accessible !== true || card.type > 15) {
    return false;
  }
  if (i > 0 && clone[i - 1][j].cardType !== -1 && card.inUp !== clone[i - 1][j].inDown) {
    return false;
  }
  if (i < (boardHeight - 1) && clone[i + 1][j].cardType !== -1 && card.inDown !== clone[i + 1][j].inUp) {
    return false;
  }
  if (j > 0 && clone[i][j - 1].cardType !== -1 && card.inLeft !== clone[i][j - 1].inRight) {
    return false;
  }
  if (j < (boardWidth - 1) && clone[i][j + 1].cardType !== -1 && card.inRight !== clone[i][j + 1].inLeft) {
    return false;
  }

  return true;
}

const refreshAccess = (board) => {
  markPossiblePoints(board);
  markAccessiblity(board);
}

const buildCard = (board, card, i, j, flipped) => {
  board[i][j] = {
    ...card,
    special: null,
    cardType: card.type,
    accessible: false,
    flipped,
  };
  refreshAccess(board);
}

const doRockFall = (board, i, j) => {
  board[i][j] = {
    ...boardPiece,
  }
  refreshAccess(board);
}

const flipCard = (card) => {
  if (card.flippable) {
    let newCard = {
      ...card,
      inUp: card.inDown,
      inDown: card.inUp,
      inLeft: card.inRight,
      inRight: card.inLeft,
      outUp: card.outDown,
      outDown: card.outUp,
      outLeft: card.outRight,
      outRight: card.outLeft
    }
    return newCard;
  }
  return card;
}

const targets = shuffle([3,5,7]);

const prepareBoard = () => {
  let board = [];

  for (let i = 0; i < boardHeight; ++i) {
    let b = [];
    for (let j = 0; j < boardWidth; ++j) {
      b.push({ ...boardPiece });
    }
    board.push(b);
  }

  board[5][2] = {
    cardType: -2,
    flipped: false,
    special: 'start',
    inUp: true,
    inDown: true, 
    inLeft: true, 
    inRight: true, 
    outUp: true, 
    outDown: true, 
    outLeft: true, 
    outRight: true, 
  }

  board[targets[0]][10] = {
    cardType: -3,
    flipped: false,
    special: 'gold',
    inUp: true,
    inDown: true, 
    inLeft: true, 
    inRight: true, 
    outUp: true, 
    outDown: true, 
    outLeft: true, 
    outRight: true,
  }

  board[targets[1]][10] = {
    cardType: -4,
    flipped: false,
    special: 'coal',
    inUp: true,
    inDown: true, 
    inLeft: true, 
    inRight: true, 
    outUp: true, 
    outDown: true, 
    outLeft: true, 
    outRight: true,
  }

  board[targets[2]][10] = {
    cardType: -5,
    flipped: false,
    special: 'coal',
    inUp: true,
    inDown: true, 
    inLeft: true, 
    inRight: true, 
    outUp: true, 
    outDown: true, 
    outLeft: true, 
    outRight: true,
  }

  markPossiblePoints(board);
  markAccessiblity(board);

  return board;
}

const diggersVictory = (playersData) => {
  console.log('DIGGERS WIN');
  finalReveal(playersData, null, false);
  process.exit(0);
}

const isGoldRevealed = (board) => board[targets[0]][10].accessible === true;

const targetCoordsToKnowledgeNumber = (coord) => {
  if (coord === 3) {
    return 0;
  } else if (coord === 5) {
    return 1;
  } else {
    return 2;
  }
}

const checkTargets = (board, i, j, playersData, withoutGold) => {
  const gold = board[targets[0]][10];
  const coalOne = board[targets[1]][10];
  const coalTwo = board[targets[2]][10];
  let returnValue = false;

  if (gold.accessible === true && !withoutGold) {
    graphBoard(board);
    diggersVictory(playersData);
  }
  if (coalOne.accessible === true && coalOne.cardType < 0) {
    if (i < targets[1] || j < 10) {
      buildCard(board, {...deck[36]}, targets[1], 10, false);
    } else {
      buildCard(board, flipCard({...deck[36]}), targets[1], 10, true);
    }
    for (let a = 0; a < playersData.length; ++a) {
      playersData[a].targetsKnowledge = addKnowledge(playersData[a].targetsKnowledge, targetCoordsToKnowledgeNumber(targets[1]), -1);
    }
    returnValue = true;
  }
  if (coalTwo.accessible === true && coalTwo.cardType < 0) {
    if (i < targets[2] || j > 10) {
      buildCard(board, {...deck[25]}, targets[2], 10, false);
    } else {
      buildCard(board, flipCard({...deck[25]}), targets[2], 10, true);
    }
    for (let a = 0; a < playersData.length; ++a) {
      playersData[a].targetsKnowledge = addKnowledge(playersData[a].targetsKnowledge, targetCoordsToKnowledgeNumber(targets[2]), -1);
    }
    returnValue = true;
  }
  return returnValue;
}

const isGoldKnown = (knowledge) => {
  const stringArray = JSON.stringify(knowledge);
  if (stringArray === JSON.stringify([-1,1,-1])) {
    return true;
  }
  if (stringArray === JSON.stringify([1,-1,-1])) {
    return true;
  }
  if (stringArray === JSON.stringify([-1,-1,1])) {
    return true;
  }
  return false;
}

const addKnowledge = (orgKnowledge, target, value) => {
  let knowledge = [...orgKnowledge];
  if (target === 0 && value === 1) {
    knowledge = [1,-1,-1];
  }
  if (target === 1 && value === 1) {
    knowledge = [-1,1,-1];
  }
  if (target === 2 && value === 1) {
    knowledge = [-1,-1,1];
  }
  if (target === 0 && value === -1) {
    knowledge[0] = -1;
  }
  if (target === 1 && value === -1) {
    knowledge[1] = -1;
  }
  if (target === 2 && value === -1) {
    knowledge[2] = -1;
  }

  if (JSON.stringify(knowledge) === JSON.stringify([-1,-1,0])) {
    knowledge = [-1, -1, 1];
  }
  if (JSON.stringify(knowledge) === JSON.stringify([-1,0,-1])) {
    knowledge = [-1, 1, -1];
  }
  if (JSON.stringify(knowledge) === JSON.stringify([0,-1,-1])) {
    knowledge = [1, -1, -1];
  }
  return knowledge;
}

const targetToString = (target) => {
  if (target === 0) {
    return 'top';
  } else if (target === 1) {
    return 'middle';
  }
  return 'bottom';
}

const prepareSaboteurAccuses = (playersLength) => {
  const result = [];
  result.length = playersLength;
  for (let i = 0; i < playersLength; ++i) {
    result[i] = 0;
  }
  return result;
}

const getCardsForPlayer = (shuffled, playersNo) => {
  if (playersNo <= 5) {
    return [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
  }
  if (playersNo <= 7) {
    return [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
  }
  return [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
}

const findClaimsConflicts = (playersData, maxSaboteurs) => {
  let ownKnowledge = null;
  for (let i = 0; i < playersData.length; ++i) {
    ownKnowledge = playersData[i].targetsKnowledge;
    for (let j = 0; j < playersData.length; ++j) {
      if (j !== i) {
        if (ownKnowledge[0] === 1 && playersData[i].claims[j][0] === -1) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, j, 100, maxSaboteurs);
        }
        if (ownKnowledge[0] === -1 && playersData[i].claims[j][0] === 1) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, j, 100, maxSaboteurs);
        }
        if (ownKnowledge[1] === 1 && playersData[i].claims[j][1] === -1) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, j, 100, maxSaboteurs);
        }
        if (ownKnowledge[1] === -1 && playersData[i].claims[j][1] === 1) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, j, 100, maxSaboteurs);
        }
        if (ownKnowledge[2] === 1 && playersData[i].claims[j][2] === -1) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, j, 100, maxSaboteurs);
        }
        if (ownKnowledge[2] === -1 && playersData[i].claims[j][2] === 1) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, j, 100, maxSaboteurs);
        }
      }
    }
  }
}

const makeClaim = (playersData, playerIndex, target, value, maxSaboteurs) => {
  let descriptionString = '';
  if (playersData[playerIndex].role === 1) {
    if (playersData[playerIndex].strategy === 'saboteur_aggressive') {
      descriptionString = 'Using map on ' + targetToString(target) + ', I refuse to say.';
      for (let i = 0; i < playersData.length; ++i) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
      }
    } else {
      descriptionString = 'Using map on ' + targetToString(target) + ', it is ' + (value === 1 ? 'coal' : 'gold') + '.';
      for (let i = 0; i < playersData.length; ++i) {
        playersData[i].claims[playerIndex][target] = -value;
      }
      findClaimsConflicts(playersData, maxSaboteurs);
    }
  } else {
    descriptionString = 'Using map on ' + targetToString(target) + ', it is ' + (value === 1 ? 'gold' : 'coal') + '.';
    for (let i = 0; i < playersData.length; ++i) {
      playersData[i].claims[playerIndex][target] = value;
    }
    findClaimsConflicts(playersData, maxSaboteurs);
  }
  return descriptionString;
}

const useMap = (board, knowledge, propabilities) => {
  let target = null;
  let propabilitiesWithIndexes = [
    { prob: propabilities[1], index: 1 },
    { prob: propabilities[0], index: 0 },
    { prob: propabilities[2], index: 2 }
  ];
  propabilitiesWithIndexes.sort((a, b) => {
    if (a.prob > b.prob) {
      return -1;
    }
    if (a.prob < b.prob) {
      return 1;
    }
    return 0;
  });

  const targetToAim = propabilitiesWithIndexes[0].index;

  if (targetToAim === 0) {
    knowledge = addKnowledge(knowledge, 0, board[3][10].special === 'gold' ? 1 : -1);
  } else if (targetToAim === 1) {
    knowledge = addKnowledge(knowledge, 1, board[5][10].special === 'gold' ? 1 : -1);
  } else {
    knowledge = addKnowledge(knowledge, 2, board[7][10].special === 'gold' ? 1 : -1);
  }
  return { knowledge, target: targetToAim };
}

const getPropabilitiesWhenOneKnowledge = (playersData, playerIndex, knowledgeIndex) => {
  let oneIndex = 0;
  let twoIndex = 0;
  if (knowledgeIndex === 0) {
    oneIndex = 1;
    twoIndex = 2;
  }
  if (knowledgeIndex === 1) {
    oneIndex = 0;
    twoIndex = 2;
  }
  if (knowledgeIndex === 2) {
    oneIndex = 0;
    twoIndex = 1;
  }

  let result = [0,0,0];
  let coals = [0,0,0];
  let golds = [0,0,0];
  const claims = cloneClaims(playersData[playerIndex].claims);
  const karmas = [...playersData[playerIndex].karmas];

  for (let i = 0; i < claims.length; ++i) {
    if (i !== playerIndex) {
      if (claims[i][oneIndex] === -1) {
        coals[oneIndex] += ((100 - karmas[i]) / 100);
      }
      if (claims[i][oneIndex] === 1) {
        golds[oneIndex] += ((100 - karmas[i]) / 100);
      }
      if (claims[i][twoIndex] === -1) {
        coals[twoIndex] += ((100 - karmas[i]) / 100);
      }
      if (claims[i][twoIndex] === 1) {
        golds[twoIndex] += ((100 - karmas[i]) / 100);
      }
    }
  }

  result[oneIndex] = golds[oneIndex] - coals[oneIndex] + 1;
  result[twoIndex] = golds[twoIndex] - coals[twoIndex] + 1;
  while (result[oneIndex] < 0 || result[twoIndex] < 0) {
    result[oneIndex] += 0.5;
    result[twoIndex] += 0.5;
  }
  const flattener = result[oneIndex] + result[twoIndex];
  result[oneIndex] = result[oneIndex] / flattener;
  result[twoIndex] = result[twoIndex] / flattener;

  return result;
}

const getPropabilitiesWithoutKnowledge = (playersData, playerIndex) => {
  let result = [0,0,0];
  let coals = [0,0,0];
  let golds = [0,0,0];
  const claims = cloneClaims(playersData[playerIndex].claims);
  const karmas = [...playersData[playerIndex].karmas];

  for (let i = 0; i < claims.length; ++i) {
    if (i !== playerIndex) {
      if (claims[i][0] === -1) {
        coals[0] += ((100 - karmas[i]) / 100);
      }
      if (claims[i][0] === 1) {
        golds[0] += ((100 - karmas[i]) / 100);
      }
      if (claims[i][1] === -1) {
        coals[1] += ((100 - karmas[i]) / 100);
      }
      if (claims[i][1] === 1) {
        golds[1] += ((100 - karmas[i]) / 100);
      }
      if (claims[i][2] === -1) {
        coals[2] += ((100 - karmas[i]) / 100);
      }
      if (claims[i][2] === 1) {
        golds[2] += ((100 - karmas[i]) / 100);
      }

    }
  }
  
  result[0] = golds[0] - coals[0];
  result[1] = golds[1] - coals[1];
  result[2] = golds[2] - coals[2];
  while (result[0] < 0 || result[1] < 0 || result[2] < 0) {
    result[0] += 0.333;
    result[1] += 0.333;
    result[2] += 0.333;
  }
  const flattener = result[0] + result[1] + result[2];
  if (flattener !== 0) {
    result[0] = result[0] / flattener;
    result[1] = result[1] / flattener;
    result[2] = result[2] / flattener;

    return result;
  } else {
    return [0,1,0];
  }
}

const cloneClaims = (claims) => {
  const clone = [];
  for (let i = 0; i < claims.length; ++i) {
    clone.push([...claims[i]]);
  }
  return clone;
}

const isNoClaimsMade = (claims) => {
  for (let i = 0; i < claims.length; ++i) {
    for (let j = 0; j < claims[i].length; ++j) {
      if (claims[i][j] !== 0) {
        return false;
      }
    }
  }
  return true;
}

const calculateTargetsPropabilities = (playersData, playerIndex, maxSaboteurs) => {
  const isSaboteur = playersData[playerIndex].role;

  for (let i = 0; i < playersData.length; ++i) {
    if (playersData[playerIndex].karmas[i] === 0) {
      if (playersData[playerIndex].claims[i][0] !== 0) {
        playersData[playerIndex].targetsKnowledge = addKnowledge(playersData[playerIndex].targetsKnowledge, 0, playersData[playerIndex].claims[i][0]);
      }
      if (playersData[playerIndex].claims[i][1] !== 0) {
        playersData[playerIndex].targetsKnowledge = addKnowledge(playersData[playerIndex].targetsKnowledge, 1, playersData[playerIndex].claims[i][1]);
      }
      if (playersData[playerIndex].claims[i][2] !== 0) {
        playersData[playerIndex].targetsKnowledge = addKnowledge(playersData[playerIndex].targetsKnowledge, 2, playersData[playerIndex].claims[i][2]);
      }
    }
  }

  const sumClaims = [0,0,0,0,0,0];

  const requiredClaims = isSaboteur ? (playersData.length - maxSaboteurs - 1) : (playersData.length - maxSaboteurs);

  for (let i = 0; i < playersData.length; ++i) {
    if (i !== playerIndex) {
      if (playersData[playerIndex].claims[i][0] === -1) {
        sumClaims[0] += 1;
      }
      if (playersData[playerIndex].claims[i][0] === 1) {
        sumClaims[1] += 1;
      }
      if (playersData[playerIndex].claims[i][1] === -1) {
        sumClaims[2] += 1;
      }
      if (playersData[playerIndex].claims[i][1] === 1) {
        sumClaims[3] += 1;
      }
      if (playersData[playerIndex].claims[i][2] === -1) {
        sumClaims[4] += 1;
      }
      if (playersData[playerIndex].claims[i][2] === 1) {
        sumClaims[5] += 1;
      }
    }
  }

  if (sumClaims[0] >= requiredClaims) {
    playersData[playerIndex].targetsKnowledge = addKnowledge(playersData[playerIndex].targetsKnowledge, 0, -1);
  }
  if (sumClaims[1] >= requiredClaims) {
    playersData[playerIndex].targetsKnowledge = addKnowledge(playersData[playerIndex].targetsKnowledge, 0, 1);
  }
  if (sumClaims[2] >= requiredClaims) {
    playersData[playerIndex].targetsKnowledge = addKnowledge(playersData[playerIndex].targetsKnowledge, 1, -1);
  }
  if (sumClaims[3] >= requiredClaims) {
    playersData[playerIndex].targetsKnowledge = addKnowledge(playersData[playerIndex].targetsKnowledge, 1, 1);
  }
  if (sumClaims[4] >= requiredClaims) {
    playersData[playerIndex].targetsKnowledge = addKnowledge(playersData[playerIndex].targetsKnowledge, 2, -1);
  }
  if (sumClaims[5] >= requiredClaims) {
    playersData[playerIndex].targetsKnowledge = addKnowledge(playersData[playerIndex].targetsKnowledge, 2, 1);
  }
  
  const knowledge = playersData[playerIndex].targetsKnowledge;
  if (knowledge[0] === 1) {
    return [1,0,0];
  }
  if (knowledge[1] === 1) {
    return [0,1,0];
  }
  if (knowledge[2] === 1) {
    return [0,0,1];
  }

  if (isNoClaimsMade(playersData[playerIndex].claims)) {
    return [0,1,0];
  } else {
    let knownTargetIndex = knowledge.findIndex((el) => el === -1);
    if (knownTargetIndex > -1) {
      return getPropabilitiesWhenOneKnowledge(playersData, playerIndex, knownTargetIndex);
    } else {
      return getPropabilitiesWithoutKnowledge(playersData, playerIndex);
    }
  }
}

const isPlayerBlocked = (playersData, playerIndex) => (playersData[playerIndex].pickaxe === false || playersData[playerIndex].truck === false || playersData[playerIndex].lamp === false);

const isFourthColumnReached = (board) => {
  for (let i = 0; i < board.length; ++i) {
    if (board[i][6].cardType !== -1) {
      return true;
    }
  }
  return false;
}

const getCardConnections = (board, i, j) => {
  let connections = 0;

  if (i > 0 && board[i][j].outUp) {
    ++connections;
    if (board[i - 1][j].outDown) {
      connections += 2;
    }
  }
  if (i < boardHeight && board[i][j].outDown) {
    ++connections;
    if (board[i + 1][j].outUp) {
      connections += 2;
    }
  }
  if (j > 0 && board[i][j].outLeft) {
    ++connections;
    if (board[i][j - 1].outRight) {
      connections += 2;
    }
  }
  if (j < boardWidth && board[i][j].outRight) {
    ++connections;
    if (board[i][j + 1].outLeft) {
      connections += 2;
    }
  }
  return connections;
}

const isAllPossibleMovesRockfalls = (outcomes) => {
  for (let i = 0; i < outcomes.length; ++i) {
    if (outcomes.operation !== 'rockfall') {
      return false;
    }
  }
  return true;
}

const cloneArrayOneDim = (cards) => {
  let clone = [];
  for (let i = 0; i < cards.length; ++i) {
    clone.push({...cards[i]});
  }
  return clone;
}

const clonePlayersData = (playersData) => {
  const clone = [];
  for (let i = 0; i < playersData.length; ++i) {
    clone.push({
      name: playersData[i].name,
      id: playersData[i].id,
      role: playersData[i].role,
      strategy: playersData[i].strategy,
      pickaxe: playersData[i].pickaxe,
      truck: playersData[i].truck,
      lamp: playersData[i].lamp,
      cards: cloneArrayOneDim(playersData[i].cards),
      karmas: [...playersData[i].karmas],
      claims: cloneClaims(playersData[i].claims),
      targetsKnowledge: [...playersData[i].targetsKnowledge],
      cardsAmountsInGame: {...playersData[i].cardsAmountsInGame},
      saboteurAccuses: [...playersData[i].saboteurAccuses],
    })
  }
  return clone;
}

const getCardAggressiveness = (playersData, playerIndex) => {
  let hasDeadEnd = false;
  let aggressiveCardsValues = 0;
  let card = null;
  for (let i = 0; i < playersData[playerIndex].cards.length; ++i) {
    card = playersData[playerIndex].cards[i];
    if ((card.type >= 0 && card.type <= 2) || card.type === 9 || card.type === 10 || card.type === 12 || card.type === 13)
      hasDeadEnd = true;
    else if (card.type === 16) { // map
      aggressiveCardsValues += 2;
    } else if (card.type === 17) { // rockfall
      aggressiveCardsValues += 2;
    } else if (card.type >= 18 && card.type <= 20) { // breaks
      aggressiveCardsValues += 2;
    } else if (card.type >= 21 && card.type <= 23) { // single fixes
      aggressiveCardsValues += 0.5;
    } else if (card.type >= 24) { // double fixes
      aggressiveCardsValues += 1;
    } else if (card.type === 6) { // cross
      aggressiveCardsValues += 1;
    } else if (card.type === 7) { // left right up
      aggressiveCardsValues += 0.5;
    }
  }
  return { hasDeadEnd, aggressiveCardsValues };
}

const getInitialStrategy = (playersData, playerIndex) => {
  if (playersData[playerIndex].role === 1) {
    const { hasDeadEnd, aggressiveCardsValues } = getCardAggressiveness(playersData, playerIndex);
    return (hasDeadEnd && aggressiveCardsValues >= 4) ? 'saboteur_aggressive' : 'saboteur_passive';
  } else {
    return 'digger';
  }
}

const getRelativeCardValue = (card, isSaboteur) => {
  if (isSaboteur) {
    if (card.type === 16) {
      return 12;
    } else if (card.type === 6) {
      return 11;
    } else if (card.type == 7) {
      return 10;
    } else if (card.type === 8) {
      return 9;
    } else if (card.type === 14) {
      return 8;
    } else if (card.type === 15) {
      return 7;
    } else if (card.type === 11) {
      return 6;
    } else if (card.type === 5) {
      return 5;
    } else if (card.type === 17) {
      return 0;
    } else if (card.type >= 18 && card.type <= 20) {
      return 1;
    } else if (card.type >= 21 && card.type <= 23) {
      return 2;
    } else if (card.type >= 24) {
      return 3;
    } else {
      return 4;
    }
  } else {
    if (card.type === 16) {
      return 0;
    } else if (card.type === 6) {
      return 11;
    } else if (card.type == 7) {
      return 10;
    } else if (card.type === 8) {
      return 9;
    } else if (card.type === 14) {
      return 5;
    } else if (card.type === 15) {
      return 3;
    } else if (card.type === 11) {
      return 4;
    } else if (card.type === 5) {
      return 2;
    } else if (card.type === 17) {
      return 12;
    } else if (card.type >= 18 && card.type <= 20) {
      return 6;
    } else if (card.type >= 21 && card.type <= 23) {
      return 7;
    } else if (card.type >= 24) {
      return 8;
    } else {
      return 1;
    }
  }
}

const initialStrategyMoves = (playersData, playerIndex, maxSaboteurs, board, turnNo) => {
  const strategy = playersData[playerIndex].strategy;
  const cards = playersData[playerIndex].cards;
  const propabilities = calculateTargetsPropabilities(playersData, playerIndex, maxSaboteurs);
  const currentEvaluation = evaluateBoard(board, propabilities[0], propabilities[1], propabilities[2], true);
  const possibleMoves = calculateMovesDeepValue(playersData, playerIndex, maxSaboteurs, board, false, strategy === 'saboteur_passive');
  let move = null;
  const confirmedSabs = playersData[playerIndex].karmas.map((el, key) => (el === 100 ? key : null)).filter((el) => el != null); 
  const confirmedDiggers = playersData[playerIndex].karmas.map((el, key) => (el === 0 ? key : null)).filter((el) => el != null);
  if (strategy === 'digger') {
    for (let i = 0; i < possibleMoves.length; ++i) {
      move = possibleMoves[i];
      if (move.operation === 'block' && confirmedSabs.includes(move.target) && !isPlayerBlocked(playersData, move.target)) {
        possibleMoves[i].priority = 0;
      } else if (move.operation === 'throwaway' && isDeadEndCard(cards[possibleMoves[i].cardIndex].type)) {
        possibleMoves[i].priority = 2;
      } else if (move.operation === 'map') {
        possibleMoves[i].priority = 1;
      } else if (move.operation === 'rockfall') {
        possibleMoves[i].priority = 3;
      } else if (move.operation === 'fix' && confirmedDiggers.includes(move.target)) {
        possibleMoves[i].priority = 4;
      } else if (move.operation === 'build') {
        possibleMoves[i].priority = 5;
      } else if (move.operation === 'block' && confirmedSabs.includes(move.target) && isPlayerBlocked(playersData, move.target)) {
        possibleMoves[i].priority = 6;
      } else if (move.operation === 'throwaway') {
        possibleMoves[i].priority = 7;
        // possibleMoves[i].value = getRelativeCardValue(cards[possibleMoves[i].cardIndex], false);
      } else {
        possibleMoves[i].priority = 8;
      }

      possibleMoves.sort((a, b) => {
        if (a.priority > b.priority) {
          return 1;
        }
        if (a.priority < b.priority) {
          return -1;
        }
        if (a.value < b.value) {
          return -0.1;
        }
        if (b.value < a.value) {
          return 0.1;
        }
        return 0;
      })
    }
  } else if (strategy === 'saboteur_aggressive') {
    for (let i = 0; i < possibleMoves.length; ++i) {
      move = possibleMoves[i];
      if (move.operation === 'block' && confirmedDiggers.includes(move.target) && !isPlayerBlocked(playersData, move.target)) {
        possibleMoves[i].priority = 2;
      } else if (move.operation === 'map') {
        possibleMoves[i].priority = 4;
      } else if (move.operation === 'rockfall') {
        possibleMoves[i].priority = 5;
      } else if (move.operation === 'fix' && confirmedSabs.includes(move.target)) {
        possibleMoves[i].priority = 3;
      } else if (move.operation === 'build' && isDeadEndCard(cards[move.cardIndex].type)) {
        possibleMoves[i].priority = 1;
      } else if (move.operation === 'block' && confirmedDiggers.includes(move.target) && isPlayerBlocked(playersData, move.target)) {
        possibleMoves[i].priority = 6;
      } else if (move.operation === 'throwaway') {
        possibleMoves[i].priority = 7;
        // possibleMoves[i].value = getRelativeCardValue(cards[possibleMoves[i].cardIndex], true);
      } else {
        possibleMoves[i].priority = 8;
      }
    }

    possibleMoves.sort((a, b) => {
      if (a.priority > b.priority) {
        return 1;
      }
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.value > b.value) {
        return -0.1;
      }
      if (b.value > a.value) {
        return 0.1;
      }
      return 0;
    })
  } else if (strategy === 'saboteur_passive') {
    for (let i = 0; i < possibleMoves.length; ++i) {
      move = possibleMoves[i];
      if (move.operation === 'block' && confirmedDiggers.includes(move.target) && !isPlayerBlocked(playersData, move.target)) {
        possibleMoves[i].priority = 4;
        possibleMoves[i].playersData[playerIndex].strategy = 'saboteur_aggressive';
      } else if (move.operation === 'map' && JSON.stringify(playersData[playerIndex].targetsKnowledge) === JSON.stringify([0,0,0])) {
        console.log('KNOWLEDGE STRNGIFY');
        console.log(JSON.stringify(playersData[playerIndex].targetsKnowledge));
        possibleMoves[i].priority = 1;
      } else if (move.operation === 'rockfall') {
        possibleMoves[i].priority = 6;
        possibleMoves[i].playersData[playerIndex].strategy = 'saboteur_aggressive';
      } else if (move.operation === 'fix' && confirmedSabs.includes(move.target)) {
        possibleMoves[i].priority = 7;
        possibleMoves[i].playersData[playerIndex].strategy = 'saboteur_aggressive';
      } else if (move.operation === 'build' && isDeadEndCard(cards[move.cardIndex].type)) {
        possibleMoves[i].priority = 3;
        possibleMoves[i].playersData[playerIndex].strategy = 'saboteur_aggressive';
      } else if (move.operation === 'block' && confirmedDiggers.includes(move.target) && isPlayerBlocked(playersData, move.target)) {
        possibleMoves[i].priority = 5;
        possibleMoves[i].playersData[playerIndex].strategy = 'saboteur_aggressive';
      } else if (move.operation === 'throwaway' && !isDeadEndCard(cards[move.cardIndex].type)) {
        possibleMoves[i].priority = 2;
        // console.log('THROW VALUE');
        // console.log(cardIndex);
        // console.log()
        // possibleMoves[i].value = getRelativeCardValue(cards[possibleMoves[i].cardIndex], true);
      } else {
        possibleMoves[i].priority = 8;
      }
    }

    possibleMoves.sort((a, b) => {
      if (a.priority > b.priority) {
        return 1;
      }
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.value > b.value) {
        return -0.1;
      }
      if (b.value > a.value) {
        return 0.1;
      }
      return 0;
    })
  }
  if (possibleMoves[0].operation === 'throwaway') {
    removeCardFromCardsAmounts(possibleMoves[0].playersData[playerIndex].cardsAmountsInGame, playersData[playerIndex].cards[possibleMoves[0].cardIndex].type);
  } else {
    for (let i = 0; i < playersData.length; ++i) {
      removeCardFromCardsAmounts(possibleMoves[0].playersData[i].cardsAmountsInGame, playersData[playerIndex].cards[possibleMoves[0].cardIndex].type);
    }
  }

  const { hasDeadEnd, aggressiveCardsValues } = getCardAggressiveness(playersData, playerIndex);
  if (strategy === 'saboteur_passive' && (hasDeadEnd && aggressiveCardsValues >= 4)) {
    possibleMoves[0].playersData[playerIndex].strategy = 'saboteur_aggressive';
  }

  // console.log(possibleMoves);

  if (debug) {
    const ccc = possibleMoves.map((el) => ({...el, board: null, playersData: null}));
    fs.writeFileSync('turn_' + debugTurn + '_' + debugPlayer + '.txt', JSON.stringify(ccc, null, 2), 'utf-8');
    if (debugPlayer === 5) {
      debugTurn++;
      debugPlayer = 1;
    } else {
      debugPlayer++;
    }
  }
  
  return possibleMoves;
}

const getNextPlayerIndex = (playersLength, playerIndex) => {
  if (playerIndex === playersLength - 1) {
    return 0;
  } else {
    return playerIndex + 1;
  }
}

const areRolesClear = (playersData, playerIndex) => {
  let cloneKarmas = [...playersData[playerIndex].karmas];
  cloneKarmas = cloneKarmas.sort();
  return (cloneKarmas[0] === 0 && cloneKarmas[1] === 0 && cloneKarmas[2] === 0);
}

const reachingGoldCalculate = () => {
  /* 
    1. dodaj pole "self-sufficient", zacznij je na null
    2. every time when digger build and distance <= 2 -> evaluuj wszystkie kombinacje kart budowlanych, czy ktoras dochodzi do golda, if yes -> self-sufficient true
    else self-sufficient -> false
    3. if self-sufficient false, wybierz wariant ktory dojdzie do golda najblizej i okresl jakiej karty/kart brakuje
    4. zrob request na chacie, if somebody self-sufficient and unblocked to throwaway a card
    5. 
  */
}

const isFirstMoveByOwnCard = (cards, foundMove) => {
  const index = cards.findIndex((el) => el.type === foundMove.cardType);
  return index !== -1;
}

const findNeededCard = (board, cards, probs, playersData) => {
  const cardsToConsider = [
    {...deck[6]},
    {...deck[10]},
    {...deck[15]},
    {...deck[20]},
    {...deck[25]},
    {...deck[31]},
    {...deck[36]}
  ];

  let clonedCards;
  let results = [];
  let foundMove = null;

  for (let i = 0; i < cardsToConsider.length; ++i) {
    clonedCards = cloneCards(cards);
    clonedCards.push({...cardsToConsider[i]});
    foundMove = findShortestPath(board, clonedCards, probs, playersData);
    if (foundMove && isFirstMoveByOwnCard(cards, foundMove)) {
      results.push({ move: foundMove, card: {...cardsToConsider[i]} });
    }
  }

  return results;
}

const possibleEndInitialStrategy = (playersData, playerIndex, board, maxSaboteurs) => {
  const propabilities = calculateTargetsPropabilities(playersData, playerIndex, maxSaboteurs);

  const goldTopProb = propabilities[0];
  const goldMiddleProb = propabilities[1];
  const goldBottomProb = propabilities[2];
  let currentEvaluation = evaluateBoard(board, goldTopProb, goldMiddleProb, goldBottomProb);

  if (currentEvaluation <= 4) {
    if (playersData[playerIndex].strategy === 'saboteur_passive') {
      playersData[playerIndex].strategy = 'saboteur_aggressive';
    }
    for (let i = 0; i < playersData[playerIndex].karmas.length; ++i) {
      if (playersData[playerIndex].karmas[i] >= 50) {
        playersData[playerIndex].karmas[i] = 100;
      } else {
        playersData[playerIndex].karmas[i] = 0;
      }
    }
  }
}

const getBestMove = (playersData, playerIndex, maxSaboteurs, board, turnNo) => {
  let moves = null;
  possibleEndInitialStrategy(playersData, playerIndex, board, maxSaboteurs);
  if (!areRolesClear(playersData, playerIndex)) {
    moves = initialStrategyMoves(playersData, playerIndex, maxSaboteurs, board, turnNo);
    consoleThinkingLines(moves);
    return moves[0];
  } else { // middle-game
    moves = calculateMovesDeepValue(playersData, playerIndex, maxSaboteurs, board, false, false);
    consoleThinkingLines(moves);
    if (debug) {
      const ccc = calculateMovesDeepValue(playersData, playerIndex, maxSaboteurs, board, false, false).map((el) => ({...el, board: null, playersData: null}));
      fs.writeFileSync('turn_' + debugTurn + '_' + debugPlayer + '.txt', JSON.stringify(ccc, null, 2), 'utf-8');
      if (debugPlayer === 5) {
        debugTurn++;
        debugPlayer = 1;
      } else {
        debugPlayer++;
      }
    }
    if (moves[0].operation === 'throwaway') {
    removeCardFromCardsAmounts(moves[0].playersData[playerIndex].cardsAmountsInGame, playersData[playerIndex].cards[moves[0].cardIndex].type);
    } else {
      for (let i = 0; i < playersData.length; ++i) {
        removeCardFromCardsAmounts(moves[0].playersData[i].cardsAmountsInGame, playersData[playerIndex].cards[moves[0].cardIndex].type);
      }
    }
    return moves[0];
  } 
}

const getReplacementPossibility = (playersData, playerIndex, board, i, j) => {
  let value = 0;

  const totalUp = 28;
  const totalDown = 22;
  const totalLeft = 18;
  const totalRight = 14;

  let remainingUp = 0;
  let remainingDown = 0;
  let remainingLeft = 0;
  let remainingRight = 0;

  Object.keys(playersData[playerIndex].cardsAmountsInGame).forEach((key) => {
    if (deck[key].outUp) {
      remainingUp += 1;
    }
    if (deck[key].outDown) {
      remainingDown += 1;
    }
    if (deck[key].outLeft) {
      remainingLeft += 1;
    }
    if (deck[key].outRight) {
      remainingRight += 1;
    }
  });
  if (board[i - 1] && board[i - 1][j].cardType !== -1 && board[i][j].inUp && board[i - 1][j].inDown) {
    value += 5 - ((remainingUp / totalUp) * 5);
  }
  if (board[i + 1] && board[i + 1][j].cardType !== -1 && board[i][j].inDown && board[i + 1][j].inUp) {
    value += 5 - ((remainingDown / totalDown) * 5);
  }
  if (board[j - 1] && board[i][j - 1].cardType !== -1 && board[i][j].inLeft && board[i][j - 1].inRight) {
    value += 5 - ((remainingLeft / totalLeft) * 5);
  }
  if (board[j + 1] && board[i][j + 1].cardType !== -1 && board[i][j].inRight && board[i][j + 1].inLeft) {
    value += 5 - ((remainingRight / totalRight) * 5);
  }
  return value;
}

const chatMessage = (playersData, playerIndex, message) => {
  console.log(' ');
  console.log('\x1b[31m%s\x1b[33m%s\x1b[0m', playersData[playerIndex].name + ': ', message);
}

// dodaj przeczekanie gdy jest dziura, oblicz prawdopodobienstwo

// pod koniec gry build i rockfall warte wiecej niz fix, nawet siebie, block bez zmian

// ZBIERZ WSZYSTKIE WARTOSCI ARBITRALNE I WYPISZ JE NA GORZE PLIKU POD OPTYMALIZACJE

// OPTYMALIZACJA

// I will build it / I will demolish it

// announce lie - if a confirmed digger says, then mark liar as saboteur

// lie only if cant be busted by a confirmed digger

// buduj useless karty jako saboteur w innym miejscu niz przy starcie

// jesli deadend budowany w nieszkoldiwym meiscju to nie podbijaj karmy na 1

// healowanie NIE-SIEBIE mniej warte niz budowa / SHOULD I FIX YOU?

// double block mniej warty niz budowa

// fix claiming golds twice bug

// fixing after a rockfall -> confirmed good

// better rockfall negativepromo for diggers, dependening on column and objazd

// GETSHORTESTDISTANCE FIX PREVENT USELESS BUILDING

// BUILD TO WRONG TARGET STRATEGY

// ADD PANIC DEADEND -> SHOULDFIXIMMEDIATELY NEXT TEAMMATE IF HE HAS DEADEND

// saboteur_passive check others targets to find liars

// extract all card types from deck and code (start & targets) to cardTypes.js

// ASK FOR CARDS, OTHERSCARDS KNOWLEDGE, GOODS -> getShortestPAth, EVILS -> kogo blokowac
// zdradzaj lub nie zdradzaj karty na podstawie tego ile wrogowie maja blokow i czy masz self-sufficient karty

// REWRITE KARMAS TO -1 0 1

const flattenNodesTree = (nodes) => {
  let result = [];
  for (let i = 0; i < nodes.length; ++i) {
    result = [...result, nodes[i], ...flattenNodesTree(nodes[i].children)];
  }
  return result;
}

const findShortestPath = (board, cards, probs, playersData) => {
  let filteredCards = cards.filter((el) => !isDeadEndCard(el.type));
  const currentEvaluation = evaluateBoard(board, probs[0], probs[1], probs[2], true);

  let clone = null;
  let flipped = null;
  let theCard = null;
  let nodes = [];
  nodes.push({ root: true, children: x(board, filteredCards, probs, currentEvaluation, 'root', playersData) });

  let results = flattenNodesTree(nodes[0].children);

  results.sort(sortAscByValue);
  if (results[0] && results[0].value < currentEvaluation) {
    // console.log('RESULT 0');
    // console.log(results[0]);
    if (results[0].parent === 'root') {
      return {
        cardType: results[0].type,
        i: results[0].i,
        j: results[0].j,
        flipped: !!results[0].flipped,
      }
    } else {
      // console.log('WORKAORUND RESULT');
      // console.log(results[0]);
      let splitString = results[0].parent.split(' ')[1];
      return {
        cardType: parseInt(splitString.split('_')[0], 10),
        i: parseInt(splitString.split('_')[1], 10),
        j: parseInt(splitString.split('_')[2], 10),
        flipped: (splitString.split('_')[3] === 'f')
      }
    }
  }
  return null;
}

const cloneCards = (cards) => {
  let clone = [];
  for (let i = 0; i < cards.length; ++i) {
    clone.push({...cards[i]});
  }
  return clone;
}

const x = (board, cards, probs, currentEvaluation, parent, playersData) => {
  let clone = null;
  let clonedCards = null;
  let theCard = null;
  let abc = [];
  let value = null;
  for (let a = 0; a < cards.length; ++a) {
    theCard = cards[a];
    for (let i = 0; i < board.length; ++i) {
      for (let j = 0; j < board[i].length; ++j) {
        if (theCard.flippable) {
          flipped = flipCard({...theCard});
          if (canCardBeBuilt(board, flipped, i, j)) {
            clone = cloneBoard(board);
            buildCard(clone, flipped, i, j);
            clonedCards = cloneCards(cards);
            clonedCards.splice(a, 1);
            const isCoalRevealed = checkTargets(clone, i, j, playersData, true);
            if (isGoldRevealed(clone)) {
              value = -9999;
            } else {
              value = evaluateBoard(clone, probs[0], probs[1], probs[2], true); + (isCoalRevealed ? -2 : 0);
            }
            if (value !== currentEvaluation) {
              abc.push({ type: flipped.type, flipped: true, i, j, value, parent, children: x(clone, clonedCards, probs, value, parent + ' ' + theCard.type + '_' + i + '_' + j + '_f', playersData) });
            }
          }
        }

        if (canCardBeBuilt(board, theCard, i, j)) {
          clone = cloneBoard(board);
          buildCard(clone, theCard, i, j);
          clonedCards = cloneCards(cards);
          clonedCards.splice(a, 1);
          const isCoalRevealed = checkTargets(clone, i, j, playersData, true);
          if (isGoldRevealed(clone)) {
            value = -9999;
          } else {
            value = evaluateBoard(clone, probs[0], probs[1], probs[2], true); + (isCoalRevealed ? -2 : 0);
          }
          if (value !== currentEvaluation) {
            abc.push({ type: theCard.type, flipped: false, i, j, value, parent, children: x(clone, clonedCards, probs, value, parent + ' ' + theCard.type + '_' + i + '_' + j, playersData) });
          }
        }
      }
    }
  }
  return abc;
}

const isSelfWorthFixing = (playersData, playerIndex, maxSaboteurs, board, currentEvaluation, isSaboteur) => {
  const clonedPlayersData = clonePlayersData(playersData);
  clonedPlayersData[playerIndex].pickaxe = true;
  clonedPlayersData[playerIndex].truck = true;
  clonedPlayersData[playerIndex].lamp = true;
  let moves = calculateMovesDeepValue(clonedPlayersData, playerIndex, maxSaboteurs, board, true, false);
  moves = moves.filter((el) => el.operation === 'build' && (isSaboteur ? el.value > currentEvaluation : el.value < currentEvaluation));
  return moves.length > 0;
}

const isTargetOppositeTeam = (playersData, playerIndex, target) => {
  if (playersData[playerIndex].role === 1) {
    return playersData[playerIndex].karmas[target] === 0 ? true : false;
  } else {
    return playersData[playerIndex].karmas[target] === 100 ? true : false;
  }
}

const isTargetSameTeam = (playersData, playerIndex, target) => {
  if (playersData[playerIndex].role === 1) {
    return playersData[playerIndex].karmas[target] >= 100 ? true : false;
  } else {
    return playersData[playerIndex].karmas[target] <= 0 ? true : false;
  }
}

const getValueForFix = (playersData, playerIndex, target, isSaboteur, isDoubleFix, board, currentEvaluation, maxSaboteurs) => {
  const isTargetBlockedMoreThanOnce = ((playersData[target].pickaxe ? 1 : 0) + (playersData[target].truck ? 1 : 0) + (playersData[target].lamp ? 1 : 0)) < 2;

  const numericalValue = 0.25 + (playerIndex === target ? 1 : 0) + (isTargetBlockedMoreThanOnce ? 0 : 0.25) + (isDoubleFix ? -0.1 : 0);
  // console.log('VALUE FOR FIX');
  // console.log(isSaboteur ? numericalValue : -numericalValue);
  return isSaboteur ? numericalValue : -numericalValue;
}

const getValueForBreak = (playersData, playerIndex, target, isSaboteur) => {
  const isTargetAlreadyBlocked = isPlayerBlocked(playersData, target);

  let currentIndex = getNextPlayerIndex(playersData.length, playerIndex);
  let indexBonus = {};
  let bonus = Math.floor((playersData.length) / 2) * 0.1;
  while (currentIndex !== playerIndex) {
    indexBonus[currentIndex] = bonus;
    bonus -= 0.1;
    currentIndex = getNextPlayerIndex(playersData.length, currentIndex);
  }

  const numericalValue = (isTargetAlreadyBlocked ? 0 : 2) + indexBonus[target];
  return isSaboteur ? numericalValue : -numericalValue;
}

const getValueForBuild = (card, j, isSaboteur, board) => {
  let value = 0;

  if (card.inUp) {
    value += 0.1;
  }
  if (card.inDown) {
    value += 0.1;
  }
  if (card.isLeft) {
    value += 0.01;
  }
  if (card.isRight) {
    value += 0.01;
  }

  return value;
}

const cardTypeToGraphRepresentation = (card) => {
  if (card.type === 0) {
    return '┼';
  }
  if (card.type === 1 && !card.flipped) {
    return '┴';
  }
  if (card.type === 1 && card.flipped) {
    return '┬';
  }
  if (card.type === 2 && !card.flipped) {
    return '┤';
  }
  if (card.type === 2 && card.flipped) {
    return '├';
  }
  if (card.type === 12 && !card.flipped) {
    return '┘';
  }
  if (card.type === 12 && card.flipped) {
    return '┌';
  }
  if (card.type === 3) {
    return '│';
  }
  if (card.type === 4 && !card.flipped) {
    return '¡';
  }
  if (card.type === 4 && card.flipped) {
    return 'º';
  }
  if (card.type === 5) {
    return '║';
  }
  if (card.type === 6) {
    return '╬';
  }
  if (card.type === 7 && !card.flipped) {
    return '╩';
  }
  if (card.type === 7 && card.flipped) {
    return '╦';
  }
  if (card.type === 8) {
    return '═';
  }
  if (card.type === 9) {
    return '─';
  }
  if (card.type === 10 && !card.flipped) {
    return '»';
  }
  if (card.type === 10 && card.flipped) {
    return '«';
  }
  if (card.type === 11 && !card.flipped) {
    return '╚';
  }
  if (card.type === 11 && card.flipped) {
    return '╗';
  }
  if (card.type === 13 && !card.flipped) {
    return '└';
  }
  if (card.type === 13 && card.flipped) {
    return '┐';
  }
  if (card.type === 14 && !card.flipped) {
    return '╣';
  }
  if (card.type === 14 && card.flipped) {
    return '╠';
  }
  if (card.type === 15 && !card.flipped) {
    return '╝';
  }
  if (card.type === 15 && card.flipped) {
    return '╔';
  }
  if (card.type === 16) {
    return 'map';
  }
  if (card.type === 17) {
    return 'rockfall';
  }
  if (card.type === 18) {
    return 'break_pickaxe';
  }
  if (card.type === 19) {
    return 'break_truck';
  }
  if (card.type === 20) {
    return 'break_lamp';
  }
  if (card.type === 21) {
    return 'fix_pickaxe';
  }
  if (card.type === 22) {
    return 'fix_truck';
  }
  if (card.type === 23) {
    return 'fix_lamp';
  }
  if (card.type === 24) {
    return 'fix_truck_lamp';
  }
  if (card.type === 25) {
    return 'fix_pickaxe_truck';
  }
  if (card.type === 26) {
    return 'fix_pickaxe_lamp';
  }
}

const getCardsDescriptions = (cards) => {
  let descriptions = [];
  for (let i = 0; i < cards.length; ++i) {
    descriptions.push(cardTypeToGraphRepresentation(cards[i]));
  }
  return descriptions;
}

const calculateMovesDeepValue = (playersData, playerIndex, maxSaboteurs, board, onlyBuilds, considerThrowingAway) => {
  const cardsInHand = playersData[playerIndex].cards;
  const isSaboteur = playersData[playerIndex].role === 1;
  const propabilities = calculateTargetsPropabilities(playersData, playerIndex, maxSaboteurs);
  const knowledge = playersData[playerIndex].targetsKnowledge;

  let buildingOutcomes = [];
  let outcomes = [];
  let clone;
  let value;
  let flipped;

  const mapThrowAwayExtra = 0.1;
  const mapUseExtra = 99;

  const goldTopProb = propabilities[0];
  const goldMiddleProb = propabilities[1];
  const goldBottomProb = propabilities[2];
  let currentEvaluation = evaluateBoard(board, goldTopProb, goldMiddleProb, goldBottomProb);
  for (let a = 0; a < cardsInHand.length; ++a) {
    if (cardsInHand[a].special === 'map' && !onlyBuilds) {
      if (isGoldKnown(knowledge)) {
        let clonedPlayersData = clonePlayersData(playersData);
        clonedPlayersData[playerIndex].cards.splice(a, 1);

        updateKarmas(clonedPlayersData, playerIndex, 'throwaway', null, maxSaboteurs, null, null, null);

        outcomes.push({
          value: currentEvaluation + (isSaboteur ? mapThrowAwayExtra : -mapThrowAwayExtra),
          board,
          cardIndex: a,
          operation: 'throwaway',
          playersData: clonedPlayersData,
          description: 'Discarding a card. (' + getCardsDescriptions([cardsInHand[a]]) + ')'
        })
      } else {
        const { knowledge: obtainedKnowledge, target: obtainedTarget } = useMap(board, [...knowledge], [...propabilities]);
        let clonedPlayersData = clonePlayersData(playersData);
        clonedPlayersData[playerIndex].targetsKnowledge = obtainedKnowledge;
        description = makeClaim(clonedPlayersData, playerIndex, obtainedTarget, clonedPlayersData[playerIndex].targetsKnowledge[obtainedTarget], maxSaboteurs);

        clonedPlayersData[playerIndex].cards.splice(a, 1);

        updateKarmas(clonedPlayersData, playerIndex, 'map', null, maxSaboteurs, null, null, null);

        outcomes.push({
          value: currentEvaluation + (isSaboteur ? mapUseExtra : -mapUseExtra),
          board,
          playersData: clonedPlayersData,
          cardIndex: a,
          operation: 'map',
          description,
        })
      }
    } else if (cardsInHand[a].type === 17 && !onlyBuilds) {
      for (let i = 0; i < board.length; ++i) {
        for (let j = 0; j < board[i].length; ++j) {
          if (!(j === 10 && i === targets[1]) && !(j === 10 && i === targets[2]) && board[i][j].type >= 0 && board[i][j].type <= 15) {
            clone = cloneBoard(board);
            doRockFall(clone, i, j);

            const afterRockFallEvaluation = evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb);
            const isRockFallProper = isSaboteur ? (afterRockFallEvaluation > currentEvaluation && currentEvaluation <= 4 && !isDeadEndCard(board[i][j].cardType)) : afterRockFallEvaluation < currentEvaluation - 1.5;

            if (isRockFallProper) {
              let clonedPlayersData = clonePlayersData(playersData);
              clonedPlayersData[playerIndex].cards.splice(a, 1);

              updateKarmas(clonedPlayersData, playerIndex, 'rockfall', 17, maxSaboteurs, board, clone);

              outcomes.push({
                value: afterRockFallEvaluation + (isSaboteur ? getReplacementPossibility(playersData, playerIndex, board, i, j) : 0),
                cardIndex: a,
                board: clone,
                operation: 'rockfall',
                playersData: clonedPlayersData,
                description: 'Using rockfall on (' + i + ', ' + j + ').'
              });
            }
          }
        }
      }
    } else if (cardsInHand[a].type >= 18 && cardsInHand[a].type <= 20 && !onlyBuilds) {
      let stringBlock = '';
      if (cardsInHand[a].type === 18) {
        stringBlock = 'pickaxe';
      }
      if (cardsInHand[a].type === 19) {
        stringBlock = 'truck';
      }
      if (cardsInHand[a].type === 20) {
        stringBlock = 'lamp';
      }

      let possibleUses = getToolsChangePossibleUses(playersData, playerIndex, stringBlock, false);
      for (let i = 0; i < possibleUses.length; ++i) {
        let clonedPlayersData = clonePlayersData(playersData);
        clonedPlayersData[possibleUses[i]][stringBlock] = false;

        clonedPlayersData[playerIndex].cards.splice(a, 1);

        updateKarmas(clonedPlayersData, playerIndex, 'block', null, maxSaboteurs, null, null, possibleUses[i]);

        const blockExtra = getValueForBreak(playersData, playerIndex, possibleUses[i], isSaboteur);

        if (isTargetOppositeTeam(playersData, playerIndex, possibleUses[i])) {
          outcomes.push({
            value: currentEvaluation + blockExtra,
            cardIndex: a,
            board,
            operation: 'block',
            playersData: clonedPlayersData,
            description: 'Blocking player ' + (possibleUses[i] + 1) + ' by ' + stringBlock + '.',
            target: possibleUses[i]
          });
        }
      }
    } else if (cardsInHand[a].type >= 21 && !onlyBuilds) {
      let stringFixOne = '';
      let stringFixTwo = '';
      if (cardsInHand[a].type === 21) {
        stringFixOne = 'pickaxe';
      }
      if (cardsInHand[a].type === 22) {
        stringFixOne = 'truck';
      }
      if (cardsInHand[a].type === 23) {
        stringFixOne = 'lamp';
      }
      if (cardsInHand[a].type === 24) {
        stringFixOne = 'truck';
        stringFixTwo = 'lamp';
      }
      if (cardsInHand[a].type === 25) {
        stringFixOne = 'pickaxe';
        stringFixTwo = 'truck';
      }
      if (cardsInHand[a].type === 26) {
        stringFixOne = 'pickaxe';
        stringFixTwo = 'lamp';
      }

      let possibleUsesOne = getToolsChangePossibleUses(playersData, playerIndex, stringFixOne, true);
      let possibleUsesTwo = [];
      if (stringFixTwo.length > 0) {
        possibleUsesTwo = getToolsChangePossibleUses(playersData, playerIndex, stringFixTwo, true);
      }

      for (let i = 0; i < possibleUsesOne.length; ++i) {
        let clonedPlayersData = clonePlayersData(playersData);
        const isDoubleFix = clonedPlayersData[playerIndex].cards[a].type >= 24;
        clonedPlayersData[possibleUsesOne[i]][stringFixOne] = true;
        clonedPlayersData[playerIndex].cards.splice(a, 1);

        updateKarmas(clonedPlayersData, playerIndex, 'fix', null, maxSaboteurs, null, null, possibleUsesOne[i]);

        const fixExtra = getValueForFix(playersData, playerIndex, possibleUsesOne[i], isSaboteur, isDoubleFix, board, currentEvaluation, maxSaboteurs);
        if (isTargetSameTeam(playersData, playerIndex, possibleUsesOne[i])
          && (possibleUsesOne[i] !== playerIndex || isSelfWorthFixing(playersData, playerIndex, maxSaboteurs, board, currentEvaluation, isSaboteur)))
        outcomes.push({
          value: currentEvaluation + fixExtra,
          cardIndex: a,
          board,
          operation: 'fix',
          playersData: clonedPlayersData,
          description: 'Fixing player ' + (possibleUsesOne[i] + 1) + ' from ' + stringFixOne + '.',
          target: possibleUsesOne[i],
        })
      }

      for (let i = 0; i < possibleUsesTwo.length; ++i) {
        let clonedPlayersData = clonePlayersData(playersData);
        const isDoubleFix = clonedPlayersData[playerIndex].cards[a].type >= 24;
        clonedPlayersData[possibleUsesTwo[i]][stringFixTwo] = true;
        clonedPlayersData[playerIndex].cards.splice(a, 1);

        updateKarmas(clonedPlayersData, playerIndex, 'fix', null, maxSaboteurs, null, null, possibleUsesTwo[i]);

        const fixExtra = getValueForFix(playersData, playerIndex, possibleUsesTwo[i], isSaboteur, isDoubleFix, board, currentEvaluation, maxSaboteurs);

        if (isTargetSameTeam(playersData, playerIndex, possibleUsesTwo[i])
          && (possibleUsesTwo[i] !== playerIndex || isSelfWorthFixing(playersData, playerIndex, maxSaboteurs, board, currentEvaluation, isSaboteur))) {
          outcomes.push({
            value: currentEvaluation + fixExtra,
            cardIndex: a,
            board,
            operation: 'fix',
            playersData: clonedPlayersData,
            description: 'Fixing player ' + (possibleUsesTwo[i] + 1) + ' from ' + stringFixTwo + '.',
            target: possibleUsesTwo[i],
          })
        }
      }
    } else if (!isPlayerBlocked(playersData, playerIndex)) {
      flipped = cardsInHand[a].flippable ? flipCard({...cardsInHand[a]}) : null;

      if (isSaboteur) {
        for (let i = 0; i < board.length; ++i) {
          for (let j = 0; j < board[i].length; ++j) {
            if (cardsInHand[a].type <= 15) {
              if (canCardBeBuilt(board, cardsInHand[a], i, j, isSaboteur)) {
                clone = cloneBoard(board);
                buildCard(clone, cardsInHand[a], i, j, false);
                checkTargets(clone, i, j, playersData, true);
                if (isGoldRevealed(clone)) {
                  value = -9999;
                } else {
                  value = evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb);
                }
                let clonedPlayersData = clonePlayersData(playersData);
                clonedPlayersData[playerIndex].cards.splice(a, 1);

                updateKarmas(clonedPlayersData, playerIndex, 'build', cardsInHand[a].type, maxSaboteurs, board, clone, null);

                outcomes.push({
                  value: value + getValueForBuild(cardsInHand[a], j, isSaboteur, clone),
                  cardIndex: a,
                  board: clone,
                  playersData: clonedPlayersData,
                  operation: 'build',
                  description: 'Building ' + cardTypeToGraphRepresentation(cardsInHand[a]) + ' on (' + i + ', ' + j + ').'
                })
              }

              if (flipped) {
                if (canCardBeBuilt(board, flipped, i, j, isSaboteur)) {
                  clone = cloneBoard(board);
                  buildCard(clone, flipped, i, j, true);
                  checkTargets(clone, i, j, playersData, true);
                  if (isGoldRevealed(clone)) {
                    value = -9999;
                  } else {
                    value = evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb);
                  }
                  let clonedPlayersData = clonePlayersData(playersData);
                  clonedPlayersData[playerIndex].cards.splice(a, 1);

                  updateKarmas(clonedPlayersData, playerIndex, 'build', cardsInHand[a].type, maxSaboteurs, board, clone, null);

                  outcomes.push({
                    value: value + getValueForBuild(cardsInHand[a], j, isSaboteur, clone),
                    cardIndex: a,
                    playersData: clonedPlayersData,
                    board: clone,
                    cardType: cardsInHand[a].type,
                    operation: 'build',
                    description: 'Building ' + cardTypeToGraphRepresentation(cardsInHand[a]) + ' on (' + i + ', ' + j + ').'
                  })
                }
              }
            } 
          }
        }
      } else {
        if (!isDeadEndCard(cardsInHand[a].type)) {
          for (let i = 0; i < board.length; ++i) {
            for (let j = 0; j < board[i].length; ++j) {
              if (cardsInHand[a].type <= 15) {
                if (canCardBeBuilt(board, cardsInHand[a], i, j, isSaboteur)) {
                  clone = cloneBoard(board);
                  buildCard(clone, cardsInHand[a], i, j, false);
                  const isCoalRevealed = checkTargets(clone, i, j, playersData, true);
                  if (isGoldRevealed(clone)) {
                    value = -9999;
                  } else {
                    value = evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb) + (isCoalRevealed ? -2 : 0);
                  }
                  let clonedPlayersData = clonePlayersData(playersData);
                  clonedPlayersData[playerIndex].cards.splice(a, 1);

                  updateKarmas(clonedPlayersData, playerIndex, 'build', cardsInHand[a].type, maxSaboteurs, board, clone, null);

                  buildingOutcomes.push({
                    value: value + getValueForBuild(cardsInHand[a], j, isSaboteur, clone),
                    cardIndex: a,
                    board: clone,
                    playersData: clonedPlayersData,
                    operation: 'build',
                    description: 'Building ' + cardTypeToGraphRepresentation(cardsInHand[a]) + ' on (' + i + ', ' + j + ').'
                  })
                }

                if (flipped) {
                  if (canCardBeBuilt(board, flipped, i, j, isSaboteur)) {
                    clone = cloneBoard(board);
                    buildCard(clone, flipped, i, j, true);
                    const isCoalRevealed = checkTargets(clone, i, j, playersData, true);
                    if (isGoldRevealed(clone)) {
                      value = -9999;
                    } else {
                      value = evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb) + (isCoalRevealed ? -2 : 0);
                    }
                    let clonedPlayersData = clonePlayersData(playersData);
                    clonedPlayersData[playerIndex].cards.splice(a, 1);

                    updateKarmas(clonedPlayersData, playerIndex, 'build', cardsInHand[a].type, maxSaboteurs, board, clone, null);

                    buildingOutcomes.push({
                      value: value + getValueForBuild(cardsInHand[a], j, isSaboteur, clone),
                      cardIndex: a,
                      playersData: clonedPlayersData,
                      board: clone,
                      cardType: cardsInHand[a].type,
                      operation: 'build',
                      description: 'Building ' + cardTypeToGraphRepresentation(cardsInHand[a]) + ' on (' + i + ', ' + j + ').'
                    })
                  }
                }
              } 
            }
          }
        }
      }
    }
  }

  if (!isSaboteur && !isPlayerBlocked(playersData, playerIndex) && buildingOutcomes.length) {
    buildingOutcomes = buildingOutcomes.filter((el) => el.value < currentEvaluation);
    // console.log('BUILDING OUTCOMES');
    // console.log(buildingOutcomes);
    // console.log('CURRENT EVAL');
    // console.log(currentEvaluation);
    if (buildingOutcomes.length) {
      outcomes = [...outcomes, ...buildingOutcomes];
    } else {
      let workaroundMove = findShortestPath(board, cardsInHand, [goldTopProb, goldMiddleProb, goldBottomProb], playersData);
      if (workaroundMove) {
        const foundCardIndex = cardsInHand.findIndex((el) => el.type === workaroundMove.cardType);
        clone = cloneBoard(board);
        buildCard(clone, workaroundMove.flipped ? flipCard({...cardsInHand[foundCardIndex]}) : cardsInHand[foundCardIndex], workaroundMove.i, workaroundMove.j, workaroundMove.flipped);

        let clonedPlayersData = clonePlayersData(playersData);
        clonedPlayersData[playerIndex].cards.splice(foundCardIndex, 1);

        updateKarmas(clonedPlayersData, playerIndex, 'build', cardsInHand[foundCardIndex].type, maxSaboteurs, board, clone, null);

        outcomes.push({
          value: currentEvaluation - 1,
          cardIndex: foundCardIndex,
          playersData: clonedPlayersData,
          board: clone,
          cardType: cardsInHand[foundCardIndex].type,
          operation: 'build',
          description: 'Building ' + cardTypeToGraphRepresentation(cardsInHand[foundCardIndex]) + ' on (' + workaroundMove.i + ', ' + workaroundMove.j + ').' 
        })
      } else {
        const neededCards = findNeededCard(board, cardsInHand, [goldTopProb, goldMiddleProb, goldBottomProb], playersData);
        const betterNonBuildingMove = outcomes.findIndex((el) => el.value < currentEvaluation - 1 && el.operation !== 'throwaway');
        if (neededCards.length && betterNonBuildingMove === -1) {
          const otherPlayersCards = askForCards(playersData, playerIndex, neededCards);
          if (otherPlayersCards) {
            const cardsByTrues = {};
            let sum = null;
            Object.keys(otherPlayersCards).forEach((el) => {
              sum = sumTrues(otherPlayersCards[el]);
              if (sum) {
                cardsByTrues[el] = sum;
              }
            });
            if (Object.keys(cardsByTrues).length) {
              let greatestKey = -1;
              let greatestValue = -1;
              Object.keys(cardsByTrues).forEach((el) => {
                if (cardsByTrues[el] > greatestValue) {
                  greatestValue = cardsByTrues[el];
                  greatestKey = el;
                }
              });
              
              const moveIndex = neededCards.findIndex((el) => el.card.type == greatestKey);
              const cardIndexToBuild = cardsInHand.findIndex((el) => el.type === neededCards[moveIndex].move.cardType);
              clone = cloneBoard(board);
              buildCard(clone, neededCards[moveIndex].move.flipped ? flipCard({...cardsInHand[cardIndexToBuild]}) : {...cardsInHand[cardIndexToBuild]}, neededCards[moveIndex].move.i, neededCards[moveIndex].move.j, neededCards[moveIndex].move.flipped);
              const clonedPlayersData = clonePlayersData(playersData);
              clonedPlayersData[playerIndex].cards.splice(cardIndexToBuild, 1);

              updateKarmas(clonedPlayersData, playerIndex, 'build', cardsInHand[cardIndexToBuild].type, maxSaboteurs, board, clone, null);

              outcomes.push({
                value: currentEvaluation - 1,
                cardIndex: cardIndexToBuild,
                board: clone,
                operation: 'build',
                cardType: cardsInHand[cardIndexToBuild].type,
                playersData: clonedPlayersData,
                description: 'Building ' + cardTypeToGraphRepresentation(cardsInHand[cardIndexToBuild]) + ' on (' + neededCards[moveIndex].move.i + ', ' + neededCards[moveIndex].move.j + ').'
              })
            }
          }
        }
      }
    }
  }

  if ((considerThrowingAway || outcomes.length === 0) && !onlyBuilds) {
    let relativeCardValues = [];
    for (let i = 0; i < cardsInHand.length; ++i) {
      relativeCardValues[i] = getRelativeCardValue(cardsInHand[i], isSaboteur);
    }

    if (isSaboteur) {
      relativeCardValues.sort(sortDescByValue);
    } else {
      relativeCardValues.sort(sortAscByValue);
    }

    for (let i = 0; i < cardsInHand.length; ++i) {
      let clonedPlayersData = clonePlayersData(playersData);
      clonedPlayersData[playerIndex].cards.splice(i, 1);

      updateKarmas(clonedPlayersData, playerIndex, 'throwaway', null, maxSaboteurs, null, null, null);

      if (cardsInHand[i].type !== 17) {
        outcomes.push({
          value: currentEvaluation + relativeCardValues[i],
          board,
          playersData: clonedPlayersData,
          cardIndex: i,
          operation: 'throwaway',
          description: 'Discarding a card. (' + getCardsDescriptions([cardsInHand[i]]) + ')'
        })
      }
    }
  }

  if (outcomes.length === 0) {
    const clonedPlayersData = clonePlayersData(playersData);
    clonedPlayersData[playerIndex].cards.splice(0, 1);

    outcomes.push({
      value: currentEvaluation,
      board,
      playersData: clonedPlayersData,
      cardIndex: 0,
      operation: 'throwaway',
      description: 'Discarding a card. (' + getCardsDescriptions([cardsInHand[0]]) + ')'
    })
  }

  if (isSaboteur) {
    outcomes.sort(sortDescByValue);
  } else {
    outcomes.sort(sortAscByValue);
  }

  return outcomes;
}

const sumTrues = (someObject) => {
  let sum = 0;
  Object.keys(someObject).forEach((el) => {
    if (someObject[el]) {
      sum += 1;
    }
  })
  return sum;
}

const doPlayerHaveCard = (playersData, playerIndex, cardType) => {
  const index = playersData[playerIndex].cards.findIndex((el) => el.type === cardType);
  return index !== -1;
}

const askForCards = (playersData, playerIndex, neededCards) => {
  const playersNames = [];
  const playersIds = [];
  const neededCardsTypes = [];
  const neededCardsDescriptions = [];

  let result = {};

  for (let i = 0; i < playersData.length; ++i) {
    if (i !== playerIndex) {
      if (playersData[playerIndex].karmas[i] === 0) {
        playersNames.push(playersData[i].name);
        playersIds.push(i);
      }
    }
  }

  for (let i = 0; i < neededCards.length; ++i) {
    neededCardsTypes.push(neededCards[i].card.type);
    neededCardsDescriptions.push(cardTypeToGraphRepresentation(neededCards[i].card));
    result[neededCards[i].card.type] = {};
    for (let j = 0; j < playersIds.length; ++j) {
      result[neededCards[i].card.type][playersIds[j]] = false;
    }
  }

  if (!playersIds.length) {
    return null;
  }

  chatMessage(playersData, playerIndex, playersNames.join(', ') + ', do you have ' + (neededCardsDescriptions.length > 1 ? 'any of ' : '') + neededCardsDescriptions.join(', ') + '?');
  let message = null;
  let iHaveNothing = true;
  let doPlayerHaveIt = false;

  for (let i = 0; i < playersIds.length; ++i) {
    message = 'I have';
    iHaveNothing = true;
    doPlayerHaveIt = false;
    if (playersData[playersIds[i]].karmas[playerIndex] === 0) {

      if (isPlayerBlocked(playersData, playersIds[i])) {
        chatMessage(playersData, playersIds[i], 'I am blocked.');
      } else {
        for (let j = 0; j < neededCards.length; ++j) {
          doPlayerHaveIt = doPlayerHaveCard(playersData, playersIds[i], neededCards[j].card.type);
          if (doPlayerHaveIt) {
            message += (' ' + cardTypeToGraphRepresentation(neededCards[j].card));
            iHaveNothing = false;
          }
          result[neededCards[j].card.type][playersIds[i]] = doPlayerHaveIt;
        }
        if (iHaveNothing) {
          chatMessage(playersData, playersIds[i], 'I have none of these.');
        } else {
          chatMessage(playersData, playersIds[i], message + '.');
        }
      }
    } else {
      chatMessage(playersData, playersIds[i], 'I won\'t say, I don\'t trust you.');
    }
  }
  return result;
}

const evaluateBoard = (board, goldTopProb, goldMiddleProb, goldBottomProb, useFinalEvaluation) => {
  const copyBoard = cloneBoard(board);

  let topArray = [9999];
  let middleArray = [9999];
  let bottomArray = [9999];

  for (let i = 0; i < copyBoard.length; ++i) {
    for (let j = 0; j < copyBoard[i].length; ++j) {
      if (copyBoard[i][j].cardType === -1 && copyBoard[i][j].buildable && copyBoard[i][j].accessible) {
        topArray.push(getDistanceToTarget(i, j, 0));
        middleArray.push(getDistanceToTarget(i, j, 1));
        bottomArray.push(getDistanceToTarget(i, j, 2));
      }
    }
  }

  topArray = topArray.sort(sortAsc);
  middleArray = middleArray.sort(sortAsc);
  bottomArray = bottomArray.sort(sortAsc);

  let finalEvaluation = goldTopProb * topArray[0] + goldMiddleProb * middleArray[0] + goldBottomProb * bottomArray[0];
  let dualEvaluation = goldTopProb * ((topArray[0] + topArray[1]) / 2) + goldMiddleProb * ((middleArray[0] + middleArray[1]) / 2) + goldBottomProb * ((bottomArray[0] + bottomArray[1]) / 2);
  if (useFinalEvaluation) {
    return finalEvaluation;
  }

  if (finalEvaluation <= 4) {
    return finalEvaluation + (dualEvaluation / 10);
  }

  return dualEvaluation;
}

const getDistanceToTarget = (i, j, whichTarget) => {
  if (whichTarget === 0) {
    return Math.abs(3 - i) + Math.abs(10 - j);
  } else if (whichTarget === 1) {
    return Math.abs(5 - i) + Math.abs(10 - j);
  }
  return Math.abs(7 - i) + Math.abs(10 - j);
}

const getClaimsArray = (playersNo) => {
  const claims = [];
  for (let i = 0; i < playersNo; ++i) {
    claims.push([0,0,0]);
  };
  return claims;
}

const combo = (c) => {
  var r = [],
      len = c.length;
      tmp = [];
  function nodup() {
    var got = {};
    for (var l = 0; l < tmp.length; l++) {
      if (got[tmp[l]]) return false;
      got[tmp[l]] = true;
    }
    return true;
  }
  function iter(col,done) {    
    var l, rr;
    if (col === len) {      
      if (nodup()) {
        rr = [];
        for (l = 0; l < tmp.length; l++) 
          rr.push(c[tmp[l]]);        
        r.push(rr);
      }
    } else {
      for (l = 0; l < len; l ++) {            
        tmp[col] = l;
        iter(col +1);
      }
    }
  }
  iter(0);
  return r;
}

const sabsNoChances = (playersNo, config) => {
  const maxSabs = config.reduce((a,b) => a + b, 0);

  let caseSum = 0;
  let maxSabsCases = 0;
  let oneSabLessCases = 0;

  const permutations = combo([...config]);
  for (let i = 0; i < permutations.length; ++i) {
    permutations[i].length = playersNo;
    caseSum = permutations[i].reduce((a, b) => a + b, 0);
    if (caseSum === maxSabs) {
      ++maxSabsCases;
    } else {
      ++oneSabLessCases;
    }
  }

  return Math.round((oneSabLessCases / (oneSabLessCases + maxSabsCases)) * 100);
}

const initiateKarmas = (playersNo, isSaboteur, maxSaboteurs, playerIndex, rolesConfig) => {
  const selfKarma = isSaboteur ? 100 : 0
  let karmasArray = [];
  karmasArray.length = playersNo;
  karmasArray[playerIndex] = selfKarma;
  for (let i = 0; i < playersNo; ++i) {
    if (i !== playerIndex) {
      karmasArray[i] = 50;
    }
  }
  return karmasArray;
}

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
  if (karmasArray[index] === value || (karmasArray[index] === 0 && value < 100) || (karmasArray[index] === 100 && value > 0)) {
    return karmasArray;
  }

  if (value < 0) {
    value = 0;
  }
  if (value > 100) {
    value = 100;
  }

  let newKarmasArray = [...karmasArray];
  newKarmasArray[index] = value;

  newKarmasArray = complementKarmas(newKarmasArray, maxSaboteurs);

  return newKarmasArray;
}

const updateKarmas = (playersData, playerIndex, operation, cardType, maxSaboteurs, oldBoard, newBoard, operationTarget) => {
  if (operation === 'build') {
    let currentEval = null;
    let newEval = null;
    let probs = null;

    for (let i = 0; i < playersData.length; ++i) {
      probs = calculateTargetsPropabilities(playersData, i, maxSaboteurs);
      currentEval = evaluateBoard(oldBoard, probs[0], probs[1], probs[2]);
      newEval = evaluateBoard(newBoard, probs[0], probs[1], probs[2]);

      if (isDeadEndCard(cardType)) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
      } else if (newEval < currentEval) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, playersData[i].karmas[playerIndex] - 20, maxSaboteurs);
      } else if (newEval > currentEval) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, playersData[i].karmas[playerIndex] + 20, maxSaboteurs);
      } else if (newEval === currentEval) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, playersData[i].karmas[playerIndex] + 20, maxSaboteurs);
      }

    }
  } else if (operation === 'rockfall') {
    let currentEval = null;
    let newEval = null;
    let probs = null;
    for (let i = 0; i < playersData.length; ++i) {
      probs = calculateTargetsPropabilities(playersData, i, maxSaboteurs);
      currentEval = evaluateBoard(oldBoard, probs[0], probs[1], probs[2]);
      newEval = evaluateBoard(newBoard, probs[0], probs[1], probs[2]);

      if (newEval > currentEval) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
      }
      if (newEval < currentEval) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 0, maxSaboteurs);
      }

    }
  } else if (operation === 'block') {
    for (let i = 0; i < playersData.length; ++i) {
        if (playersData[i].karmas[operationTarget] === 0) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
        } else if (playersData[i].karmas[operationTarget] === 100) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 0, maxSaboteurs);
        }
    }
  } else if (operation === 'fix') {
    for (let i = 0; i < playersData.length; ++i) {
      if (playerIndex !== operationTarget) {
        if (playersData[i].karmas[operationTarget] === 0) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 0, maxSaboteurs);
        } else if (playersData[i].karmas[operationTarget] === 100) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
        }
      }
    }
  } else if (operation === 'throwaway') {
    for (let i = 0; i < playersData.length; ++i) {
      playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, playersData[i].karmas[playerIndex] + 5, maxSaboteurs);
    }
  }
}

const changeTool = (playersData, playerIndex, tool, newStatus) => {
  if (tool === 'pickaxe') {
    playersData[playerIndex].pickaxe = newStatus;
  }
  if (tool === 'lamp') {
    playersData[playerIndex].lamp = newStatus;
  }
  if (tool === 'truck') {
    playersData[playerIndex].truck = newStatus;
  }
}

const getToolsChangePossibleUses = (playersData, playerIndex, tool, newStatus) => {
  let possibleUsesArray = [];
  if (newStatus) {
    for (let i = 0; i < playersData.length; ++i) {
      if (tool === 'pickaxe' && playersData[i].pickaxe === false) {
        possibleUsesArray.push(i);
      } else if (tool === 'truck' && playersData[i].truck === false) {
        possibleUsesArray.push(i);
      } else if (tool === 'lamp' && playersData[i].lamp === false) {
        possibleUsesArray.push(i);
      }
    }
  } else {
    for (let i = 0; i < playersData.length; ++i) {
      if (i !== playerIndex) {
        if (tool === 'pickaxe' && playersData[i].pickaxe === true) {
          possibleUsesArray.push(i);
        } else if (tool === 'truck' && playersData[i].truck === true) {
          possibleUsesArray.push(i);
        } else if (tool === 'lamp' && playersData[i].lamp === true) {
          possibleUsesArray.push(i);
        }
      }
    }
  }
  return possibleUsesArray;
}

const initiateCardsAmounts = (cardsInHand) => {
  const cardsAmounts = {
    0: 1,
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 4,
    6: 5,
    7: 5,
    8: 3,
    9: 1,
    10: 1,
    11: 5,
    12: 1,
    13: 1,
    14: 5,
    15: 4,
    16: 6,
    17: 3,
    18: 3,
    19: 3,
    20: 3, 
    21: 2,
    22: 2,
    23: 2,
    24: 1,
    25: 1,
    26: 1,
  }
  for (let i = 0; i < cardsInHand.length; ++i) {
    cardsAmounts[cardsInHand[i].type] -= 1;
  }
  return cardsAmounts;
}

const removeCardFromCardsAmounts = (cardsAmounts, cardType) => {
   cardsAmounts[cardType] -= 1;
}

const getCardPossibilities = (cardsAmounts) => {
  let possibilities = {};

  let remainingCards = 0;
  Object.keys(cardsAmounts).forEach((el) => {
    remainingCards += cardsAmounts[el];
  });

  Object.keys(cardsAmounts).forEach((el) => {
    possibilities[el] = cardsAmounts[el] / remainingCards;
  });

  return possibilities;
}

const finalReveal = (playersInfo, board, showTargets) => {
  console.log(' ');
  for (let i = 0; i < playersInfo.length; ++i) {
    console.log(playersInfo[i].name + ' was a ' + (playersInfo[i].role ? 'saboteur' : 'digger') + '.');
  }
  if (showTargets) {
    console.log(' ');
    if (board[3][10].cardType === -3) {
      console.log('Gold was on top.');
    }
    if (board[5][10].cardType === -3) {
      console.log('Gold was on middle.');
    }
    if (board[7][10].cardType === -3) {
      console.log('Gold was on bottom.');
    }
  }
}

const anyCardsLeft = (playersData) => {
  let sum = 0;
  for (let i = 0; i < playersData.length; ++i) {
    sum += playersData[i].cards.length;
  }
  return sum > 0;
}

const consoleThinkingLines = (moves) => {
  let longerThanFive = false;
  const movesToConsole = moves.map((el) => ({ value: el.value, description: el.description }));
  if (movesToConsole.length > 5) {
    longerThanFive = true;
    movesToConsole.length = 5;
  }
  console.log(movesToConsole);
  if (longerThanFive) {
    console.log('... and more moves');
  }
}

module.exports = { 
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
  chatMessage,
  prepareSaboteurAccuses,
  getCardsForPlayer,
  getCardsDescriptions,
}
