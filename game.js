const { deck } = require('./deck');
const { playersConfigs } = require('./playersConfigs');
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
  targets,
} = require('./utils');

let board = prepareBoard();

const shuffled = shuffle([...deck]);

const playersNo = 5;
const roles = shuffle(playersConfigs[playersNo]); 
const karmas = [];

const playersData = [];
for (let i = 0; i < playersNo; ++i) {
  playersData.push({
    id: i,
    role: roles[i],
    pickaxe: true,
    truck: true,
    lamp: true,
    cards: [shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop(), shuffled.pop()],
    karmas: [...karmas],
    claims: getClaimsArray(playersNo),
    targetsKnowledge: [0.333, 0.333, 0.333]
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

while (playersData[playersNo - 1].cards.length > 0) {
  console.log('TURN ' + turnNo++);
  for (let i = 0; i < playersNo; ++i) {
    console.log(playersData[i].role === 1 ? 'Saboteur' : 'Digger');
    const move = calculateMove(playersData[i].cards, playersData[i].role === 1, board);
    if (move.operation === 'build') {
      console.log('BUILD');
      board = cloneBoard(move.board);
    } else if (move.operation === 'rockfall') {
      console.log('ROCKFALL');
      board = cloneBoard(move.board);
    } else if (move.operation === 'throwaway') {
      console.log('THROWAWAY');
    }

    checkTargets(board, move.i, move.j);
    graphBoard(board);

    playersData[i].cards.splice(move.cardIndex, 1);
    if (shuffled.length > 0) {
      playersData[i].cards.push(shuffled.pop());
    }
  }
}

console.log('SABOTEURS WIN');
process.exit(0);
