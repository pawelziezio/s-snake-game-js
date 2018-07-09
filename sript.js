document.addEventListener('DOMContentLoaded', function() {

    const gameBoard = document.querySelector('.game-board');
    const gameScore = document.querySelector('.game__score-value');
    const startButton = document.querySelector('.game__start-button');
    const gameoverStartButton = document.querySelector('.game-over__start-button');
    const gameoverBoard = document.querySelector('.game-over__board');
    const gameoverScore = document.querySelector('.game-over__score');
    const gameoverTable = document.querySelector('.game-over__table');

    let addBombInterval;
    let startGameTimeout;
    let isGameover = false;

    const cellsX = 20;
    const cellsY = 20;

    //initil position
    let snake = [ [10,10], [11,10] ];
    let bombsArray = [];
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


    function gameover(){
        const score = snake.length;
        clearInterval( addBombInterval );
        isGameover = true;


        let results = [];
        const lastResult = [];

        function leadingZero(i) {
            return (i < 10)? '0'+i : i;
        }

        function showTable(arr){
            let tempArr = arr.map( (item, index) =>{
                return `<tr><td>${index+1+'.'}</td><td>${item[0]}</td><td>${item[1]}</td><td>${item[2]}</td></tr>`
            });
            gameoverTable.innerHTML = `<tr><td>${''}</td><td>${'score'}</td><td>${'date'}</td><td>${'hour'}</td></tr>${tempArr.join(' ')}`;
        }

        const currentDate = new Date();

        const currentDateText = leadingZero(currentDate.getDate()) +
            "." + leadingZero(currentDate.getMonth()+1) +
            "." + currentDate.getFullYear();

        const currentHourText = leadingZero(currentDate.getHours()) +
            ':' + leadingZero(currentDate.getMinutes()) +
            ':' + leadingZero(currentDate.getSeconds());

        if(localStorage.results){
            results = JSON.parse(localStorage.results)

            lastResult.push(score);
            lastResult.push(currentDateText);
            lastResult.push(currentHourText);

            if(results[ (results.length - 1) ][0] < lastResult[0] || results.length < 10 ){
                results.push(lastResult)
                results.sort( (a, b) => b[0] - a[0] );
                if( results.length>10 ) results.pop();
            }
            localStorage.results = JSON.stringify(results);
            showTable(results);

        }else{

            lastResult.push(score);
            lastResult.push(currentDateText);
            lastResult.push(currentHourText);
            localStorage.results = JSON.stringify([lastResult]);
            showTable([lastResult]);

        }

        gameoverScore.innerText = score;
        gameoverBoard.style.display = 'block';
        gameoverBoard.style.opacity = .85;
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
            // location.reload()
            gameover();
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

        }else if(newHead[0] >= 0 && newHead[0] < cellsX && newHead[1] >= 0 && newHead[1] < cellsY){
            let lastCell = snake.pop();
            const snakeLastCell = document.querySelector(`[data-row='${lastCell[1]}'][data-col='${lastCell[0]}']`);
            snakeLastCell.classList.remove('snake');

            snake.forEach(cell => {
                const snakeCell = document.querySelector(`[data-row='${cell[1]}'][data-col='${cell[0]}']`);
                snakeCell.classList.add('snake')
            })
        }

        clickable = true;
        if(!isGameover){
            startGameTimeout = setTimeout(startGame, gameSpeed);
        }
    }


    startButton.addEventListener('click',function(e){
        e.preventDefault();

        startButton.style.opacity = "0";
        setTimeout(function(){startButton.style.display = "none"}, 1000);

        if(!applePosition) addApple();
        startGame();

        addBombInterval = setInterval( addBomb, 30000);
    })


    gameoverStartButton.addEventListener('click',function(e){
        e.preventDefault();

        gameoverBoard.style.opacity = "0";
        setTimeout(function(){gameoverBoard.style.display = "none"}, 1000);

        //initil position
        snake = [ [10,10], [11,10] ];
        bombsArray = [];
        applePosition = null;
        //initial heading 1 - N, 2 - E, 3 - S, 4 - w
        direction = 1;
        gameSpeed = 400;
        clickable = true;
        isGameover = false;

        // new game board without old class
        gameBoard.innerHTML = ''
        getReadyBoard();

        // start new game
        startButton.click();
        showScore();
    })

})