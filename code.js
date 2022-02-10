/*test*/

/*
interne representatie:
elke cel bestaat uit 3 characters, 1 voor type, 1 voor kleur en 1 om aan te
duiden dat de cel een mogelijke zet is voor de huidig geslecteerde stuk.

voor type geldt syntax:
    r = rook
    k = knight
    b = bishop
    K = king
    Q = queen

    0 = geen type(default)

voor kleur geld syntax:
    W = wit
    B = zwart

    0 = geen kleur(default)

voor mogelijke zet geldt syntax:
    M = mogelijke zet (die geen capture is)
    C = mogelijke zet die een capture is

    0 = geen mogelijke zet(default)
*/

let board = [   [["r","B","0"],["k","B","0"],["b","B","0"],["Q","B","0"],["K","B","0"],["b","B","0"],["k","B","0"],["r","B","0"]],
                [["p","B","0"],["p","B","0"],["p","B","0"],["p","B","0"],["p","B","0"],["p","B","0"],["p","B","0"],["p","B","0"]],
                [["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"]],
                [["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"]],
                [["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"]],
                [["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"],["0","0","0"]],
                [["p","W","0"],["p","W","0"],["p","W","0"],["p","W","0"],["p","W","0"],["p","W","0"],["p","W","0"],["p","W","0"]],
                [["r","W","0"],["k","W","0"],["b","W","0"],["Q","W","0"],["K","W","0"],["b","W","0"],["k","W","0"],["r","W","0"]]]
let turnCount = 0;
let selectedRow;
let selectedCol;

window.onload = function(){
    drawBoard()
}

function drawBoard(){
    let boardHTML = generateBoardHTML(board);
    document.getElementById("boardContainer").innerHTML = boardHTML;
}

function generateBoardHTML(board){
    let tableInnerHTML = "";

    for(let i = 0; i < board.length; i++){
        let rowHTML = '<tr>';
        for(let j = 0; j < board[i].length; j++){
            let temp = generateTile(board[i][j], i, j);
            rowHTML += temp;
        }
        rowHTML += "</tr>";
        tableInnerHTML += rowHTML;
    }

    return `
            <table class="board" cellspacing="0" cellpadding="0">
                ${tableInnerHTML}
            </table>
            `;
}

function generateTile(cel, row, col){
    let type = cel[0];
    let color = cel[1];
    let possibleMove = cel[2];
    let squareContent = "";
    
    //HTML maken voor moest cel een stuk zijn
    if(color == "W"){
        switch(type){
            case 'p':
                squareContent = '<img src="/images/pawnWhite.svg" alt="pawn white" class="activePiece">';
                break;
            case 'r':
                squareContent = '<img src="/images/rookWhite.svg" alt="rook white" class="activePiece">';
                break;
            case 'k':
                squareContent = '<img src="/images/knightWhite.svg" alt="knight white" class="activePiece">';
                break;
            case 'b':
                squareContent = '<img src="/images/bishopWhite.svg" alt="bishop white" class="activePiece">';
                break;
            case 'Q':
                squareContent = '<img src="/images/queenWhite.svg" alt="queen white" class="activePiece">';
                break;
            case 'K':
                squareContent = '<img src="/images/kingWhite.svg" alt="king white" class="activePiece">';
                break;
        }
    }
    else if(color == "B"){
        switch(type){
            case 'p':
                squareContent = '<img src="/images/pawnBlack.svg" alt="pawn black" class="activePiece">';
                break;
            case 'r':
                squareContent = '<img src="/images/rookBlack.svg" alt="rook black" class="activePiece">';
                break;
            case 'k':
                squareContent = '<img src="/images/knightBlack.svg" alt="knight black" class="activePiece">';
                break;
            case 'b':
                squareContent = '<img src="/images/bishopBlack.svg" alt="bishop black" class="activePiece">';
                break;
            case 'Q':
                squareContent = '<img src="/images/queenBlack.svg" alt="queen black" class="activePiece">';
                break;
            case 'K':
                squareContent = '<img src="/images/kingBlack.svg" alt="king black" class="activePiece">';
                break;
        }
    }

    //HTML maken voor moest cel een mogelijke zet zijn
    if(possibleMove == "M") squareContent += '<span class="possibleMove"></span>';
    else if(possibleMove == "C") squareContent += '<div class="possibleCapture"></div>';

    //de meeste rechtse kolom en de onderste rij hebben een markering om de kolom/rij aan te duiden
    if(col == 0) squareContent += `<div class="rowIndicator">${8-row}</div>`;
    let colIndicators = ["a", "b", "c", "d", "e", "f", "g", "h"];
    if(row == 7) squareContent += `<div class="colIndicator">${colIndicators[col]}</div>`;

    //de achtergrondkleur van de cel alterneert tussen licht en donker
    let tileStyle = "A";
    if (((row%2)+(col%2))%2 != 0) tileStyle = "B";
    //de achgergrondkleur van het geselecteerde stuk krijgt ook een aparte kleur
    if(col == selectedCol && row == selectedRow) tileStyle="Selected";

    return `<td class="boardElement tileStyle${tileStyle}" onclick="squareClickHandler(this)">${squareContent}</td>`;
}

function squareClickHandler(event){
    let col = event.cellIndex;
    let row = event.parentNode.rowIndex;
    let type = board[row][col][0];
    let color = board[row][col][1];
    let possibleMove = board[row][col][2];

    let curTurn = "W";
    if(turnCount%2 != 0) curTurn = "B";

    //check of het ingedrukte vakje een stuk van de juiste kleur is
    if(color == curTurn){
        selectedRow = row;
        selectedCol = col;
        removeOldPossibleMoves(board)
        findPossibleMoves(board, row, col);
        drawBoard();
    }

    //check of het ingedrukte vakje een mogelijke zet is voor het eerder geselecteerde stuk
    if(possibleMove == "M" || possibleMove == "C"){
        removeOldPossibleMoves(board);
        board[row][col] = board[selectedRow][selectedCol];
        board[selectedRow][selectedCol] = ["0","0","0"];
        drawBoard();
        turnCount++;
    }
}

function findPossibleMoves(board, row, col){
    let type = board[row][col][0];
    let color = board[row][col][1];
    let opColor = "B";
    let boardAdjustedForTurn = [];

    if(color == "B"){
        opColor = "W";
        boardAdjustedForTurn = flipBoard(board);
        row = 7-row;
    }
    else{
        boardAdjustedForTurn = board;
    }

    //checken welk soort stuk aangeklikt is en gepaste functie oproepen om zetten te bepalen
    switch(type){
        case 'p':
            board = findMovesPawn(boardAdjustedForTurn, row, col, color, opColor);
            break;
        case 'r':
            findMovesRook(boardAdjustedForTurn, row, col, color, opColor);
            break;
        case 'k':
            findMovesKnight(boardAdjustedForTurn, row, col, color, opColor);
            break;
        case 'b':
            findMovesBishop(boardAdjustedForTurn, row, col, color, opColor);
            break;
        case 'Q':
            findMovesQueen(boardAdjustedForTurn, row, col, color, opColor);
            break;
        case 'K':
            findMovesKing(boardAdjustedForTurn, row, col, color, opColor);
            break;
    }

    if(color =="B") board = flipBoard(boardAdjustedForTurn);    
    return board;
}

function flipBoard(board){
    let flippedBoard = []
    for(let i = board.length-1; i >= 0; i--) flippedBoard[7-i] = board[i];
    return flippedBoard;
}

function removeOldPossibleMoves(board){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            board[i][j][2] = "0";
        }
    }

    return board;
}

function findMovesPawn(board, row, col, color, opColor){
    //check of pion verplaats kan worden, zonder een stuk te pakken
    if(board[row-1][col][0] == "0"){
        board[row-1][col][2] = "M";
    }
    if(row == 6 && board[row-2][col][0] == "0"){
        board[row-2][col][2] = "M";
    }

    //check of pion een stuk kan pakken
    if(col > 0 && board[row-1][col-1][1] == opColor){
        board[row-1][col-1][2] = "C";
    }
    if(col < 7 && board[row-1][col+1][1] == opColor){
        board[row-1][col+1][2] = "C";
    }

    return board;
}


function findMovesRook(board, row, col, color, opColor){
    
}

function findMovesKnight(board, row, col, color, opColor){
    // 2 omhoog, 1 links
    if(col > 0 && row > 1 && board[row-2][col-1][1] == "0"){
        board[row-2][col-1][2] = "M";
    }
    if(col > 0 && row > 1 && board[row-2][col-1][1] == opColor){
        board[row-2][col-1][2] = "C";
    }

    // 2 omhoog, 1 rechts
    if(col < 7 && row > 1 && board[row-2][col+1][1] == "0"){
        board[row-2][col+1][2] = "M";
    }
    if(col < 7 && row > 1 && board[row-2][col+1][1] == opColor){
        board[row-2][col+1][2] = "C";
    }
    
    //2 rechts, 1 omhoog
    if(col < 6 && row > 0 && board[row-1][col+2][1] == "0"){
        board[row-1][col+2][2] = "M";
    }
    if(col < 6 && row > 0 && board[row-1][col+2][1] == opColor){
        board[row-1][col+2][2] = "C";
    }

    //2 rechts, 1 omlaag
    if(col < 6 && row < 7 && board[row+1][col+2][1] == "0"){
        board[row+1][col+2][2] = "M";
    }
    if(col < 6 && row < 7 && board[row+1][col+2][1] == opColor){
        board[row+1][col+2][2] = "C";
    }

    //2 omlaag, 1 rechts
    if(col < 7 && row < 6 && board[row+2][col+1][1] == "0"){
        board[row+2][col+1][2] = "M";
    }
    if(col < 7 && row < 6 && board[row+2][col+1][1] == opColor){
        board[row+2][col+1][2] = "C";
    }   

    //2 omlaag, 1 links
    if(col > 0 && row < 6 && board[row+2][col-1][1] == "0"){
        board[row+2][col-1][2] = "M";
    }
    if(col > 0 && row < 6 && board[row+2][col-1][1] == opColor){
        board[row+2][col-1][2] = "C";
    }

    //2 links, 1 omlaag
    if(col > 1 && row < 7 && board[row+1][col-2][1] == "0"){
        board[row+1][col-2][2] = "M";
    }
    if(col > 1 && row < 7 && board[row+1][col-2][1] == opColor){
        board[row+1][col-2][2] = "C";
    }

    //2 links, 1 omhoog
    if(col > 1 && row > 0 && board[row-1][col-2][1] == "0"){
        board[row-1][col-2][2] = "M";
    }
    if(col > 1 && row > 0 && board[row-1][col-2][1] == opColor){
        board[row-1][col-2][2] = "C";
    }
}

function findMovesBishop(board, row, col, color, opColor){
    //check diagonaal stijgend
    //lineariseren
    let curCol = col;
    let curRow = row;
    let offset = 0;
    while(curCol != 0 && curRow != 7){
        offset++;
        curCol--;
        curRow++;
    }
    startRow = curRow;
    startCol = curCol;

    let array = [];
    let i = 0;
    while(curCol != 8 && curRow != -1){
        array[i] = board[curRow][curCol];
        i++;
        curCol++;
        curRow--;
    }
    array = findMovesLinearised(array, offset, color, opColor);

    //geupadte array terug in het bord steken
    curRow = startRow;
    curCol = startCol;
    i = 0;
    while(curCol != 8 && curRow != -1){
        board[curRow][curCol] = array[i];
        i++;
        curCol++;
        curRow--;
    }
    

    //check diagonaal dalend
    //lineariseren
    curCol = col;
    curRow = row;
    offset = 0;
    while(curCol != 0 && curRow != 0){
        offset++;
        curCol--;
        curRow--;
    }
    startRow = curRow;
    startCol = curCol;

    array = [];
    i = 0;
    while(curCol != 8 && curRow != 8){
        array[i] = board[curRow][curCol];
        i++;
        curCol++;
        curRow++;
    }
    array = findMovesLinearised(array, offset, color, opColor);

    //geupadte array terug in het bord steken
    curRow = startRow;
    curCol = startCol;
    i = 0;
    while(curCol != 8 && curRow != 8){
        board[curRow][curCol] = array[i];
        i++;
        curCol++;
        curRow++;
    }
}

function findMovesQueen(board, row, col, color, opColor){
    
}

function findMovesKing(board, row, col, color, opColor){
    
}

function findMovesLinearised(array, offset, color, opColor){
    //naar links checken
    let curPos = offset - 1;
    while(curPos > 0 && array[curPos][0] == "0"){
        array[curPos][2] = "M";
        curPos--;
    }
    if(curPos != -1 && array[curPos][1] == opColor){
        array[curPos][2] = "C";
    }
    if(curPos != -1 && array[curPos][0] == "0"){
        array[curPos][2] = "M";
    }

    //naar rechts checken
    curPos = offset + 1;
    while(curPos < array.length-1 && array[curPos][0] == "0"){
        array[curPos][2] = "M";
        curPos++;
    }
    if(curPos != array.length && array[curPos][1] == opColor){
        array[curPos][2] = "C";
    }
    if(curPos != array.length && array[curPos][0] == "0"){
        array[curPos][2] = "M";
    }

    return array;
}