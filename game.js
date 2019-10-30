const { deck } = require('./deck');
const { playersConfigs } = require('./playersConfigs');

const { evaluateBoard, cloneBoard, calculateMove } = require('./engine');

const boardWidth = 12;
const boardHeight = 7;

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
      if (board[i][j].cardType === -1 && board[i][j].special === null) {
        if (board[i][j].buildable && board[i][j].accessible) {
          row += 'X';//'▒';
        } else {
          row += '░';
        }
      }
      if (board[i][j].special === 'start') {
        row += '╬';
      }
      if (board[i][j].special === 'gold' || board[i][j].special === 'coal') {
        row += '▓';
      }
      if (board[i][j].cardType > -1) {
        row += '┼';
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

canCardBeBuilt = (board, card, i, j) => {
  if (board[i][j].cardType !== -1 || board[i][j].buildable !== true || board[i][j].accessible !== true || card.id >= 40) {
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

refreshAccess = (board) => {
  markPossiblePoints(board);
  markAccessiblity(board);
}

const boardPiece = {
  cardType: -1,
  flipped: false,
  special: null,
  buildable: false,
};

buildCard = (board, card, i, j) => {
  board[i][j] = {
    ...card,
    special: null,
    cardType: card.type,
    accessible: false,
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

let v = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
let x = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
let y = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
let xx = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];
let yy = [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()];

let bestMove = null;

let z = 1;
let diggersVictory = false;

isDiggersVictory = (board) => (board[3][9].accessible === true);

while (shuffled.length || yy.length) {
  console.log('TURN ' + z);

  console.log('Digger 1');
  bestMove = calculateMove(v, false, board);
  if (bestMove) {
    buildCard(board, bestMove.flipped ? flipCard(v[bestMove.cardIndex]) : v[bestMove.cardIndex], bestMove.i, bestMove.j);
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
  if (bestMove) {
    buildCard(board, bestMove.flipped ? flipCard(x[bestMove.cardIndex]) : x[bestMove.cardIndex], bestMove.i, bestMove.j);
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
  if (bestMove) {
    console.log(bestMove.value);
    buildCard(board, bestMove.flipped ? flipCard(y[bestMove.cardIndex]) : y[bestMove.cardIndex], bestMove.i, bestMove.j);
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
  if (bestMove) {
    buildCard(board, bestMove.flipped ? flipCard(xx[bestMove.cardIndex]) : xx[bestMove.cardIndex], bestMove.i, bestMove.j);
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
  console.log('Saboteur 2');
  bestMove = calculateMove(yy, true, board);
  if (bestMove) {
    buildCard(board, bestMove.flipped ? flipCard(yy[bestMove.cardIndex]) : yy[bestMove.cardIndex], bestMove.i, bestMove.j);
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
