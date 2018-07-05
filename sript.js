document.addEventListener('DOMContentLoaded', function() {

    const gameBoard = document.querySelector('.game-board');

    const cellsX = 20;
    const cellsY = 20;

    //initil position
    const snake = [ [10,10], [11,10] ];
    let applePosition;
    //initial heading 1 - N, 2 - E, 3 - S, 4 - w
    let direction = 1;
    let gameSpeed = 400;

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
                if(direction !== 2) direction = 4;
                break;
            case 38:
                if(direction !== 3) direction = 1;
                break;
            case 39:
                if(direction !== 4) direction = 2;
                break;
            case 40:
                if(direction !== 1) direction = 3;
                break;
        }
    }

    function applePositionXY(){
        return [
            Math.floor(Math.random()*cellsX),
            Math.floor(Math.random()*cellsY)
        ]
    }

    function addApple(){
        applePosition = applePositionXY();
        const apple = document.querySelector(`[data-row='${applePosition[1]}'][data-col='${applePosition[0]}']`);
        apple.classList.add('apple');
    }

    function startGame () {
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

        //game over if the snake hits the wall
        if(newHead[0] < 0 || newHead[0] >= cellsX || newHead[1] < 0 || newHead[1] >=cellsY){
            // function game over to implement
            location.reload()
        }

        snake.unshift(newHead);

        if(newHead[0] === applePosition[0] && newHead[1] === applePosition[1]){
            snake.forEach(cell => {
                const snakeCell = document.querySelector(`[data-row='${cell[1]}'][data-col='${cell[0]}']`);
                snakeCell.classList.add('snake');
                snakeCell.classList.remove('apple');
            })
            applePosition = null;
            addApple();
            if(snake.length % 5 === 0) gameSpeed /= 1.25;
        }else{
            let lastCell = snake.pop();
            const snakeLastCell = document.querySelector(`[data-row='${lastCell[1]}'][data-col='${lastCell[0]}']`);
            snakeLastCell.classList.remove('snake');

            snake.forEach(cell => {
                const snakeCell = document.querySelector(`[data-row='${cell[1]}'][data-col='${cell[0]}']`);
                snakeCell.classList.add('snake')
            })
        }

        // if(snake.length % 5 === 0) gameSpeed /= 1.25;
        setTimeout(startGame, gameSpeed);
    };

    if(!applePosition) addApple();
    startGame();
})