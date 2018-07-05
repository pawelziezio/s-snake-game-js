document.addEventListener('DOMContentLoaded', function() {

    const gameBoard = document.querySelector('.game-board');

    const cellsX = 20;
    const cellsY = 20;

    //initil position
    const snake = [ [10,10] ];

    //initial heading 1 - N, 2 - E, 3 - S, 4 - w
    let direction = 1;

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

    // get direction
    document.addEventListener('keydown', getDirection)

    function getDirection(e){
        switch(e.keyCode) {
            case 37:
                direction = 4;
                break;
            case 38:
                direction = 1;
                break;
            case 39:
                direction = 2;
                break;
            case 40:
                direction = 3;
                break;
        }
    }

    function drowSnake () {
        let snakeHeadX = snake[0][0];
        let snakeHeadY = snake[0][1];

        //new head based on the heading
        switch(direction) {
            case 1:
                snakeHeadY--;
                break;
            case 2:
                snakeHeadX++;
                break;
            case 3:
                snakeHeadY++;
                break;
            case 4:
                snakeHeadX--;
                break;
}
        let newHead = [snakeHeadX, snakeHeadY];

        snake.unshift(newHead);

        let lastCell = snake.pop();
        const snakeLastCell = document.querySelector(`[data-row='${lastCell[1]}'][data-col='${lastCell[0]}']`);
        snakeLastCell.classList.remove('snake');

        snake.forEach(cell => {
            const snakeCell = document.querySelector(`[data-row='${cell[1]}'][data-col='${cell[0]}']`);
            snakeCell.classList.add('snake')
        })
    };

    setInterval(drowSnake, 600)
    drowSnake()
    // drowSnake()



    })