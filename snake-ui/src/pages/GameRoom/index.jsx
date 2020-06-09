import React, { useEffect, useReducer } from 'react';

import { MoveRequest, Snake, Coordinate, Direction, GameUpdateRequest } from '../../snake_pb.js'

import { DIRECTION_TICKS, DIRECTIONS, DIRECTION_MAPPER, KEY_CODES_MAPPER } from "../../helpers/constants"
import { getIsSnakeOutside, getSnakeHead, getIsSnakeClumy, getSnakeWithoutStub, getRandomCoordinate, getIsSnakeEating } from "../../helpers/utils"

import Grid from "../../components/Grid"


const TICK_RATE = 500;

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
      const { snakes } = state
      const isSnakeEating = getIsSnakeEating({ snake: snakes[snakeIdx], food: food[0] });

      const snakeHead = DIRECTION_TICKS[playground.direction](
        getSnakeHead(snakes[snakeIdx])[0],
        getSnakeHead(snakes[snakeIdx])[1]
      );

      const snakeTail = isSnakeEating
        ? snakes[snakeIdx]
        : getSnakeWithoutStub(snakes[snakeIdx]);

      const foodCoordinate = isSnakeEating
        ? getRandomCoordinate()
        : food

      let newSnakes = {}
      if (snakeIdx === 0) {
        newSnakes = { 0: [snakeHead, ...snakeTail], 1: [...state.snakes[1]] }
      } else {
        newSnakes = { 0: [...state.snakes[0]], 1: [snakeHead, ...snakeTail] }
      }

      return {
        ...state,
        snakes: {
          ...newSnakes
        },
        food: [...foodCoordinate]
      }

    case 'SNAKE_MOVE_OPPONENT':
      const {opponentSnake, snakeOpponentIdx} = action
     
      const isOpponentSnakeEating = getIsSnakeEating({ snake: opponentSnake, food: food[0] });

      const snakeOpponentHead = DIRECTION_TICKS[playground.direction](
        getSnakeHead(opponentSnake)[0],
        getSnakeHead(opponentSnake)[1]
      );

      const snakeOpponentTail = isOpponentSnakeEating
        ? opponentSnake
        : getSnakeWithoutStub(opponentSnake);


      const newFoodCoordinate = isOpponentSnakeEating
        ? getRandomCoordinate()
        : food

      let newUpdatedSnakes = {}
      if (snakeOpponentIdx === 0) {
        newUpdatedSnakes = { 0: [snakeOpponentHead, ...snakeOpponentTail], 1: [...state.snakes[1]] }
      } else {
        newUpdatedSnakes = { 0: [...state.snakes[0]], 1: [snakeOpponentHead, ...snakeOpponentTail] }
      }


      return {
        ...state,
        snakes: {
          ...newUpdatedSnakes
        },
        food: [...newFoodCoordinate]
      }
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
    snakes: {
      0: [...snakes[0][1]],
      1: [...snakes[1][1]]
    },
    food
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

      const [,,, snakes] = response.array

      console.log("opponentSnake", snakes[snakeOpponentIdx][1])

      dispatch({ type: 'SNAKE_MOVE_OPPONENT', opponentSnake: snakes[snakeOpponentIdx][1], snakeOpponentIdx: snakeOpponentIdx });

    });
    stream.on('status', function (status) {
      console.log(status.code);
      console.log(status.details);
      console.log(status.metadata);
    });
    stream.on('end', function (end) {
      // stream end signal
      console.log("end")
    });

    return () =>
      window.removeEventListener('keyup', onChangeDirection, false);
  }, []);

  useEffect(() => {
    const { snakes, snakeIdx, playground } = state
    while (!playground.isGameOver) {
      const onTick = () => {
        getIsSnakeOutside(snakes[snakeIdx], gridSize) || getIsSnakeClumy(snakes[snakeIdx])
          ? dispatch({ type: 'GAME_OVER' })
          : dispatch({ type: 'SNAKE_MOVE' });

        console.log("snakes[snakeIdx]", snakes[snakeIdx])
        const snakeCoords = snakes[snakeIdx].map(c => {
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
        //   , (err, moveResponse) => {
        //   // console.log({ err })
        //   // console.log({ moveResponse })
        // })
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
        snakes={state.snakes}
        isGameOver={state.playground.isGameOver}
      />
    </div>
  );
};

export default GameRoom;
