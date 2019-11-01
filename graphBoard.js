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
      if ((board[i][j].special === 'gold' || board[i][j].special === 'coal') && !board[i][j].accessible) {
        row += '▓';
      }
      if (board[i][j].special === 'gold' && board[i][j].accessible) {
        row += '√';
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

module.exports = { graphBoard };
