/* Задание
 *
 *                     1. Добавить управление
 *                     2. Каждая из сторон при пресечении должна перемещать на противоположенную
 *                     3. Добавить рандомное появление еды (подсказка: надо навешивать на ячейки класс food)
 * 4. Размер змейки должен увеличиваться
 * 5*. Научиться увеличивать сокрость игры при увеличении количества очков
 * 6**. Придумать новую фичу и реализовать
 * 
 */

var snakeGame = (function () {
    //Константы оформляются в особом стиле
    const WIDTH = 10;
    const HEIGHT = 10;
    foodOnField = false;
    let headX = 0;
    let headY = 0;
    dx = 0;
    dy = 1;
    let currentStep = 1;


    let playStep = () => {
        if(!foodOnField) placeFood();
        headX = (headX + dx) % 10;
        headY = (headY + dy) % 10;
        let newHeadCell = getCell(headX, headY);
        if (hasClass(newHeadCell, "food")){
            removeFoodFromCell(newHeadCell);
            foodOnField = false;
        }
        removeSnakeCells();      
        addSnakeToCell(newHeadCell);
        setCellStep(newHeadCell, currentStep);

        currentStep++;
        return true;
    }

 let placeFood = () => {
        while(true) {
            let foodX = Math.floor(Math.random() * 10);
            let foodY = Math.floor(Math.random() * 10);
            console.log(foodX + " " + foodY);
            let cell = getCell(foodX, foodY);
            if(!hasClass(cell, "snake")) {
                 addFoodToCell(cell);
                 foodOnField = true;
                 return;
            }
        }
    }

    let removeSnakeCells = () => {
        for (let snakeCell of getSnakeCells())
            removeSnakeFromCell(snakeCell);
    }

    let getCell = (x, y) => {
        // Можно находить элементы DOM по id
        return document.getElementById((HEIGHT + y) % HEIGHT + '_' + (WIDTH + x) % WIDTH);
    }

    let getSnakeCells = () => {
        // Можно находить элементы DOM по классу
        return document.getElementsByClassName('snake');
    }

    let addSnakeToCell = cell => {
        // Строчка className может включать несколько классов, например "class1 class2".
        // Поэтому добавляем пробел.
        cell.className += ' snake ';
    }

    let addFoodToCell = cell => {
        cell.className += ' food ';
    }

    let removeSnakeFromCell = cell => {
        cell.className = cell.className.replace('snake', '');
    }

    let removeFoodFromCell = cell => {
        cell.className = cell.className.replace('food', '');
    }

    let setCellStep = (cell, step) => {
        // Есть соглашение, что пользовательские атрибуты называются с префикса "data-".
        cell.setAttribute('data-step', step);
    }

    let getCellStep = cell =>  {
        // Явное преобразование строки к числу через объект-обертку.
        return new Number(cell.getAttribute('data-step'));
    }


    // Только этот объект будет доступен извне.
    return {
        getScore: 0,
        playStep: playStep
    }
})(); // Используем IIFE (Immediately Invoked Function Expression) для изоляции.

function checkTurnPossibility(dx1, dy1) {
    if((Math.abs(dx1) - Math.abs(dx) === 0) || (Math.abs(dy1) - Math.abs(dy) === 0))
         return;
    else {
        dx = dx1;
        dy = dy1;
    }
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

// Главный цикл игры.
let timer = setInterval(function () {
    if (!snakeGame.playStep())
    {
        // Игра закончена - останавливаем цикл.
        clearInterval(timer);
        alert('Game Over! Score: ' + snakeGame.getScore());
    }
}, 200);

// Обработка действий пользователя.
document.onkeydown = e => {
    switch (e.keyCode)
    {
        case 68: checkTurnPossibility(1, 0); break;
        case 87: checkTurnPossibility(0, -1); break;
        case 65: checkTurnPossibility(-1, 0); break;
        case 83: checkTurnPossibility(0, 1); break;
    }
}