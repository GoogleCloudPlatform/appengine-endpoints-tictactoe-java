// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview
 * Provides methods for the TicTacToe sample UI and interaction with the
 * TicTacToe API.
 *
 * @author danielholevoet@google.com (Dan Holevoet)
 */

/** google global namespace for Google projects. */
var google = google || {};

/** devrel namespace for Google Developer Relations projects. */
google.devrel = google.devrel || {};

/** samples namespace for DevRel sample code. */
google.devrel.samples = google.devrel.samples || {};

/** TicTacToe namespace for this sample. */
google.devrel.samples.ttt = google.devrel.samples.ttt || {};

/**
 * Status for an unfinished game.
 * @type {number}
 */
google.devrel.samples.ttt.NOT_DONE = 0;

/**
 * Status for a victory.
 * @type {number}
 */
google.devrel.samples.ttt.WON = 1;

/**
 * Status for a loss.
 * @type {number}
 */
google.devrel.samples.ttt.LOST = 2;

/**
 * Status for a tie.
 * @type {number}
 */
google.devrel.samples.ttt.TIE = 3;

/**
 * Strings for each numerical status.
 * @type {Array.number}
 */
google.devrel.samples.ttt.STATUS_STRINGS = [
    'NOT_DONE',
    'WON',
    'LOST',
    'TIE'
];

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
google.devrel.samples.ttt.signedIn = false;

/**
 * Whether or not the game is waiting for a user's move.
 * @type {boolean}
 */
google.devrel.samples.ttt.waitingForMove = true;

/**
 * Signs the user out.
 */
google.devrel.samples.ttt.signout = function() {
  document.getElementById('signinButtonContainer').classList.add('visible');
  document.getElementById('signedInStatus').classList.remove('visible');
  google.devrel.samples.ttt.setBoardEnablement(false);
  google.devrel.samples.ttt.signedIn = false;
}

/**
 * Handles a square click.
 * @param {MouseEvent} e Mouse click event.
 */
google.devrel.samples.ttt.clickSquare = function(e) {
  if (google.devrel.samples.ttt.waitingForMove) {
    var button = e.target;
    button.innerHTML = 'X';
    button.removeEventListener('click', google.devrel.samples.ttt.clickSquare);
    google.devrel.samples.ttt.waitingForMove = false;

    var boardString = google.devrel.samples.ttt.getBoardString();
    var status = google.devrel.samples.ttt.checkForVictory(boardString);
    if (status == google.devrel.samples.ttt.NOT_DONE) {
      google.devrel.samples.ttt.getComputerMove(boardString);
    } else {
      google.devrel.samples.ttt.handleFinish(status);
    }
  }
};

/**
 * Resets the game board.
 */
google.devrel.samples.ttt.resetGame = function() {
  var buttons = document.querySelectorAll('td');
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.removeEventListener('click', google.devrel.samples.ttt.clickSquare);
    button.addEventListener('click', google.devrel.samples.ttt.clickSquare);
    button.innerHTML = '-';
  }
  document.getElementById('victory').innerHTML = '';
  google.devrel.samples.ttt.waitingForMove = true;
};

/**
 * Gets the computer's move.
 * @param {string} boardString Current state of the board.
 */
google.devrel.samples.ttt.getComputerMove = function(boardString) {
  gapi.client.tictactoe.board.getmove({'state': boardString}).execute(
      function(resp) {
    google.devrel.samples.ttt.setBoardFilling(resp.state);
    var status = google.devrel.samples.ttt.checkForVictory(resp.state);
    if (status != google.devrel.samples.ttt.NOT_DONE) {
      google.devrel.samples.ttt.handleFinish(status);
    } else {
      google.devrel.samples.ttt.waitingForMove = true;
    }
  });
};

/**
 * Sends the result of the game to the server.
 * @param {number} status Result of the game.
 */
google.devrel.samples.ttt.sendResultToServer = function(status) {
  gapi.client.tictactoe.scores.insert({'outcome':
      google.devrel.samples.ttt.STATUS_STRINGS[status]}).execute(
      function(resp) {
    google.devrel.samples.ttt.queryScores();
  });
};

/**
 * Queries for results of previous games.
 */
google.devrel.samples.ttt.queryScores = function() {
  gapi.client.tictactoe.scores.list().execute(function(resp) {
    var history = document.getElementById('gameHistory');
    history.innerHTML = '';
    if (resp.items) {
      for (var i = 0; i < resp.items.length; i++) {
        var score = document.createElement('li');
        score.innerHTML = resp.items[i].outcome;
        history.appendChild(score);
      }
    }
  });
};

/**
 * Shows or hides the board and game elements.
 * @param {boolean} state Whether to show or hide the board elements.
 */
google.devrel.samples.ttt.setBoardEnablement = function(state) {
  if (!state) {
    document.getElementById('board').classList.add('hidden');
    document.getElementById('gameHistoryWrapper').classList.add('hidden');
    document.getElementById('warning').classList.remove('hidden');
  } else {
    document.getElementById('board').classList.remove('hidden');
    document.getElementById('gameHistoryWrapper').classList.remove('hidden');
    document.getElementById('warning').classList.add('hidden');
  }
};

/**
 * Sets the filling of the squares of the board.
 * @param {string} boardString Current state of the board.
 */
google.devrel.samples.ttt.setBoardFilling = function(boardString) {
  var buttons = document.querySelectorAll('td');
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.innerHTML = boardString.charAt(i);
  }
};

/**
 * Checks for a victory condition.
 * @param {string} boardString Current state of the board.
 * @return {number} Status code for the victory state.
 */
google.devrel.samples.ttt.checkForVictory = function(boardString) {
  var status = google.devrel.samples.ttt.NOT_DONE;

  // Checks rows and columns.
  for (var i = 0; i < 3; i++) {
    var rowString = google.devrel.samples.ttt.getStringsAtPositions(
        boardString, i*3, (i*3)+1, (i*3)+2);
    status |= google.devrel.samples.ttt.checkSectionVictory(rowString);

    var colString = google.devrel.samples.ttt.getStringsAtPositions(
      boardString, i, i+3, i+6);
    status |= google.devrel.samples.ttt.checkSectionVictory(colString);
  }

  // Check top-left to bottom-right.
  var diagonal = google.devrel.samples.ttt.getStringsAtPositions(boardString,
      0, 4, 8);
  status |= google.devrel.samples.ttt.checkSectionVictory(diagonal);

  // Check top-right to bottom-left.
  diagonal = google.devrel.samples.ttt.getStringsAtPositions(boardString, 2,
      4, 6);
  status |= google.devrel.samples.ttt.checkSectionVictory(diagonal);

  if (status == google.devrel.samples.ttt.NOT_DONE) {
    if (boardString.indexOf('-') == -1) {
      return google.devrel.samples.ttt.TIE;
    }
  }

  return status;
};

/**
 * Checks whether a set of three squares are identical.
 * @param {string} section Set of three squares to check.
 * @return {number} Status code for the victory state.
 */
google.devrel.samples.ttt.checkSectionVictory = function(section) {
  var a = section.charAt(0);
  var b = section.charAt(1);
  var c = section.charAt(2);
  if (a == b && a == c) {
    if (a == 'X') {
      return google.devrel.samples.ttt.WON;
    } else if (a == 'O') {
      return google.devrel.samples.ttt.LOST
    }
  }
  return google.devrel.samples.ttt.NOT_DONE;
};

/**
 * Handles the end of the game.
 * @param {number} status Status code for the victory state.
 */
google.devrel.samples.ttt.handleFinish = function(status) {
  var victory = document.getElementById('victory');
  if (status == google.devrel.samples.ttt.WON) {
    victory.innerHTML = 'You win!';
  } else if (status == google.devrel.samples.ttt.LOST) {
    victory.innerHTML = 'You lost!';
  } else {
    victory.innerHTML = 'You tied!';
  }
  google.devrel.samples.ttt.sendResultToServer(status);
};

/**
 * Gets the current representation of the board.
 * @return {string} Current state of the board.
 */
google.devrel.samples.ttt.getBoardString = function() {
  var boardStrings = [];
  var buttons = document.querySelectorAll('td');
  for (var i = 0; i < buttons.length; i++) {
    boardStrings.push(buttons[i].innerHTML);
  }
  return boardStrings.join('');
};

/**
 * Gets the values of the board at the given positions.
 * @param {string} boardString Current state of the board.
 * @param {number} first First element to retrieve.
 * @param {number} second Second element to retrieve.
 * @param {number} third Third element to retrieve.
 */
google.devrel.samples.ttt.getStringsAtPositions = function(boardString, first,
    second, third) {
  return [boardString.charAt(first),
          boardString.charAt(second),
          boardString.charAt(third)].join('');
};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 * @param {string} tokenEmail The email parsed from the auth/ID token.
 */
google.devrel.samples.ttt.init = function(apiRoot, tokenEmail) {
  // Loads the Tic Tac Toe API asynchronously, and triggers login
  // in the UI when loading has completed.
  var callback = function() {
    google.devrel.samples.ttt.signedIn = true;
    document.getElementById('userLabel').innerHTML = tokenEmail;
    google.devrel.samples.ttt.setBoardEnablement(true);
    google.devrel.samples.ttt.queryScores();
  }
  gapi.client.load('tictactoe', 'v1', callback, apiRoot);

  var buttons = document.querySelectorAll('td');
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.addEventListener('click', google.devrel.samples.ttt.clickSquare);
  }

  var reset = document.querySelector('#restartButton');
  reset.addEventListener('click', google.devrel.samples.ttt.resetGame);
};
