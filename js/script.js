/*
 * Author: Andranik Sargsyan
 * 
 * Description: This is a simple Tic Tac Toe game.
 * The fun part of this code is that it can generate
 * a Tic Tac Toe of any size (any number of rows and columns)
 * and can render it with any width and height of the canvas. 
 * Try it out. It's fun :)
 */

// Change DEFAULT_BOARD_SIZE to make other versions of the game
var DEFAULT_BOARD_SIZE = 3; 
// Change DEFAULT_CANVAS_SIZE to render the game by different sizes (px)
var DEFAULT_CANVAS_SIZE = 450; 

function Game(boardSize, canvas) {
	// Board size represents the number of rows and columns in the game
	this.boardSize = boardSize;
	// Canvas is the place where the game components will be rendered
	this.canvas = canvas
	this.initialize();
}

// Initializes the board matrix
Game.prototype.initialize = function() {
	// Board is a 2 dimensional matrix, which holds the game state
	this.board = [];
	this.currentPlayer = "x";
	this.started = false;
	this.isOver = false;
	this.isDraw = false;
	this.status = document.getElementById("status");

	for(var i = 0; i < this.boardSize; i++) {

		var row = [];

		for(var j = 0; j < this.boardSize; j++) {
			row.push(" ");
		}

		this.board.push(row);
	}
}

Game.prototype.render = function(size) {
	// Cleaning the canvas
	this.canvas.innerHTML= "";
	// Styling the canvas
	this.canvas.style.width = size + "px";
	this.canvas.style.height = size + "px";
	this.canvas.style.border = "1px solid black";

	// Rendering the board
	for (var row in this.board) {
		for (var column in this.board[row]) {

			if(this.board[row][column] == " ") {
				var cellSize = parseInt(this.canvas.style.width)/this.boardSize;
				var cell = new Cell(this, cellSize, row, column);
			}
		}
		var newLine = document.createElement("div");
		newLine.style.clear = "both";
		this.canvas.appendChild(newLine);
	}
}

Game.prototype.start = function() {
	this.started = true;
	this.status.innerHTML = '<img src="images/' + this.currentPlayer + '.png" style="width: 45px; vertical-align:middle;">' + ' starts';
}

Game.prototype.restart = function() {
	this.initialize();
	this.render();
	this.start();
}

Game.prototype.togglePlayer = function() {

	if(this.currentPlayer == "x") {
		this.currentPlayer = "o";
	} else {
		this.currentPlayer = "x";
	}

	this.status.innerHTML = '<img src="images/' + this.currentPlayer + '.png" style="width: 45px; vertical-align:middle;">' + "'s turn";
}

Game.prototype.update = function(cell, row, column) {
	if(this.board[row][column] == " ") {

		if(this.currentPlayer == "x") {
			cell.className += " cross";
			this.board[row][column] = "x";

		} else {
			cell.className += " circle";
			this.board[row][column] = "o";
		}

		if(this.checkEnd()) {
			
			if(!this.isDraw) {
				this.status.innerHTML = 'Game over. <img src="images/' + this.currentPlayer + '.png" style="width: 45px; vertical-align:middle;"> won!!!';
			} else {
				this.status.innerHTML = "The game is over. Nobody won.";
			}

			this.isOver = true;
		} else {
			this.togglePlayer();
		}
	}
}

Game.prototype.checkEnd = function() {
	// Checking rows
	for (var row in this.board) {
		for (var column in this.board[row]) {
			if(this.board[row][column] != this.currentPlayer) {
				break;
			} else {
				if (column == (this.board[row].length - 1)) {
					return true;
				}
			}
		}
	}

	// Checking columns
	for (var column in this.board) {
		for (var row in this.board) {
			if(this.board[row][column] != this.currentPlayer) {
				break;
			} else {
				if (row == (this.board[row].length - 1)) {
					return true;
				}
			}
		}
	}

	// Checking the diagonal
	for (var row in this.board) {
		if(this.board[row][row] != this.currentPlayer) {
			break;
		} else {
			if (row == (this.board[row].length - 1)) {
				return true;
			}
		}
	}

	// Checking the other diagonal
	for (var row in this.board) {
		if(this.board[row][this.board[row].length - row -1] != this.currentPlayer) {
			break;
		} else {
			if (row == (this.board[row].length - 1)) {
				return true;
			}
		}
	}

	// Makes sure that there is a move to take
	for (var column in this.board) {
		for (var row in this.board) {
			if(this.board[row][column] == " ") {
				return false;
			}
		}
	}

	// If none of above return a result, means that we have a draw
	this.isDraw = true;
	return true;
}

// Cell is the smallest element of the game
function Cell(game, cellSize, row, column) {
	this.game = game;
	this.cell = document.createElement("div");
	this.cellSize = cellSize;
	this.row = row;
	this.column = column;
	this.render();
}

Cell.prototype.render = function() {
	// Styling the cells
	this.cell.style.border = "1px solid black";
	this.cell.style.width = (this.cellSize - 2) + "px";
	this.cell.style.height = (this.cellSize - 2) + "px";
	this.cell.style.float = "left";
	this.cell.className = "cell";

	// Appending our brand-new cell on the canvas
	this.game.canvas.appendChild(this.cell);
	// Adding click listener on the cell
	this.cell.addEventListener("click", this.onClick.bind(this, this.game));
}

// Click handler for the cells
Cell.prototype.onClick = function(game) {
	if(!game.isOver && game.started) {
		game.update(this.cell, this.row, this.column);
	}
}

// Defining the canvas
var canvas = document.getElementById("canvas");
// Making an instance of the game
var game = new Game(DEFAULT_BOARD_SIZE, canvas);
// Rendering in DEFAULT_CANVAS_SIZE
game.render(DEFAULT_CANVAS_SIZE);

var startButton = document.getElementById("start");
start.addEventListener("click", function() {
	if(this.innerHTML == "Start") {
		game.start();
		this.innerHTML = "Restart";
	} else {
		game.restart();
	}
});