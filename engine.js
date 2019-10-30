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

const isGoldRevealed = (board) => board[3][9].accessible === true;

const calculateMove = (cardsInHand, isSaboteur, board) => {
	let outcomes = [];
	let clone;
	let value;
	let flipped;
	for (let a = 0; a < cardsInHand.length; ++a) {
		flipped = cardsInHand[a].flippable ? flipCard({...cardsInHand[a]}) : null;
	  for (let i = 0; i < board.length; ++i) {
	    for (let j = 0; j < board[i].length; ++j) {
	      if (canCardBeBuilt(board, cardsInHand[a], i, j)) {
	        clone = cloneBoard(board);
	        buildCard(clone, cardsInHand[a], i, j);
	        if (isGoldRevealed(board)) {
	        	value = 0
	        } else {
	        	value = evaluateBoard(clone, 0, 1, 0);
	        	// value = evaluateBoard(clone, 0.333, 0.333, 0.333);
	        }
	        outcomes.push({
	          value,
	          cardIndex: a,
	          flipped: false,
	          i,
	          j,
	        })
	      }

	      if (flipped) {
	      	if (canCardBeBuilt(board, flipped, i, j)) {
	        clone = cloneBoard(board);
	        buildCard(clone, flipped, i, j);
	        if (isGoldRevealed(board)) {
	        	value = 0
	        } else {
	        	value = evaluateBoard(clone, 0, 1, 0);
	        	// value = evaluateBoard(clone, 0.333, 0.333, 0.333);
	        }
	        outcomes.push({
	          value,
	          cardIndex: a,
	          flipped: true,
	          i,
	          j,
	        })
	      }
	      }

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

const cloneBoard = (board) => {
  const copyBoard = [];
  for (let i = 0; i < board.length; ++i) {
    copyBoard[i] = [...board[i]];
  }
  return copyBoard;
}

const evaluateBoard = (board, goldTopProb, goldMiddleProb, goldBottomProb) => {
	const copyBoard = cloneBoard(board);

	const topArray = [];
	const middleArray = [];
	const bottomArray = [];

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

module.exports = { evaluateBoard, cloneBoard, calculateMove };

