import React, { useState, useEffect, useReducer } from 'react';

import Grid from "../../components/Grid"

import { DIRECTION_TICKS, DIRECTIONS, KEY_CODES_MAPPER } from "../../helpers/constants"
import { buildGrid, getIsSnakeOutside, getSnakeHead, getIsSnakeClumy, getSnakeWithoutStub, getRandomCoordinate, getIsSnakeEating } from "../../helpers/utils"



const TICK_RATE = 50;

const reducer = (state, action) => {
  switch (action.type) {
    case 'SNAKE_CHANGE_DIRECTION':
      return {
        ...state,
        playground: {
          ...state.playground,
          direction: action.direction,
        },
      };
    case 'SNAKE_MOVE':
      const isSnakeEating = getIsSnakeEating({ snake: state.snakes.snake1, snack: { coordinate: [3, 3] } });

      const snakeHead = DIRECTION_TICKS[state.playground.direction](
        getSnakeHead(state.snakes.snake1)[0],
        getSnakeHead(state.snakes.snake1)[1]
      );

      const snakeTail = isSnakeEating
        ? state.snakes.snake1
        : getSnakeWithoutStub(state.snakes.snake1);


      const snackCoordinate = isSnakeEating
        ? getRandomCoordinate()
        : state.snack.coordinate;


      return {
        ...state,
        snakes: {
          snake1: [snakeHead, ...snakeTail],
          snake2: [...state.snakes.snake2]
        },
        snack: {
          coordinate: snackCoordinate,
        },
      };
    case 'GAME_OVER':
      return {
        ...state,
        playground: {
          ...state.playground,
          isGameOver: true,
        },
      };
    default:
      throw new Error();
  }
};

const GameRoom = ({ game: { array: gameConfig } }) => {
  const [, , boardConfig, snakes, speed] = gameConfig[0]

  const GRID = buildGrid(boardConfig)
  const gridSize = GRID.length - 1

  const initialState = {
    playground: {
      direction: DIRECTIONS.UP,
      isGameOver: false,
    },
    snakes: {
      snake1: [...snakes[0][1]],
      snake2: [...snakes[1][1]]
    },
    snack: {
      coordinate: getRandomCoordinate(),
    },
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeDirection = event => {
    if (KEY_CODES_MAPPER[event.keyCode]) {
      dispatch({
        type: 'SNAKE_CHANGE_DIRECTION',
        direction: KEY_CODES_MAPPER[event.keyCode],
      });
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', onChangeDirection, false);

    return () =>
      window.removeEventListener('keyup', onChangeDirection, false);
  }, []);

  useEffect(() => {
    const onTick = () => {
      getIsSnakeOutside(state.snakes.snake1, gridSize) || getIsSnakeClumy(state.snakes.snake1)
        ? dispatch({ type: 'GAME_OVER' })
        : dispatch({ type: 'SNAKE_MOVE' });
    };

    const interval = setInterval(onTick, TICK_RATE);

    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="app">
      <h1>Fight!</h1>
      <Grid
        grid={GRID}
        gridSize={gridSize}
        snack={state.snack}
        snakes={state.snakes}
        isGameOver={state.playground.isGameOver}
      />
    </div>
  );
};

export default GameRoom;
