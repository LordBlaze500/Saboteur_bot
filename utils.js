const { deck } = require('./deck');
const { graphBoard } = require('./graphBoard');

const boardPiece = {
  cardType: -1,
  flipped: false,
  special: null,
  buildable: false,
  accessible: false,
};

const boardWidth = 14;
const boardHeight = 11;

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
  if (board[i][j].cardType !== -1 || board[i][j].buildable !== true || board[i][j].accessible !== true || card.type >= 15) {
    return false;
  }
  if (i > 0 && board[i - 1][j].cardType !== -1 && card.inUp !== board[i - 1][j].inDown) {
    return false;
  }
  if (i < (boardHeight - 1) && board[i + 1][j].cardType !== -1 && card.inDown !== board[i + 1][j].inUp) {
    return false;
  }
  if (j > 0 && board[i][j - 1].cardType !== -1 && card.inLeft !== board[i][j - 1].inRight) {
    return false;
  }
  if (j < (boardWidth - 1) && board[i][j + 1].cardType !== -1 && card.inRight !== board[i][j + 1].inLeft) {
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

const diggersVictory = () => {
  console.log('DIGGERS WIN');
  process.exit(0);
}

const isGoldRevealed = (board) => board[targets[0]][10].accessible === true;

const checkTargets = (board, i, j, withoutGold) => {
  const gold = board[targets[0]][10];
  const coalOne = board[targets[1]][10];
  const coalTwo = board[targets[2]][10];

  if (gold.accessible === true && !withoutGold) {
    graphBoard(board);
    diggersVictory();
  }
  if (coalOne.accessible === true && coalOne.cardType < 0) {
    if (i < targets[1] || j < 10) {
      buildCard(board, {...deck[36]}, targets[1], 10, false);
    } else {
      buildCard(board, flipCard({...deck[36]}), targets[1], 10, true);
    }
  }
  if (coalTwo.accessible === true && coalTwo.cardType < 0) {
    if (i < targets[2] || j > 10) {
      buildCard(board, {...deck[25]}, targets[2], 10, false);
    } else {
      buildCard(board, flipCard({...deck[25]}), targets[2], 10, true);
    }
  }
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

const makeClaim = (playersData, playerIndex, target, value, maxSaboteurs) => {
  if (playersData[playerIndex].role === 1) {
    console.log('I claim nothing.');
    for (let i = 0; i < playersData.length; ++i) {
      updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
    }
  } else {
    if (target === 0) {
      console.log('I claim top is ' + (value === 1 ? 'gold' : 'coal') + '.');
    } else if (target === 1) {
      console.log('I claim middle is ' + (value === 1 ? 'gold' : 'coal') + '.');
    } else {
      console.log('I claim bottom is ' + (value === 1 ? 'gold' : 'coal') + '.');
    }

    for (let i = 0; i < playersData.length; ++i) {
      playersData[i].claims[playerIndex][target] = value;
      if (playersData[i].claims[i][target] === 1 && playersData[i].claims[playerIndex][target] === -1) {
        updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
      } else if (playersData[i].claims[i][target] === -1 && playersData[i].claims[playerIndex][target] === 1) {
        updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
      }
    }
  }
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
  result[0] = result[0] / flattener;
  result[1] = result[1] / flattener;
  result[2] = result[2] / flattener;

  return result;
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
    return [0.333, 0.333, 0.333];
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

const shouldConsiderBlock = (playersData, playerIndex, targetIndex) => {
  const isSaboteur = playersData[playerIndex].role === 1;
  if (isSaboteur) {
    if (playersData[playerIndex].karmas[targetIndex] < 20) {
      return true;
    }
  } else {
    if (playersData[playerIndex].karmas[targetIndex] > 80) {
      return true;
    }
  }
  return false;
}

const shouldConsiderFix = (playersData, playerIndex, targetIndex) => {
  const isSaboteur = playersData[playerIndex].role === 1;
  if (isSaboteur) {
    if (playersData[playerIndex].karmas[targetIndex] > 60) {
      return true;
    }
  } else {
    if (playersData[playerIndex].karmas[targetIndex] < 40) {
      return true;
    }
  }
  return false;
}

const calculateMove = (playersData, playerIndex, maxSaboteurs, board, turnNo) => {
  const cardsInHand = playersData[playerIndex].cards;
  const isSaboteur = playersData[playerIndex].role === 1;
  const propabilities = calculateTargetsPropabilities(playersData, playerIndex, maxSaboteurs);
  const knowledge = playersData[playerIndex].targetsKnowledge;

  let outcomes = [];
  let clone;
  let value;
  let flipped;
  const goldTopProb = propabilities[0];
  const goldMiddleProb = propabilities[1];
  const goldBottomProb = propabilities[2];
  let currentEvaluation = evaluateBoard(board, goldTopProb, goldMiddleProb, goldBottomProb);
  let cardOutcomes = [];
  for (let a = 0; a < cardsInHand.length; ++a) {
    cardOutcomes = [];

    if (cardsInHand[a].special === 'map') {
      if (isGoldKnown(knowledge)) {
        outcomes.push({
          value: isSaboteur ? currentEvaluation + 0.01 : currentEvaluation - 0.01,
          board,
          cardIndex: a,
          operation: 'throwaway',
        })
      } else if (!isSaboteur || turnNo > 3) {
        const { knowledge: obtainedKnowledge, target: obtainedTarget } = useMap(board, [...knowledge], [...propabilities]);
        outcomes.push({
          value: isSaboteur ? 99 : -99,
          board,
          cardIndex: a,
          operation: 'map',
          knowledge: obtainedKnowledge,
          target: obtainedTarget,
        })
      }
    } else if (cardsInHand[a].type === 17) {
      for (let i = 0; i < board.length; ++i) {
        for (let j = 0; j < board[i].length; ++j) {
          if (!(j === 10 && i === targets[1]) && !(j === 10 && i === targets[2]) && board[i][j].type >= 0 && board[i][j].type <= 15) {
            clone = cloneBoard(board);
            doRockFall(clone, i, j);
            outcomes.push({
              value: evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb),
              cardIndex: a,
              board: clone,
              operation: 'rockfall',
            });
          }
        }
      }
    } else if (cardsInHand[a].type >= 18 && cardsInHand[a].type <= 20) {
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
      let isTargetAlreadyBlocked = false;
      let moveValue = null;

      possibleUses = possibleUses.filter((el) => shouldConsiderBlock(playersData, playerIndex, el));

      for (let i = 0; i < possibleUses.length; ++i) {
        isTargetAlreadyBlocked = isPlayerBlocked(playersData, possibleUses[i]);

        moveValue = currentEvaluation;
        if (isSaboteur) {
          moveValue += (((100 - playersData[playerIndex].karmas[possibleUses[i]]) * (isTargetAlreadyBlocked ? 1 : 5)) / 100);
        } else {
          moveValue -= (((playersData[playerIndex].karmas[possibleUses[i]]) * (isTargetAlreadyBlocked ? 1 : 5)) / 100);
        }

        outcomes.push({
          value: moveValue,
          cardIndex: a,
          board,
          operation: 'block',
          blockType: stringBlock,
          blockTarget: possibleUses[i],
        })
      }
    } else if (cardsInHand[a].type >= 21) {
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

      possibleUsesOne = possibleUsesOne.filter((el) => shouldConsiderFix(playersData, playerIndex, el));
      possibleUsesTwo = possibleUsesTwo.filter((el) => shouldConsiderFix(playersData, playerIndex, el));

      let moveValue = null;

      for (let i = 0; i < possibleUsesOne.length; ++i) {
        moveValue = currentEvaluation;
        if (isSaboteur) {
          if (playerIndex === possibleUsesOne[i]) {
            moveValue = currentEvaluation + 3;
          } else {
            moveValue += (playersData[playerIndex].karmas[possibleUsesOne[i]] * 1) / 100;
          }
        } else {
          if (playerIndex === possibleUsesOne[i]) {
            moveValue = currentEvaluation - 3;
          } else {
            moveValue -= ((100 - playersData[playerIndex].karmas[possibleUsesOne[i]]) * 1) / 100;
          }
        }

        outcomes.push({
          value: moveValue,
          cardIndex: a,
          board,
          operation: 'fix',
          fixType: stringFixOne,
          fixTarget: possibleUsesOne[i],
        })
      }

      for (let i = 0; i < possibleUsesTwo.length; ++i) {
        moveValue = currentEvaluation;
        if (isSaboteur) {
          if (playerIndex === possibleUsesTwo[i]) {
            moveValue = currentEvaluation + 3;
          } else {
            moveValue += (playersData[playerIndex].karmas[possibleUsesTwo[i]] * 1.5) / 100;
          }
        } else {
          if (playerIndex === possibleUsesTwo[i]) {
            moveValue = currentEvaluation - 3;
          } else {
            moveValue -= ((100 - playersData[playerIndex].karmas[possibleUsesTwo[i]]) * 1.5) / 100;
          }
        }

        outcomes.push({
          value: moveValue,
          cardIndex: a,
          board,
          operation: 'fix',
          fixType: stringFixTwo,
          fixTarget: possibleUsesTwo[i],
        })
      }

    } else if (!isPlayerBlocked(playersData, playerIndex)) {
      flipped = cardsInHand[a].flippable ? flipCard({...cardsInHand[a]}) : null;
      for (let i = 0; i < board.length; ++i) {
        for (let j = 0; j < board[i].length; ++j) {
          if (cardsInHand[a].type <= 15) {
            if (canCardBeBuilt(board, cardsInHand[a], i, j, isSaboteur)) {
              clone = cloneBoard(board);
              buildCard(clone, cardsInHand[a], i, j, false);
              checkTargets(clone, i, j, true);
              if (isGoldRevealed(clone)) {
                value = -9999;
              } else {
                value = evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb);
              }
              cardOutcomes.push({
                value,
                cardIndex: a,
                board: clone,
                flipped: false,
                operation: 'build',
                cardType: cardsInHand[a].type,
                i,
                j,
              })
            }

            if (flipped) {
              if (canCardBeBuilt(board, flipped, i, j, isSaboteur)) {
                clone = cloneBoard(board);
                buildCard(clone, flipped, i, j, true);
                checkTargets(clone, i, j, true);
                if (isGoldRevealed(clone)) {
                  value = 0
                } else {
                  value = evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb);
                }
                cardOutcomes.push({
                  value,
                  cardIndex: a,
                  flipped: true,
                  board: clone,
                  cardType: cardsInHand[a].type,
                  operation: 'build',
                  i,
                  j,
                })
              }
            }
          } 
        }
      }

      if (cardOutcomes.length > 0) {
        const usefulMoveIndx = cardOutcomes.findIndex((el) => {
          return isSaboteur ? (el.value > currentEvaluation) : (el.value < currentEvaluation);
        })

        if (usefulMoveIndx !== -1) {
          outcomes = [...outcomes, ...cardOutcomes];
        } else {
          outcomes.push({
            value: isSaboteur ? currentEvaluation + 0.01 : currentEvaluation - 0.01,
            board,
            cardIndex: a,
            operation: 'throwaway',
          })
        }
      }
    }
  }

  if (outcomes.length === 0) {
    let relativeCardValues = [];
    for (let i = 0; i < cardsInHand.length; ++i) {
      if (cardsInHand[i].type >= 21) {
        relativeCardValues[i] = { value: isSaboteur ? 3 : 2, index: i };
      } else if (cardsInHand[i].type >= 18 && cardsInHand[i].type <= 20) {
        relativeCardValues[i] = { value: isSaboteur ? 2 : 3, index: i };
      } else {
        relativeCardValues[i] = { value: (cardsInHand[i].outUp ? 1 : 0) + (cardsInHand[i].outRight ? 1.5 : 0) + (cardsInHand[i].outLeft ? 1.5 : 0) + (cardsInHand[i].outDown ? 1 : 0), index: i };
      }
    }

    relativeCardValues.sort((a, b) => {
      if (a.value > b.value) {
        return isSaboteur ? -1 : 1;
      }
      if (b.value > a.value) {
        return isSaboteur ? 1 : -1;
      }
      return 0;
    });

    outcomes.push({
      value: currentEvaluation + relativeCardValues[0].value,
      board,
      cardIndex: relativeCardValues[0].index,
      operation: 'throwaway',
    })
  }

  outcomes.sort((a, b) => {
    if (a.value > b.value) {
      return isSaboteur ? -1 : 1;
    }
    if (b.value > a.value) {
      return isSaboteur ? 1 : -1;
    }
    return 0;
  });

  const bestMove = outcomes[0];

  if (!isSaboteur && bestMove.operation === 'rockfall') {
    console.log(outcomes);
  }

  return bestMove;
}

const evaluateBoard = (board, goldTopProb, goldMiddleProb, goldBottomProb) => {
  const copyBoard = cloneBoard(board);

  const topArray = [9999];
  const middleArray = [9999];
  const bottomArray = [9999];

  for (let i = 0; i < copyBoard.length; ++i) {
    for (let j = 0; j < copyBoard[i].length; ++j) {
      if (copyBoard[i][j].cardType === -1 && copyBoard[i][j].buildable && copyBoard[i][j].accessible) {
        topArray.push(getDistanceToTarget(i, j, 0));
        middleArray.push(getDistanceToTarget(i, j, 1));
        bottomArray.push(getDistanceToTarget(i, j, 2));
      }
    }
  }

  const minTargetTop = Math.min.apply(null, topArray);
  const minTargetMiddle = Math.min.apply(null, middleArray);
  const minTargetBottom = Math.min.apply(null, bottomArray);

  return goldTopProb * minTargetTop + goldMiddleProb * minTargetMiddle + goldBottomProb * minTargetBottom;
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
  let valueToSplit = maxSaboteurs * 100 - selfKarma - sabsNoChances(playersNo, rolesConfig);
  let karmasArray = [];
  karmasArray.length = playersNo;
  karmasArray[playerIndex] = selfKarma
  for (let i = 0; i < playersNo; ++i) {
    if (i !== playerIndex) {
      karmasArray[i] = Math.floor(valueToSplit / (playersNo - 1));
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
  if (karmasArray[index] === value || karmasArray[index] === 0 || karmasArray[index] === 100) {
    return karmasArray;
  }

  if (value < 0) {
    value = 0;
  }
  if (value > 100) {
    value = 100;
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
      }
      if (newEval < currentEval) {
        playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, playersData[i].karmas[playerIndex] - Math.floor(currentEval - newEval) * 20, maxSaboteurs);
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
        } else {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, playersData[i].karmas[playerIndex] + 100 - playersData[i].karmas[operationTarget], maxSaboteurs);
        }
    }
  } else if (operation === 'fix') {
    for (let i = 0; i < playersData.length; ++i) {
      if (playerIndex !== operationTarget) {
        if (playersData[i].karmas[operationTarget] === 0) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 0, maxSaboteurs);
        } else if (playersData[i].karmas[operationTarget] === 100) {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, 100, maxSaboteurs);
        } else {
          playersData[i].karmas = updateKarmasValues(playersData[i].karmas, playerIndex, playersData[i].karmas[playerIndex] - 100 + playersData[i].karmas[operationTarget], maxSaboteurs);
        }
      }
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
}
