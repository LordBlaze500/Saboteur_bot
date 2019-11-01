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
  calculateTargetsPropabilities,
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

const addKnowledge = (knowledge, target, value) => {
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

const useMap = (board, knowledge) => {
  if (knowledge[1] === 0) {
    knowledge = addKnowledge(knowledge, 1, board[5][10].special === 'gold' ? 1 : -1);
  } else if (knowledge[0] === 0) {
    knowledge = addKnowledge(knowledge, 0, board[3][10].special === 'gold' ? 1 : -1);
  } else {
    knowledge = addKnowledge(knowledge, 2, board[7][10].special === 'gold' ? 1 : -1);
  }
  return knowledge;
}

let move = null;
let mapIndex = null;

while (playersData[playersNo - 1].cards.length > 0) {
  console.log('TURN ' + turnNo++);
  for (let i = 0; i < playersNo; ++i) {
    console.log(playersData[i].role === 1 ? 'Saboteur' : 'Digger');

    mapIndex = playersData[i].cards.findIndex((el) => el.special === 'map');
    if (mapIndex !== -1) {

      if (isGoldKnown(playersData[i].targetsKnowledge)) {
        console.log('THROWAWAY (map)');
        move = {
          cardIndex: mapIndex,
        };
      } else {
        console.log('USE MAP');
        console.log(playersData[i].targetsKnowledge);
        playersData[i].targetsKnowledge = useMap(board, playersData[i].targetsKnowledge);
        console.log(playersData[i].targetsKnowledge);
        move = {
          cardIndex: mapIndex,
        };
      }
    } else {
      move = calculateMove(playersData[i].cards, playersData[i].role === 1, board, calculateTargetsPropabilities(playersData[i].targetsKnowledge));
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
    }
    
    graphBoard(board);

    playersData[i].cards.splice(move.cardIndex, 1);
    if (shuffled.length > 0) {
      playersData[i].cards.push(shuffled.pop());
    }
  }
}

console.log('SABOTEURS WIN');
process.exit(0);
