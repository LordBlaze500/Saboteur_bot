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

const targets = [3,5,7];//shuffle([3,5,7]);

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
  if (coalOne.accessible === true && coalOne.type < 0) {
    if (i < targets[1] || j < 10) {
      buildCard(board, {...deck[36]}, targets[1], 10, false);
    } else {
      buildCard(board, flipCard({...deck[36]}), targets[1], 10, true);
    }
  }
  if (coalTwo.accessible === true && coalTwo.type < 0) {
    if (i < targets[2] || j > 10) {
      buildCard(board, {...deck[25]}, targets[2], 10, false);
    } else {
      buildCard(board, flipCard({...deck[25]}), targets[2], 10, true);
    }
  }
}

const calculateMove = (cardsInHand, isSaboteur, board) => {
  let outcomes = [];
  let clone;
  let value;
  let flipped;
  let currentEvaluation = evaluateBoard(board, 1, 0, 0);
  let cardOutcomes = [];
  for (let a = 0; a < cardsInHand.length; ++a) {
    cardOutcomes = [];
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
              value = evaluateBoard(clone, 1, 0, 0);
              // value = evaluateBoard(clone, 0.333, 0.333, 0.333);
            }
            cardOutcomes.push({
              value,
              cardIndex: a,
              board: clone,
              flipped: false,
              operation: 'build',
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
                value = evaluateBoard(clone, 1, 0, 0);
                // value = evaluateBoard(clone, 0.333, 0.333, 0.333);
              }
              cardOutcomes.push({
                value,
                cardIndex: a,
                flipped: true,
                board: clone,
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
            value: evaluateBoard(clone, 1, 0, 0),
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
    claims.push({
      top: 0,
      middle: 0,
      bottom: 0,
    })
  };
  return claims;
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
  targets,
}