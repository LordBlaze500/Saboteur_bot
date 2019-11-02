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
      updateKarmasValues(playersData[i], playerIndex, 100, maxSaboteurs);
    } else if (playersData[i].claims[i][target] === -1 && playersData[i].claims[playerIndex][target] === 1) {
      updateKarmasValues(playersData[i], playerIndex, 100, maxSaboteurs);
    }
  }

  // for (let i = 0; i < playersData.length; ++i) {
  //   if (playersData[i].karmas[playerIndex] === 0) {
  //     playersData[i].targetsKnowledge = addKnowledge(playersData[i].targetsKnowledge, target, value);
  //   }
  // }
}

const useMap = (board, knowledge) => {
  let target = null;
  if (knowledge[1] === 0) {
    knowledge = addKnowledge(knowledge, 1, board[5][10].special === 'gold' ? 1 : -1);
    target = 1;
  } else if (knowledge[0] === 0) {
    knowledge = addKnowledge(knowledge, 0, board[3][10].special === 'gold' ? 1 : -1);
    target = 0;
  } else {
    knowledge = addKnowledge(knowledge, 2, board[7][10].special === 'gold' ? 1 : -1);
    target = 2;
  }
  return { knowledge, target };
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

  // 0 -1
  // 0 1
  // 1 -1
  // 1 1
  // 2 -1
  // 2 1

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

  const sum = knowledge.reduce((a, b) => a + b, 0);
  if (sum === 0) {
    return [0.333, 0.333, 0.333];
  }
  
  if (knowledge[0] === -1) {
    return [0, 0.5, 0.5];
  }
  if (knowledge[1] === -1) {
    return [0.5, 0, 0.5];
  }
  if (knowledge[2] === -1) {
    return [0.5, 0.5, 0];
  }
}

const calculateMove = (cardsInHand, isSaboteur, board, propabilities, knowledge) => {
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
      } else {
        const { knowledge: obtainedKnowledge, target: obtainedTarget } = useMap(board, [...knowledge]);
        outcomes.push({
          value: isSaboteur ? 9999 : -9999,
          board,
          cardIndex: a,
          operation: 'map',
          knowledge: obtainedKnowledge,
          target: obtainedTarget,
        })
      }
    } else {
      flipped = cardsInHand[a].flippable ? flipCard({...cardsInHand[a]}) : null;
      for (let i = 0; i < board.length; ++i) {
        for (let j = 0; j < board[i].length; ++j) {
          if (cardsInHand[a].type <= 15) {
            if (canCardBeBuilt(board, cardsInHand[a], i, j, isSaboteur)) {
              clone = cloneBoard(board);
              buildCard(clone, cardsInHand[a], i, j, false);
              checkTargets(clone, i, j, true);
              if (isGoldRevealed(clone)) {
                value = 0
              } else {
                value = evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb);
                // value = evaluateBoard(clone, 0.333, 0.333, 0.333);
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
                  // value = evaluateBoard(clone, 0.333, 0.333, 0.333);
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
          } else if (cardsInHand[a].type === 17 && !(j === 10 && i === targets[1]) && !(j === 10 && i === targets[2]) && board[i][j].type >= 0 && board[i][j].type <= 15) {
            clone = cloneBoard(board);
            doRockFall(clone, i, j);
            outcomes.push({
              value: evaluateBoard(clone, goldTopProb, goldMiddleProb, goldBottomProb),
              cardIndex: a,
              board: clone,
              operation: 'rockfall',
            })
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
    outcomes.push({
      value: isSaboteur ? currentEvaluation + 0.01 : currentEvaluation - 0.01,
      board,
      cardIndex: 0,
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
  // console.log('sabsNoChances');
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

  // console.log('A');
  // console.log(maxSabsCases);

  // console.log('B');
  // console.log(oneSabLessCases);

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
