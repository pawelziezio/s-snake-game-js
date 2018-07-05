document.addEventListener('DOMContentLoaded', function() {

    const gameBoard = document.querySelector('.game-board');

    const cellsX = 20;
    const cellsY = 20;

    for( let i = 0; i < cellsY ; i++ ){
        const tr = document.createElement("tr");
        for( let j = 0; j < cellsX ; j++ ){
            const td = document.createElement('td');
            td.classList.add('board-cell');
            td.dataset.row = i;
            td.dataset.col = j;
            tr.appendChild(td);
        }
        gameBoard.appendChild(tr);
    }



})