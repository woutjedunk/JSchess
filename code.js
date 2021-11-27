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

let board = [["rB0","kB0","bB0","QB0","KB0","bB0","kB0","rB0"],
             ["pB0","pB0","pB0","pB0","pB0","pB0","pB0","pB0"],
             ["000","000","000","000","000","000","000","000"],
             ["000","000","000","000","000","000","000","000"],
             ["000","000","000","000","000","000","000","000"],
             ["000","000","000","000","000","000","000","000"],
             ["pW0","pW0","pW0","pW0","pW0","pW0","pW0","pW0"],
             ["rW0","kW0","bW0","QW0","KW0","bW0","kW0","rW0"]];
let turnCount = 0;

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
            rowHTML += generateTile(board[i][j], i, j);
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

    return `<td class="boardElement tileStyle${tileStyle}">${squareContent}</td>`;
}