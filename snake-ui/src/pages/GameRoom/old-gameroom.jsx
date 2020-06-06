import React, {useEffect, useState} from 'react'
import Grid from "../../components/Grid"
import { buildGrid, getIsSnakeOutside, getIsSnakeClumy, getSnakeHead } from "../../helpers/utils"
import { KEY_CODES_MAPPER, DIRECTION_MOVE } from "../../helpers/constants"

const GameRoom = ({ game: { array: gameConfig } }) => {
    const [, , boardConfig, snakes, speed] = gameConfig[0]
    const [gridSnakes, setGridSnakes] = useState([snakes[0][1], snakes[1][1]])

    const TICK_RATE = 100
    const food = boardConfig[2][0]
    const grid = buildGrid(boardConfig)
    const gridSize = grid.length - 1

    const [status, setStatus] = useState('PLAYING')
  
    // let gridSnakes = []
    // gridSnakes.push(snakes[0][1])
    // gridSnakes.push(snakes[1][1])


    const onChangeDirection = event => {
        if (KEY_CODES_MAPPER[event.keyCode]) {
            const DIRECTION = KEY_CODES_MAPPER[event.keyCode]
            console.log({DIRECTION})
            if(DIRECTION === "UP") {
                let snake = gridSnakes[0]
                console.log({snake})
                let head = getSnakeHead(snake)
                console.log({head})
                const newHead = [head[0], head[1] - 1]
                console.log({newHead})
                let newSnake = [].concat(snake)
                newSnake[0] = newHead 
                console.log({newSnake})
                console.log(gridSnakes[1])
                console.log("snakes", [].concat([newSnake, gridSnakes[1]]))
                setGridSnakes([].concat([newSnake, gridSnakes[1]]))
            }
          
        }
      };

    useEffect(() => {
        window.addEventListener('keyup', onChangeDirection, false);
        return () =>
          window.removeEventListener('keyup', onChangeDirection, false);
      }, []);

    useEffect(() => {
        const onTick = () => {
          getIsSnakeOutside(snakes[0][1], gridSize) || getIsSnakeClumy(snakes[0][1])
            ? setStatus("GAME_OVER")
            : setStatus("SNAKE_MOVE")
        };
    
        const interval = setInterval(onTick, TICK_RATE);
    
        return () => clearInterval(interval);
      }, [status]);

     
    
    return (
        <>
            <Grid grid={grid} gridSize={gridSize} snakes={gridSnakes} boardConfig={boardConfig} food={food} isGameOver={false} />
        </>
    )
}

export default GameRoom