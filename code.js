/*
interne representatie:
*/

let board = [["rB","kB","bB","QB","KB","bB","kB","rB"],
             ["pB","pB","pB","pB","pB","pB","pB","pB"],
             ["00","00","00","00","00","00","00","00"],
             ["00","00","00","00","00","00","00","00"],
             ["00","00","00","00","00","00","00","00"],
             ["00","00","00","00","00","00","00","00"],
             ["00","00","00","00","00","00","00","00"],
             ["00","00","00","00","00","00","00","00"],
             ["pW","pW","pW","pW","pW","pW","pW","pW"],
             ["rW","kW","bW","QW","KW","bW","kW","rW"]];
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
            rowHTML += generateTile(board[i][j]);
        }
        rowHTML += "</tr>";
        tableInnerHTML += rowHTML;
    }

    return `
            <table>
                ${tableInnerHTML}
            </table>
            `;
}

function generateTile(cel){
    let type = cel[0];
    let color = cel[1];
    
}