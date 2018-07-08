document.addEventListener('DOMContentLoaded', function() {

    const gameBoard = document.querySelector('.game-board');
    const gameScore = document.querySelector('.game__score-value');
    const startButton = document.querySelector('.game__start-button');


    const cellsX = 20;
    const cellsY = 20;

    //initil position
    const snake = [ [10,10], [11,10] ];
    const bombsArray = [];
    let applePosition = null;
    //initial heading 1 - N, 2 - E, 3 - S, 4 - w
    let direction = 1;
    let gameSpeed = 400;
    let clickable = true;

    function getReadyBoard(){
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
    }

    getReadyBoard();

    // get direction
    document.addEventListener('keydown', getDirection)

    function getDirection(e){
        if(clickable){
            switch(e.keyCode) {
                case 37:
                    if(direction !== 2) direction = 4;
                    clickable = false;
                    break;
                case 38:
                    if(direction !== 3) direction = 1;
                    clickable = false;
                    break;
                case 39:
                    if(direction !== 4) direction = 2;
                    clickable = false;
                    break;
                case 40:
                    if(direction !== 1) direction = 3;
                    clickable = false;
                    break;
            }
        }
    }

    function randomPositionXY(){
        return [
            Math.floor(Math.random()*cellsX),
            Math.floor(Math.random()*cellsY)
        ]
    }

    function addApple(){
        applePosition = randomPositionXY();
        if(collisionTest(applePosition[0], applePosition[1], snake) ||
            collisionTest(applePosition[0], applePosition[1], bombsArray) ){
            applePosition = null;
            addApple();
            return false;
        }
        const apple = document.querySelector(`[data-row='${applePosition[1]}'][data-col='${applePosition[0]}']`);
        apple.classList.add('apple');
    }

    //if snake crashes into itself or the edge of the board === gameover
    function collisionTest(x,y,array){
        for(const val of array){
            if(val[0] === x && val[1] === y){
                return true;
            }
        }
        return false;
    }

    function showScore(){
        gameScore.innerText = snake.length;
    }

    function addBomb(){
        bombPosition = randomPositionXY();
        if(collisionTest(bombPosition[0], bombPosition[1], snake) || collisionTest(bombPosition[0], bombPosition[1], [applePosition]) ){
            bombPosition = null;
            addBomb();
            return false;
        }
        const bomb = document.querySelector(`[data-row='${bombPosition[1]}'][data-col='${bombPosition[0]}']`);
        bomb.classList.add('bomb');
        bombsArray.push(bombPosition);
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

        //game over if the snake hits the wall or crashes into itself or into bomb
        if(newHead[0] < 0 ||
            newHead[0] >= cellsX ||
            newHead[1] < 0 ||
            newHead[1] >=cellsY ||
            collisionTest(newHead[0],newHead[1],snake) ||
            collisionTest(newHead[0],newHead[1],bombsArray) ){
            // function game over to implement
            // location.reload()
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
            showScore();
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
        clickable = true;
        setTimeout(startGame, gameSpeed);
    };

    startButton.addEventListener('click',function(e){
        e.preventDefault();

        startButton.style.opacity = "0";
        setTimeout(function(){startButton.style.display = "none"}, 1000);
        if(!applePosition) addApple();
        startGame();
        setInterval( addBomb, 30000);
    })
})