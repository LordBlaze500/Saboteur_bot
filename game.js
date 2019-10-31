const { deck } = require('./deck');
const { playersConfigs } = require('./playersConfigs');

const boardWidth = 12;
const boardHeight = 7;

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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const graphBoard = (board) => {
  for (let i = 0; i < board.length; ++i) {
    let row = '';
    for (let j = 0; j < board[i].length; ++j) {
      if (board[i][j].cardType === -1) {
        if (board[i][j].buildable && board[i][j].accessible) {
          row += 'X';
        } 
        else {
          row += '░';
        }
        // if (board[i][j].buildable && !board[i][j].accessible) {
        //   row += 'B';
        // }
        // if (!board[i][j].buildable && board[i][j].accessible) {
        //   row += 'A';
        // } 
        // if (!board[i][j].buildable && !board[i][j].accessible) {
        //   row += '░';
        // } 
      }
      if (board[i][j].special === 'start') {
        row += '╬';
      }
      if (board[i][j].special === 'gold' || board[i][j].special === 'coal') {
        row += '▓';
      }
      if (board[i][j].cardType === 0) {
        row += '┼';
      }
      if (board[i][j].cardType === 1 && !board[i][j].flipped) {
        row += '┴';
      }
      if (board[i][j].cardType === 1 && board[i][j].flipped) {
        row += '┬';
      }
      if (board[i][j].cardType === 2 && !board[i][j].flipped) {
        row += '┤';
      }
      if (board[i][j].cardType === 2 && board[i][j].flipped) {
        row += '├';
      }
      if (board[i][j].cardType === 12 && !board[i][j].flipped) {
        row += '┘';
      }
      if (board[i][j].cardType === 12 && board[i][j].flipped) {
        row += '┌';
      }
      if (board[i][j].cardType === 3) {
        row += '│';
      }
      if (board[i][j].cardType === 4 && !board[i][j].flipped) {
        row += '¡';
      }
      if (board[i][j].cardType === 4 && board[i][j].flipped) {
        row += 'º';
      }
      if (board[i][j].cardType === 5) {
        row += '║';
      }
      if (board[i][j].cardType === 6) {
        row += '╬';
      }
      if (board[i][j].cardType === 7 && !board[i][j].flipped) {
        row += '╩';
      }
      if (board[i][j].cardType === 7 && board[i][j].flipped) {
        row += '╦';
      }
      if (board[i][j].cardType === 8) {
        row += '═';
      }
      if (board[i][j].cardType === 9) {
        row += '─';
      }
      if (board[i][j].cardType === 10 && !board[i][j].flipped) {
        row += '»';
      }
      if (board[i][j].cardType === 10 && board[i][j].flipped) {
        row += '«';
      }
      if (board[i][j].cardType === 11 && !board[i][j].flipped) {
        row += '╚';
      }
      if (board[i][j].cardType === 11 && board[i][j].flipped) {
        row += '╗';
      }
      if (board[i][j].cardType === 13 && !board[i][j].flipped) {
        row += '└';
      }
      if (board[i][j].cardType === 13 && board[i][j].flipped) {
        row += '┐';
      }
      if (board[i][j].cardType === 14 && !board[i][j].flipped) {
        row += '╣';
      }
      if (board[i][j].cardType === 14 && board[i][j].flipped) {
        row += '╠';
      }
      if (board[i][j].cardType === 15 && !board[i][j].flipped) {
        row += '╝';
      }
      if (board[i][j].cardType === 15 && board[i][j].flipped) {
        row += '╔';
      }
    }
    console.log(row);
  }
}

markPossiblePoints = (board) => {
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

markAccessiblity = (board) => {
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[i].length; ++j) {
      board[i][j].accessible = false;
    }
  }
  board[3][1].accessible = true;
  a(board, 3, 1);
}

a = (board, i, j) => {
  if (board[i][j].outUp && i > 0) {
    if (board[i - 1][j].cardType === -1) {
      board[i - 1][j].accessible = true;
    }
    if (board[i - 1][j].cardType !== -1 && board[i - 1][j].accessible !== true && board[i - 1][j].inDown) {
      board[i - 1][j].accessible = true;
      a(board, i - 1, j)
    }
  }

  if (board[i][j].outDown && i < (boardHeight - 1)) {
    if (board[i + 1][j].cardType === -1) {
      board[i + 1][j].accessible = true;
    }
    if (board[i + 1][j].cardType !== -1 && board[i + 1][j].accessible !== true && board[i + 1][j].inUp) {
      board[i + 1][j].accessible = true;
      a(board, i + 1, j)
    }
  }

  if (board[i][j].outLeft && j > 0) {
    if (board[i][j - 1].cardType === -1) {
      board[i][j - 1].accessible = true;
    }
    if (board[i][j - 1].cardType !== -1 && board[i][j - 1].accessible !== true && board[i][j - 1].inRight) {
      board[i][j - 1].accessible = true;
      a(board, i, j - 1)
    }
  }

  if (board[i][j].outRight && j < (boardWidth - 1)) {
    if (board[i][j + 1].cardType === -1) {
      board[i][j + 1].accessible = true;
    }
    if (board[i][j + 1].cardType !== -1 && board[i][j + 1].accessible !== true && board[i][j + 1].inLeft) {
      board[i][j + 1].accessible = true;
      a(board, i, j + 1)
    }
  }
}

canCardBeBuilt = (board, card, i, j, x) => {
  if (board[i][j].cardType !== -1 || board[i][j].buildable !== true || board[i][j].accessible !== true || card.type >= 15) {
    if (x && false) {
      console.log('false');
    }
    return false;
  }
  if (i > 0 && board[i - 1][j].cardType !== -1 && card.inUp !== board[i - 1][j].inDown) {
    if (x && false) {
      console.log('false');
    }
    return false;
  }
  if (i < (boardHeight - 1) && board[i + 1][j].cardType !== -1 && card.inDown !== board[i + 1][j].inUp) {
    if (x && false) {
      console.log('false');
    }
    return false;
  }
  if (j > 0 && board[i][j - 1].cardType !== -1 && card.inLeft !== board[i][j - 1].inRight) {
    if (x && false) {
      console.log('false');
    }
    return false;
  }
  if (j < (boardWidth - 1) && board[i][j + 1].cardType !== -1 && card.inRight !== board[i][j + 1].inLeft) {
    if (x && false) {
      console.log('false');
    }
    return false;
  }

  if (x && false) {
    console.log('X abc');
    console.log(i, j);
      console.log(board[i][j]);
      console.log(card);
      console.log('true');
    }
  return true;
}

refreshAccess = (board) => {
  markPossiblePoints(board);
  markAccessiblity(board);
}

const boardPiece = {
  cardType: -1,
  flipped: false,
  special: null,
  buildable: false,
  accessible: false,
};

buildCard = (board, card, i, j, flipped) => {
  board[i][j] = {
    ...card,
    special: null,
    cardType: card.type,
    accessible: false,
    flipped,
  };
  refreshAccess(board);
}

doRockFall = (board, i, j) => {
  board[i][j] = {
    ...boardPiece,
  }
  refreshAccess(board);
}

flipCard = (card) => {
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

let board = [];

for (let i = 0; i < boardHeight; ++i) {
  let b = [];
  for (let j = 0; j < boardWidth; ++j) {
    b.push({ ...boardPiece });
  }
  board.push(b);
}

const targets = [3, 1, 5];//shuffle([1,3,5]);

board[3][1] = {
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

board[targets[0]][9] = {
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

board[targets[1]][9] = {
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

board[targets[2]][9] = {
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

const shuffled = shuffle([...deck]);

const playersNo = 5;
const roles = shuffle(playersConfigs[playersNo]); 

// const playersData = [];
// for (let i = 0; i < playersNo; ++i) {
//   playersData.push({
//     role: roles[i],
//     pickaxe: true,
//     truck: true,
//     lamp: true,
//     cards: [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()]
//   })
// }

const isGoldRevealed = (board) => board[3][9].accessible === true;

const calculateMove = (cardsInHand, isSaboteur, board) => {
  let outcomes = [];
  let clone;
  let value;
  let flipped;
  let currentEvaluation = evaluateBoard(board, 0, 1, 0);
  let cardOutcomes = [];
  for (let a = 0; a < cardsInHand.length; ++a) {
    cardOutcomes = [];
    flipped = cardsInHand[a].flippable ? flipCard({...cardsInHand[a]}) : null;
    for (let i = 0; i < board.length; ++i) {
      for (let j = 0; j < board[i].length; ++j) {
        clone = cloneBoard(board);
        if (cardsInHand[a].type <= 15) {
          if (canCardBeBuilt(clone, cardsInHand[a], i, j, isSaboteur)) {
            buildCard(clone, cardsInHand[a], i, j);
            if (isGoldRevealed(clone)) {
              value = 0
            } else {
              value = evaluateBoard(clone, 0, 1, 0);
              // value = evaluateBoard(clone, 0.333, 0.333, 0.333);
            }
            cardOutcomes.push({
              value,
              cardIndex: a,
              flipped: false,
              i,
              j,
            })
          }

          if (flipped) {
            if (canCardBeBuilt(clone, flipped, i, j, isSaboteur)) {
              buildCard(clone, flipped, i, j);
              if (isGoldRevealed(clone)) {
                value = 0
              } else {
                value = evaluateBoard(clone, 0, 1, 0);
                // value = evaluateBoard(clone, 0.333, 0.333, 0.333);
              }
              cardOutcomes.push({
                value,
                cardIndex: a,
                flipped: true,
                i,
                j,
              })
            }
          }
        } else if (cardsInHand[a].type === 17 && clone[i][j].type >= 0 && clone[i][j].type <= 15) {
          doRockFall(clone, i, j);
          outcomes.push({
            value: evaluateBoard(clone, 0, 1, 0),
            cardIndex: a,
            i,
            j,
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
          cardIndex: a,
          throwAway: true,
        })
      }
    }

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
    return Math.abs(1 - i) + Math.abs(9 - j);
  } else if (whichTarget === 1) {
    return Math.abs(3 - i) + Math.abs(9 - j);
  }
  return Math.abs(5 - i) + Math.abs(9 - j);
}

let v = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
let x = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
let y = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
let xx = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
let yy = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];

let bestMove = null;

let z = 1;
let diggersVictory = false;

isDiggersVictory = (board) => (board[3][9].accessible === true);

while (z < 9) {
  console.log('TURN ' + z);

  console.log('Digger 1');
  bestMove = calculateMove(v, false, board);
  if (bestMove && bestMove.throwAway) {
    console.log('Throwing away a card...');
    v.splice(bestMove.cardIndex, 1);
    console.log(bestMove.value);
    graphBoard(board);
  } else if (bestMove) {
    if (v[bestMove.cardIndex].type <= 15) {
      buildCard(board, bestMove.flipped ? flipCard(v[bestMove.cardIndex]) : v[bestMove.cardIndex], bestMove.i, bestMove.j, bestMove.flipped);
    } else if (v[bestMove.cardIndex].type === 17) {
      console.log('ROCK FALL');
      doRockFall(board, bestMove.i, bestMove.j);
    }
    v.splice(bestMove.cardIndex, 1);
    console.log(bestMove.value);
    graphBoard(board);
  } else {
    console.log('Unable to move - throwing away a card...');
    graphBoard(board);
    v.pop();
  }
  if (shuffled.length) {
    v.push(shuffled.pop());
  }

  diggersVictory = isDiggersVictory(board);
  if (diggersVictory) {
    break;
  }

  console.log(' ');
  console.log('Digger 2');
  bestMove = calculateMove(x, false, board);
  if (bestMove && bestMove.throwAway) {
    console.log('Throwing away a card...');
    x.splice(bestMove.cardIndex, 1);
    console.log(bestMove.value);
    graphBoard(board);
  } else if (bestMove) {
    if (x[bestMove.cardIndex].type <= 15) {
      buildCard(board, bestMove.flipped ? flipCard(x[bestMove.cardIndex]) : x[bestMove.cardIndex], bestMove.i, bestMove.j, bestMove.flipped);
    } else if (x[bestMove.cardIndex].type === 17) {
      console.log('ROCK FALL');
      doRockFall(board, bestMove.i, bestMove.j);
    }
    x.splice(bestMove.cardIndex, 1);
    console.log(bestMove.value);
    graphBoard(board);
  } else {
    console.log('Unable to move - throwing away a card...');
    graphBoard(board);
    x.pop();
  }
  if (shuffled.length) {
    x.push(shuffled.pop());
  }

  diggersVictory = isDiggersVictory(board);
  if (diggersVictory) {
    break;
  }
  
  console.log(' ');
  console.log('Saboteur 1');
  bestMove = calculateMove(y, true, board);
  if (bestMove && bestMove.throwAway) {
    console.log('Throwing away a card...');
    y.splice(bestMove.cardIndex, 1);
    console.log(bestMove.value);
    graphBoard(board);
  } else if (bestMove) {
    console.log(bestMove.value);
    if (y[bestMove.cardIndex].type <= 15) {
      canCardBeBuilt(board, bestMove.flipped ? flipCard(y[bestMove.cardIndex]) : y[bestMove.cardIndex], bestMove.i, bestMove.j, true);
      buildCard(board, bestMove.flipped ? flipCard(y[bestMove.cardIndex]) : y[bestMove.cardIndex], bestMove.i, bestMove.j, bestMove.flipped);
    } else if (y[bestMove.cardIndex].type === 17) {
      console.log('ROCK FALL');
      doRockFall(board, bestMove.i, bestMove.j);
    }
    graphBoard(board);
    y.splice(bestMove.cardIndex, 1);
  } else {
    console.log('Unable to move - throwing away a card...');
    graphBoard(board);
    y.pop();
  }
  if (shuffled.length) {
    y.push(shuffled.pop());
  }

  diggersVictory = isDiggersVictory(board);
  if (diggersVictory) {
    break;
  }

  console.log(' ');
  console.log('Digger 3');
  bestMove = calculateMove(xx, false, board);
  if (bestMove && bestMove.throwAway) {
    console.log('Throwing away a card...');
    xx.splice(bestMove.cardIndex, 1);
    console.log(bestMove.value);
    graphBoard(board);
  } else if (bestMove) {
    if (xx[bestMove.cardIndex].type <= 15) {
      buildCard(board, bestMove.flipped ? flipCard(xx[bestMove.cardIndex]) : xx[bestMove.cardIndex], bestMove.i, bestMove.j, bestMove.flipped);
    } else if (xx[bestMove.cardIndex].type === 17) {
      console.log('ROCK FALL');
      doRockFall(board, bestMove.i, bestMove.j);
    }
    console.log(bestMove.value);
    graphBoard(board);
    xx.splice(bestMove.cardIndex, 1);
  } else {
    console.log('Unable to move - throwing away a card...');
    graphBoard(board);
    xx.pop();
  }
  if (shuffled.length) {
    xx.push(shuffled.pop());
  }

  diggersVictory = isDiggersVictory(board);
  if (diggersVictory) {
    break;
  }

  console.log(' ');
  console.log('Digger 4');
  bestMove = calculateMove(yy, false, board);
  if (bestMove && bestMove.throwAway) {
    console.log('Throwing away a card...');
    yy.splice(bestMove.cardIndex, 1);
    console.log(bestMove.value);
    graphBoard(board);
  } else if (bestMove) {
    if (yy[bestMove.cardIndex].type <= 15) {
      canCardBeBuilt(board, bestMove.flipped ? flipCard(yy[bestMove.cardIndex]) : yy[bestMove.cardIndex], bestMove.i, bestMove.j, true);
      buildCard(board, bestMove.flipped ? flipCard(yy[bestMove.cardIndex]) : yy[bestMove.cardIndex], bestMove.i, bestMove.j, bestMove.flipped);
    } else if (yy[bestMove.cardIndex].type === 17) {
      console.log('ROCK FALL');
      doRockFall(board, bestMove.i, bestMove.j);
    }
    console.log(bestMove.value);
    graphBoard(board);
    y.splice(bestMove.cardIndex, 1);
  } else {
    console.log('Unable to move - throwing away a card...');
    graphBoard(board);
    yy.pop();
  }
  if (shuffled.length) {
    yy.push(shuffled.pop());
    // yy.push({...deck[41]});
    // shuffled.pop();
  }

  diggersVictory = isDiggersVictory(board);
  if (diggersVictory) {
    break;
  }

  console.log(' ');

  ++z;
}

console.log(' ');
console.log('GAME OVER');
if (diggersVictory) {
  console.log('DIGGERS WIN');
} else {
  console.log('SABOTEURS WINS');
}
