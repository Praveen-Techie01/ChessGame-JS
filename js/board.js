let currentTeam;
let currentTeamText;

let chessCanvas;
let chessCanvasX;
let chessCanvasY;
let chessCtx;

let pieceType;
let team;

let EMPTY = -1;
let INVALID = 0;

const BOARD_HEIGHT = 8;
const BOARD_WIDTH = 8;

const WHITE = 0;
const BLACK = 1;

const TILE_SIZE = 50;

const WHITE_TILE_COLOR = "rgb(255, 228, 196)";
const BLACK_TILE_COLOR = "rgb(206, 162, 128)";
const HIGHLIGHT_COLOR = "rgb(75, 175, 75)";


const PAWN = 0;
const KNIGHT = 1;
const BISHOP = 2;
const ROOK = 3;
const QUEEN = 4;
const KING = 5;

const piecesCharacters = {
    0: '♙',
    1: '♘',
    2: '♗',
    3: '♖',
    4: '♕',
    5: '♔'
};


document.addEventListener("DOMContentLoaded", onload)

function onload() {

    currentTeamText = document.getElementById("currentTeamText");

    chessCanvas = document.getElementById("chessCanvas");
    chessCtx = chessCanvas.getContext("2d");

    chessCanvas.addEventListener("click", onClick);

    startGame();

}

function startGame() {
    board = new Board();

    curX = -1;
    curY = -1;

    currentTeam = WHITE;
    currentTeamText.textContent = "White's Turn !!";

    repaintBoard();
}

function repaintBoard() {
    drawBoard();
}

function drawBoard() {
    chessCtx.fillStyle = WHITE_TILE_COLOR;
    chessCtx.fillRect(0, 0, BOARD_WIDTH * TILE_SIZE, BOARD_HEIGHT * TILE_SIZE); // (0,0 8*50,8*50)
    // (x - axis, y - axis, width, height)


    for (let i = 0; i < BOARD_HEIGHT; i++) {
        for (let j = 0; j < BOARD_WIDTH; j++) {
            if ((i + j) % 2 === 1) {
                drawTile(j, i, BLACK_TILE_COLOR);
            }
        }
    }
}

function drawTile(x, y, fillStyle) {
    chessCtx.fillStyle = fillStyle;
    chessCtx.fillRect(TILE_SIZE * x, TILE_SIZE * y, TILE_SIZE, TILE_SIZE); //(50*x,50*y,50,50)
}

function onClick(event) {
    const chessCanvasX = chessCanvas.getBoundingClientRect().left;
    const chessCanvasY = chessCanvas.getBoundingClientRect().top;
    // console.log(chessCanvasX, chessCanvasY);

    let x = Math.floor((event.clientX - chessCanvasX) / TILE_SIZE);
    // console.log(event.clientX, chessCanvasX, TILE_SIZE, x);

    let y = Math.floor((event.clientY - chessCanvasY) / TILE_SIZE);
    // console.log(event.clientY, chessCanvasY, TILE_SIZE, y);
}

class Board {
    constructor() {
        this.tiles = [];
        this.tiles.push([
            new Tile(ROOK, BLACK),
            new Tile(KNIGHT, BLACK),
            new Tile(BISHOP, BLACK),
            new Tile(QUEEN, BLACK),
            new Tile(KING, BLACK),
            new Tile(BISHOP, BLACK),
            new Tile(KNIGHT, BLACK),
            new Tile(ROOK, BLACK),
        ]);

        this.tiles.push([
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK),
            new Tile(PAWN, BLACK)
        ]);

        for (let i = 0; i < 4; i++) {
            this.tiles.push([
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
                new Tile(EMPTY, EMPTY),
            ]);
        }

        this.tiles.push([
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE),
            new Tile(PAWN, WHITE)
        ]);

        this.tiles.push([
            new Tile(ROOK, WHITE),
            new Tile(KNIGHT, WHITE),
            new Tile(BISHOP, WHITE),
            new Tile(QUEEN, WHITE),
            new Tile(KING, WHITE),
            new Tile(BISHOP, WHITE),
            new Tile(KNIGHT, WHITE),
            new Tile(ROOK, WHITE)
        ]);

        this.validMoves = [];
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            this.validMoves.push([
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID,
                INVALID
            ]);
        }
        console.log(this.tiles);
        console.log(this.validMoves);


    }
    resetValidMoves() {
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            for (let j = 0; j < BOARD_WIDTH; j++) {
                this.validMoves[i][j] = INVALID;
            }
        }
    }

}

class Tile {
    constructor() {
        this.pieceType = pieceType;
        this.team = team;
    }
}