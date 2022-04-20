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
let KING_POS = 0;

let BlackKingX
let WhiteKingX
let BLACKKingY
let WhiteKingY
let FLAG1;
const INVALID = 0;
const VALID = 1;
const VALID_CAPTURE = 2;
let checking;
let checkmate;

let movementArray = [];


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

    BlackKingX = 4;
    WhiteKingX = 4;
    BlackKingY = 0;
    WhiteKingY = 0;



    drawBoard();
    checkPossiblePlays();
    drawPieces();
    updateWinner();
}

function onClick(event) {
    let chessCanvasX = chessCanvas.getBoundingClientRect().left;
    let chessCanvasY = chessCanvas.getBoundingClientRect().top;


    let x = Math.floor((event.clientX - chessCanvasX) / TILE_SIZE);
    console.log(event.clientX, chessCanvasX, TILE_SIZE, x);
    let y = Math.floor((event.clientY - chessCanvasY) / TILE_SIZE);
    console.log(event.clientY, chessCanvasY, TILE_SIZE, y);

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
        changeCurrentTeam();
        checkCheckmate(x, y);
        checking = false;
    } else {
        curX = x;
        curY = y;
    }

    drawBoard();
    checkPossiblePlays();
    drawPieces();



}

function checkPossiblePlays() {
    console.log(curX, curY);

    if (curX < 0 || curY < 0) return;

    let tile = board.tiles[curY][curX];
    if (checking) {
        console.log('Checkked in');
    } else {
        if (tile.team === EMPTY || tile.team !== currentTeam) return;
    }
    if (checking) {
        console.log('Checked');
    } else drawTile(curX, curY, HIGHLIGHT_COLOR);

    board.resetValidMoves();

    if (tile.pieceType === SOLDIER) checkPossiblePlaysSOLDIER(curX, curY);
    else if (tile.pieceType === HORSE) checkPossiblePlaysHORSE(curX, curY);
    else if (tile.pieceType === BISHOP) checkPossiblePlaysBishop(curX, curY);
    else if (tile.pieceType === CASTLE) checkPossiblePlaysCASTLE(curX, curY);
    else if (tile.pieceType === QUEEN) checkPossiblePlaysQUEEN(curX, curY);
    else if (tile.pieceType === KING) checkPossiblePlaysKING(curX, curY);
}

function checkPossiblePlaysSOLDIER(curX, curY) {
    console.log(curX, curY);
    let direction;

    if (currentTeam === WHITE) direction = -1;
    else direction = 1;

    console.log("Direction : " + direction + " CurX : " + curX + " CurY : " + curY);

    if (curY + direction < 0 || curY + direction > BOARD_HEIGHT - 1) return;

    checkPossibleMove(curX, curY + direction, direction);

    if (curY === 1 || curY === 6) {
        checkPossibleMove(curX, curY + 2 * direction);
    }

    if (curX - 1 >= 0) checkPossibleCapture(curX - 1, curY + direction);

    if (curX + 1 <= BOARD_WIDTH - 1) checkPossibleCapture(curX + 1, curY + direction);

    // if (curY === 0 || curY === 7) {
    //     tile.pieceType
    // }
}



function checkPossiblePlaysHORSE(curX, curY) {
    console.log(curX, curY);
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
    console.log(curX, curY);
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
    console.log(curX, curY);
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
    console.log(curX, curY);
    checkPossiblePlaysBishop(curX, curY);
    checkPossiblePlaysCASTLE(curX, curY);
}

function checkPossiblePlaysKING(curX, curY) {
    console.log(curX, curY);

    for (let i = -1; i <= 1; i++) {
        if (curY + i < 0 || curY + i > BOARD_HEIGHT - 1) continue;

        for (let j = -1; j <= 1; j++) {
            if (curX + j < 0 || curX + j > BOARD_WIDTH - 1) continue;
            if (i == 0 && j == 0) continue;

            checkPossiblePlay(curX + j, curY + i, curX, curY);
        }
    }
}

function checkPossiblePlay(x, y, curX, curY) {
    console.log(x, y);
    // if (board.tiles[y][x].pieceType == KING) {
    //     window.alert("Checkmate");
    // }
    if (checkPossibleCapture(x, y)) {
        console.warn(curX, curY);
        let tile = board.tiles[y][x];

        if (tile.pieceType == KING) {
            KING_POS++;
        }
        return true;
    }


    return !checkPossibleMove(x, y);
}

function checkPossibleMove(x, y) {
    console.log(x, y);
    try {
        if (board.tiles[y][x].team != EMPTY) return false;
        board.validMoves[y][x] = VALID;
    } catch (e) {
        FLAG1 = true;

    }
    if (checking) {
        console.log("checked2");
    } else highlightBox(x, y, HIGHLIGHT_COLOR);
    try {
        var tile = board.tiles[curY][curX];
    } catch (e) {

    }

    if (tile.pieceType == KING) {
        KING_POS++;
    }
    // if (checking) checking = false;
    return true;
}

function checkPossibleCapture(x, y) {
    console.log(x, y);
    if (board.tiles[y][x].team !== getOppositeTeam(currentTeam)) return false;

    board.validMoves[y][x] = VALID_CAPTURE;
    highlightBox(x, y, CAPTURE_COLOR);
    if (board.tiles[y][x].pieceType == KING) {
        alert("CHECKMATE :");

        location.reload();
    }
    if (board.tiles[y][x].pieceType == KING && checking == true) {
        alert("CHECKMATE :");
        location.reload();

    }

    return true;
}

function checkValidMovement(x, y) {
    console.log(x, y);
    if (board.validMoves[y][x] === VALID || board.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
}

function checkValidCapture(x, y) {
    console.log(x, y);
    if (board.validMoves[y][x] === VALID_CAPTURE) return true;
    else return false;
}

function moveSelectedPiece(x, y) {

    if (FLAG1 && whiteWins == 0 && blackWins == 0) {
        let inputchoice;
        while (true) {
            inputchoice = window.prompt("PLEASE SELECT THE NUMBER BELOW TO YOUR PIECE ACCORDINGLY : \n  1 : For Horse \n 2 : For Bishop \n 3 : For Rook");
            inputchoice = parseInt(inputchoice);
            if (inputchoice > 3 || inputchoice < 1) {
                continue;
            } else {
                console.log(inputchoice);
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
                }
                break;
            }
        }
    } else {
        board.tiles[y][x].pieceType = board.tiles[curY][curX].pieceType;

    }
    board.tiles[y][x].team = board.tiles[curY][curX].team;
    if (board.tiles[y][x].pieceType == KING) {
        console.log("BLACK : " + x, y, curX, curY);
        BlackKingX = x;
        BlackKingY = y;
    }
    if (board.tiles[y][x].pieceType == KING) {
        console.log("BLACK : " + x, y, curX, curY);
        WhiteKingX = x;
        WhiteKingY = y;
    }
    board.tiles[curY][curX].pieceType = EMPTY;
    board.tiles[curY][curX].team = EMPTY;
    console.log("MOVED");
    movementArray = [];
    KING_POS = 0;
    // checkCheckmate(x, y);
    curX = -1;
    curY = -1;
    board.resetValidMoves();
}

function checkCheckmate(x, y) {

    if (board.tiles[y][x].pieceType == SOLDIER) {
        return;
    } else {
        if (checkValidMovement(x, y) === true) {
            if (checkValidCapture(x, y) === true) {
                console.log("ENTERED SUCCESSFUL");
            }
            moveSelectedPiece(x, y);
            checking = true;
            checkPossiblePlays();
            changeCurrentTeam();
            console.log(x, y);
        } else {
            curX = x;
            curY = y;
        }

        // drawBoard();
        drawBoard();
        checkPossiblePlays();
        drawPieces();

        // if (checkmate == false) {
        //     board.resetValidMoves();
        //     changeCurrentTeam();
        // }
        // checking = false;

    }
    checkmate = false;


}






// checkCheckmate(board.tiles[y][x].pieceType, curY, curX)



// function checkCheckmate(piecetype, curXX, curYY) {
//     console.log("Current piece is " + piecetype);
//     if (checking)
//         switch (piecetype) {
//             case 0:
//                 checkPossiblePlaysSOLDIER(curXX, curYY);
//             case 1:
//                 checkPossiblePlaysHORSE(curXX, curYY);
//             case 2:
//                 checkPossiblePlaysBishop(curXX, curYY);
//             case 3:
//                 checkPossiblePlaysCASTLE(curXX, curYY);
//             case 4:
//                 checkPossiblePlaysQUEEN(curXX, curYY);
//             case 5:
//                 checkPossiblePlaysKING(curXX, curYY);
//         }
// }

function changeCurrentTeam() {
    console.log(currentTeam)
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
        onload();
    }
    if (blackWins) {
        window.alert("BLACK HAS BEEN WON !!!!");
        onload();
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
        console.log(this.tiles);
        console.log(this.validMoves)
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