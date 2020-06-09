import React, { useEffect, useReducer } from 'react';

import { MoveRequest, Snake, Coordinate, Direction, GameUpdateRequest } from '../../snake_pb.js'

import { DIRECTION_TICKS, DIRECTIONS, DIRECTION_MAPPER, KEY_CODES_MAPPER } from "../../helpers/constants"
import { getIsSnakeOutside, getSnakeHead, getIsSnakeClumy, getSnakeWithoutStub, getRandomCoordinate, getIsSnakeEating } from "../../helpers/utils"

import Grid from "../../components/Grid"


const TICK_RATE = 200;

const reducer = (state, action) => {
  const { snakeIdx, playground, food } = state
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
      const currentSnake = state[`snake${snakeIdx}`]
      const isSnakeEating = getIsSnakeEating({ snake: currentSnake, food: food });

      console.log("isSnakeEating" ,isSnakeEating)
      const snakeHead = DIRECTION_TICKS[playground.direction](
        getSnakeHead(currentSnake)[0],
        getSnakeHead(currentSnake)[1]
      );

      const snakeTail = isSnakeEating
        ? currentSnake
        : getSnakeWithoutStub(currentSnake);

      // const foodCoordinate = isSnakeEating
      //   ? getRandomCoordinate()
      //   : food

      const newSnake = [snakeHead, ...snakeTail]

      return {
        ...state,
        [`snake${snakeIdx}`]: newSnake
        // food: [...foodCoordinate]
      }
    case 'UPDATES':
      const {opponentSnake, snakeOpponentIdx, newFood} = action

      let newState = Object.assign({}, state)
      if (newFood) {
        newState.food = [...newFood]
      } else {
        newState = {
          ...state,
          [`snake${snakeOpponentIdx}`]: [...opponentSnake]
        }
      }
      return newState
    // case 'RENDER_NEW_FOOD':
    //   const {food} = action
    //   const newState = {
    //     ...state,
    //     food: [...food]
    //   };
    //   console.log({newState});
      
      return {
        ...state,
        food: [...food]
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

const GameRoom = ({ game, snakeService }) => {
  const { GRID, gridSize, roomID, players, snakes, speed, snakeIdx, food } = game
  const initialState = {
    snakeIdx,
    playground: {
      direction: DIRECTIONS.UP,
      isGameOver: false,
    },
    snake0: [...snakes[0][1]],
    snake1: [...snakes[1][1]],
    food: [...food[0]]
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

    const gameUpdateRequest = new GameUpdateRequest();
    gameUpdateRequest.setPlayer(game.pbPlayer)
    gameUpdateRequest.setRoomid(roomID)

    var stream = snakeService.getGameUpdates(gameUpdateRequest, {});
    stream.on('data', function (response) {
      let snakeOpponentIdx = 0
      if (state.snakeIdx === 0) snakeOpponentIdx = 1

      const [,food,, snakes] = response.array

     
      let newFood = null
      if(state.food && state.food[0] !== food[0] && state.food[1] !== food[1]) {
         newFood = food
      }
      dispatch({ type: 'UPDATES', opponentSnake: snakes[snakeOpponentIdx][1], snakeOpponentIdx: snakeOpponentIdx, newFood: newFood });

    });
  
    stream.on('end', function (end) {
      // stream end signal
      // console.log("end")
    });

    return () =>
      window.removeEventListener('keyup', onChangeDirection, false);
  }, []);

  useEffect(() => {
    const { snakeIdx, playground } = state
    const currentSnake = state[`snake${snakeIdx}`]
    while (!playground.isGameOver) {
      const onTick = () => {
        getIsSnakeOutside(currentSnake, gridSize) || getIsSnakeClumy(currentSnake)
          ? dispatch({ type: 'GAME_OVER' })
          : dispatch({ type: 'SNAKE_MOVE' });

        const snakeCoords = currentSnake.map(c => {
          const pbCoord = new Coordinate();
          pbCoord.setX(c[0]);
          pbCoord.setY(c[1]);
          return pbCoord;
        });

        const pbSnake = new Snake();
        pbSnake.setCellsList(snakeCoords);
        pbSnake.setDir(DIRECTION_MAPPER[playground.direction]);

        const moveRequest = new MoveRequest();
        moveRequest.setRoomid(roomID)
        moveRequest.setPlayer(game.pbPlayer)
        moveRequest.setSnake(pbSnake)
        moveRequest.setSnakeidx(snakeIdx)

        snakeService.moveSnake(moveRequest, {})
      }

      const interval = setInterval(onTick, TICK_RATE);

      return () => clearInterval(interval);
    }
  }, [state]);

  return (
    <div className="app">
      <h1>Fight!</h1>
      <Grid
        grid={GRID}
        snakeIdx={snakeIdx}
        gridSize={gridSize}
        food={state.food}
        snakes={{0: [...state.snake0], 1: [...state.snake1]}}
        isGameOver={state.playground.isGameOver}
      />
    </div>
  );
};

export default GameRoom;
