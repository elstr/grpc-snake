import cs from "classnames"

const buildGrid = boardConfig => {
    let grid = []
    for (let i = 0; i <= boardConfig[0]; i++) {
        grid.push(i);
    }
    return grid
}

const getCellCs = (isGameOver, snakes, food, x, y, gridSize, snakeIdx) => {
    return cs('grid-cell', {
        'grid-cell-border': isBorder(x, y, gridSize),
        'grid-cell-snake0': isSnake(x, y, snakes[0]),
        'grid-cell-snake1': isSnake(x, y, snakes[1]),
        'grid-cell-food': isPosition(
            x,
            y,
            food[0],
            food[1]
        ),
        'grid-cell-hit':
            isGameOver &&
            isPosition(x, y, getSnakeHead(snakes[snakeIdx])[0], getSnakeHead(snakes[snakeIdx])[1]),
    });
}

const getSnakeTail = snake => snake.slice(1);

const getSnakeHead = snake => snake[0]

const isBorder = (x, y, gridSize) => (x === 0 || y === 0 || x === gridSize || y === gridSize);

const isPosition = (x, y, diffX, diffY) => (x === diffX && y === diffY);

const isSnake = (x, y, snakeCoordinates) => {
    return snakeCoordinates.filter(coordinate =>
        isPosition(coordinate[0], coordinate[1], x, y)
    ).length;
}

const getSnakeWithoutStub = snake => snake.slice(0, snake.length - 1);

const getRandomNumberFromRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

const getRandomCoordinate = (gridSize) => [getRandomNumberFromRange(1, gridSize - 1), getRandomNumberFromRange(1, gridSize - 1)]


const getIsSnakeEating = ({ snake, food }) =>
  {
      console.log({snake})
      console.log({food})
      return   isPosition(
        getSnakeHead(snake)[0],
        getSnakeHead(snake)[1],
        food[0],
        food[1]
    )
  }

const getIsSnakeOutside = (snake, gridSize) =>
    (getSnakeHead(snake)[0] >= gridSize ||
        getSnakeHead(snake)[1] >= gridSize ||
        getSnakeHead(snake)[0] <= 0 ||
        getSnakeHead(snake)[1] <= 0
    )

const getIsSnakeClumy = snake =>
    isSnake(
        getSnakeHead(snake)[0],
        getSnakeHead(snake)[1],
        getSnakeTail(snake))


export {
    buildGrid,
    getCellCs,
    isSnake,
    getIsSnakeOutside,
    getIsSnakeClumy,
    getSnakeHead,
    getSnakeTail,
    getSnakeWithoutStub,
    getRandomCoordinate,
    getIsSnakeEating,
}