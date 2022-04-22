const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;

const TILE_SIZE = 50;
const WHITE_TILE_COLOR = "rgb(105, 240, 245)";
const BLACK_TILE_COLOR = "rgb(19, 117, 133)";
const HIGHLIGHT_COLOR = "rgb(75, 175, 75)";
const CAPTURE_COLOR = "rgb(255, 0, 0)";
const WHITE = 0;
const BLACK = 1;

const EMPTY = -1;
const SOLDIER = 0;
const HORSE = 1;
const BISHOP = 2;
const CASTLE = 3;
const QUEEN = 4;
const KING = 5;
let BlackKingX = 4;
let WhiteKingX = 4;
let BlackKingY = 0;
let WhiteKingY = 7;

let FLAG1;
const INVALID = 0;
const VALID = 1;
const VALID_CAPTURE = 2;
let checking;
let check;
let movable = [];
let King_Pos;


const piecesCharacters = {
    0: '♙',
    1: '♘',
    2: '♗',
    3: '♖',
    4: '♕',
    5: '♔'
};

let chessCanvas;
let chessCtx;
let currentTeamText;
let board;
let currentTeam;

let curX;
let curY;
let x, y;

let whiteWins;
let blackWins;

document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    chessCanvas = document.getElementById("chessCanvas");
    chessCtx = chessCanvas.getContext("2d");
    chessCanvas.addEventListener("click", onClick);

    currentTeamText = document.getElementById("currentTeamText");

    whiteWins = 0;
    blackWins = 0;

    startGame();
}

function startGame() {
    board = new Board();
    curX = -1;
    curY = -1;

    currentTeam = WHITE;
    currentTeamText.textContent = "WHITE'S TURN !!";

    drawBoard();
    checkPossiblePlays();
    drawPieces();
    updateWinner();
}

function onClick(event) {
    let chessCanvasX = chessCanvas.getBoundingClientRect().left;
    let chessCanvasY = chessCanvas.getBoundingClientRect().top;

    x = Math.floor((event.clientX - chessCanvasX) / TILE_SIZE);
    y = Math.floor((event.clientY - chessCanvasY) / TILE_SIZE);

    if (checkValidMovement(x, y) === true) {
        if (checkValidCapture(x, y) === true) {
            if (board.tiles[y][x].pieceType === KING) {
                if (currentTeam === WHITE) whiteWins++;
                else blackWins++;
                highlightBox(x, y, CAPTURE_COLOR);
                startGame();
            }
        }
        moveSelectedPiece(x, y);
        checkCheckmate(x, y);
        movable = [];
    } else {
        curX = x;
        curY = y;
    }
    if (checking) {
        checking = false;
        drawBoard();
        drawPieces();
        changeCurrentTeam();
        return;

    } else {
        drawBoard();
        checkPossiblePlays();
        drawPieces();
    }
}

function checkCheckmate() {
    checking = true;
    curX = x;
    curY = y;
    checkPossiblePlays();

    King_Pos = [
        [BlackKingX, BlackKingY],
        [WhiteKingX, WhiteKingY],
    ]
    var flag = 0;
    var have = 0;
    for (let i = 0; i < King_Pos.length; i++) {
        flag = 0;
        for (let j = 0; j < movable.length; j++) {
            flag = 0;
            if (King_Pos[i].length == movable[j].length) {
                for (let k = 0; k < King_Pos[i].length; k++) {
                    if (King_Pos[i][k] == movable[j][k]) {
                        flag++;
                    }
                }
                if (flag == King_Pos[i].length) have++;
            }
        }
    }
    if (have) {
        alert("CHECKMATE !!!");
        board.resetValidMoves();
        FLAG1 = false;
    } else {
        board.resetValidMoves();
        FLAG1 = false;
    }
}

function checkPossiblePlays() {

    if (curX < 0 || curY < 0) return;

    let tile = board.tiles[curY][curX];
    if (checking) {
        console.log("Check 1");
    } else {
        if (tile.team === EMPTY || tile.team !== currentTeam) return;
        drawTile(curX, curY, HIGHLIGHT_COLOR);
    }
    board.resetValidMoves();

    if (tile.pieceType === SOLDIER) checkPossiblePlaysSOLDIER(curX, curY);
    else if (tile.pieceType === HORSE) checkPossiblePlaysHORSE(curX, curY);
    else if (tile.pieceType === BISHOP) checkPossiblePlaysBishop(curX, curY);
    else if (tile.pieceType === CASTLE) checkPossiblePlaysCASTLE(curX, curY);
    else if (tile.pieceType === QUEEN) checkPossiblePlaysQUEEN(curX, curY);
    else if (tile.pieceType === KING) checkPossiblePlaysKING(curX, curY);
}

function checkPossiblePlaysSOLDIER(curX, curY) {
    let direction;

    if (currentTeam === WHITE) direction = -1;
    else direction = 1;

    if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

    checkPossibleMove(curX, curY + direction, direction);

    if (curY === 1 || curY === 6) {
        checkPossibleMove(curX, curY + 2 * direction);
    }

    if (curX - 1 >= 0) checkPossibleCapture(curX - 1, curY + direction);

    if (curX + 1 <= BOARD_WIDTH - 1) checkPossibleCapture(curX + 1, curY + direction);
}



function checkPossiblePlaysHORSE(curX, curY) {
    if (curX - 2 >= 0) {
        if (curY - 1 >= 0) checkPossiblePlay(curX - 2, curY - 1);

        if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 2, curY + 1);
    }

    if (curX - 1 >= 0) {
        if (curY - 2 >= 0) checkPossiblePlay(curX - 1, curY - 2);

        if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX - 1, curY + 2);
    }

    if (curX + 1 <= BOARD_WIDTH - 1) {
        if (curY - 2 >= 0) checkPossiblePlay(curX + 1, curY - 2);

        if (curY + 2 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 1, curY + 2);
    }

    if (curX + 2 <= BOARD_WIDTH - 1) {
        if (curY - 1 >= 0) checkPossiblePlay(curX + 2, curY - 1);

        if (curY + 1 <= BOARD_HEIGHT - 1) checkPossiblePlay(curX + 2, curY + 1);
    }
}

function checkPossiblePlaysCASTLE(curX, curY) {
    for (let i = 1; curY - i >= 0; i++) {
        if (checkPossiblePlay(curX, curY - i)) break;
    }

    for (let i = 1; curX + i <= BOARD_WIDTH - 1; i++) {
        if (checkPossiblePlay(curX + i, curY)) break;
    }

    for (let i = 1; curY + i <= BOARD_HEIGHT - 1; i++) {
        if (checkPossiblePlay(curX, curY + i)) break;
    }

    for (let i = 1; curX - i >= 0; i++) {
        if (checkPossiblePlay(curX - i, curY)) break;
    }
}

function checkPossiblePlaysBishop(curX, curY) {

    for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY - i >= 0; i++) {
        if (checkPossiblePlay(curX + i, curY - i)) break;
    }

    for (let i = 1; curX + i <= BOARD_WIDTH - 1 && curY + i <= BOARD_HEIGHT - 1; i++) {
        if (checkPossiblePlay(curX + i, curY + i)) break;
    }

    for (let i = 1; curX - i >= 0 && curY + i <= BOARD_HEIGHT - 1; i++) {
        if (checkPossiblePlay(curX - i, curY + i)) break;
    }

    for (let i = 1; curX - i >= 0 && curY - i >= 0; i++) {
        if (checkPossiblePlay(curX - i, curY - i)) break;
    }
}

function checkPossiblePlaysQUEEN(curX, curY) {
    checkPossiblePlaysBishop(curX, curY);
    checkPossiblePlaysCASTLE(curX, curY);
}

function checkPossiblePlaysKING(curX, curY) {
    for (let i = -1; i <= 1; i++) {
        if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

        for (let j = -1; j <= 1; j++) {
            if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
            if (i == 0 && j == 0) continue;

            checkPossiblePlay(curX + j, curY + i);
        }
    }
}

function checkPossiblePlay(x, y) {
    if (checkPossibleCapture(x, y)) return true;

    return !checkPossibleMove(x, y);
}

function checkPossibleMove(x, y) {
    try {
        if (board.tiles[y][x].team != EMPTY) return false;
        board.validMoves[y][x] = VALID;
    } catch (e) {
        if (checking) {
            console.log("Check 2");
        } else {
            FLAG1 = true;
        }

    }
    if (checking) {
        movable.push([x, y]);
        return true;
    } else {
        highlightBox(x, y, HIGHLIGHT_COLOR);
        return true;
    }

}

function checkPossibleCapture(x, y) {
    if (board.tiles[y][x].team !== getOppositeTeam(currentTeam)) return false;

    board.validMoves[y][x] = VALID_CAPTURE;

    if (checking) {
        movable.push([x, y]);
        return true;
    } else {
        highlightBox(x, y, CAPTURE_COLOR);
        return true;
    }
}

function checkValidMovement(x, y) {
    if (board.validMoves[y][x] === VALID || board.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
}

function checkValidCapture(x, y) {
    if (board.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
}

function moveSelectedPiece(x, y) {

    if (FLAG1 && whiteWins == 0 && blackWins == 0) {
        let inputchoice;
        while (true) {
            inputchoice = window.prompt("PLEASE SELECT THE NUMBER BELOW TO YOUR PIECE ACCORDINGLY : \n 1 : For Horse \n 2 : For Bishop \n 3 : For Rook \n 4 : For Queen ");
            inputchoice = parseInt(inputchoice);
            if (inputchoice > 3 || inputchoice < 1) {
                continue;
            } else {
                switch (inputchoice) {
                    case 1:
                        {
                            board.tiles[y][x].pieceType = HORSE;
                            FLAG1 = false;
                            break;
                        }

                    case 2:
                        {
                            board.tiles[y][x].pieceType = BISHOP;
                            FLAG1 = false;
                            break;
                        }

                    case 3:
                        {
                            board.tiles[y][x].pieceType = CASTLE;
                            FLAG1 = false;
                            break;
                        }
                    case 4:
                        {
                            board.tiles[y][x].pieceType = QUEEN;
                            FLAG1 = false;
                            break;
                        }
                    default:
                        {
                            board.tiles[y][x].pieceType = SOLDIER;
                            FLAG1 = false;
                            break;
                        }
                }
                break;
            }
        }
    } else {
        board.tiles[y][x].pieceType = board.tiles[curY][curX].pieceType;

    }
    board.tiles[y][x].team = board.tiles[curY][curX].team;

    if (board.tiles[y][x].team == BLACK && board.tiles[y][x].pieceType == KING) {
        BlackKingX = x;
        BlackKingY = y;
    }
    if (board.tiles[y][x].team == WHITE && board.tiles[y][x].pieceType == KING) {
        WhiteKingX = x;
        WhiteKingY = y;
    }
    board.tiles[curY][curX].pieceType = EMPTY;
    board.tiles[curY][curX].team = EMPTY;
    curX = -1;
    curY = -1;
    board.resetValidMoves();
}

function changeCurrentTeam() {
    if (currentTeam === WHITE) {
        currentTeamText.textContent = "BLACK'S TURN !!";
        currentTeam = BLACK;
    } else {
        currentTeamText.textContent = "WHITE'S TURN !!";
        currentTeam = WHITE;
    }
}

function drawBoard() {
    chessCtx.fillStyle = WHITE_TILE_COLOR;
    chessCtx.fillRect(0, 0, BOARD_WIDTH * TILE_SIZE, BOARD_HEIGHT * TILE_SIZE);

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

function drawPieces() {
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        for (let j = 0; j < BOARD_WIDTH; j++) {
            if (board.tiles[i][j].team === EMPTY) continue;

            if (board.tiles[i][j].team === WHITE) {
                chessCtx.fillStyle = "#ffffff";
            } else {
                chessCtx.fillStyle = "#000000";
            }

            chessCtx.font = "38px Arial";
            let pieceType = board.tiles[i][j].pieceType;
            chessCtx.fillText(piecesCharacters[pieceType], TILE_SIZE * (j + 1 / 8), TILE_SIZE * (i + 4 / 5));
        }
    }
}

function updateWinner() {
    if (whiteWins) {
        window.alert("WHITE HAS BEEN WON !!!!");
        window.location.reload();
    }
    if (blackWins) {
        window.alert("BLACK HAS BEEN WON !!!!");
        window.location.reload();

    }

}

function getOppositeTeam(team) {
    if (team === WHITE) return BLACK;
    else if (team === BLACK) return WHITE;
    else return EMPTY;
}

function highlightBox(x, y, color) {
    chessCtx.fillStyle = color;
    chessCtx.fillRect((TILE_SIZE * x) + 3, (TILE_SIZE * y) + 3, TILE_SIZE - 5, TILE_SIZE - 5);
}


class Board {
    constructor() {
        this.tiles = [];

        this.tiles.push([
            new Tile(CASTLE, BLACK),
            new Tile(HORSE, BLACK),
            new Tile(
                BISHOP, BLACK),
            new Tile(QUEEN, BLACK),
            new Tile(KING, BLACK),
            new Tile(
                BISHOP, BLACK),
            new Tile(HORSE, BLACK),
            new Tile(CASTLE, BLACK)
        ]);

        this.tiles.push([
            new Tile(SOLDIER, BLACK),
            new Tile(SOLDIER, BLACK),
            new Tile(SOLDIER, BLACK),
            new Tile(SOLDIER, BLACK),
            new Tile(SOLDIER, BLACK),
            new Tile(SOLDIER, BLACK),
            new Tile(SOLDIER, BLACK),
            new Tile(SOLDIER, BLACK)
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
            new Tile(SOLDIER, WHITE),
            new Tile(SOLDIER, WHITE),
            new Tile(SOLDIER, WHITE),
            new Tile(SOLDIER, WHITE),
            new Tile(SOLDIER, WHITE),
            new Tile(SOLDIER, WHITE),
            new Tile(SOLDIER, WHITE),
            new Tile(SOLDIER, WHITE)
        ]);

        this.tiles.push([
            new Tile(CASTLE, WHITE),
            new Tile(HORSE, WHITE),
            new Tile(BISHOP, WHITE),
            new Tile(QUEEN, WHITE),
            new Tile(KING, WHITE),
            new Tile(BISHOP, WHITE),
            new Tile(HORSE, WHITE),
            new Tile(CASTLE, WHITE)
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
    constructor(pieceType, team) {
        this.pieceType = pieceType;
        this.team = team;
    }
}