import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import logo from './assets/logo.png';

import {
  Switch,
  Route,
  withRouter
} from "react-router-dom";

import Spinner from "./components/Spinner";
import GameRoom from "./pages/GameRoom"

import { buildGrid } from "./helpers/utils"
import { TestRequest, NewGameRequest, Player } from './snake_pb.js'
import { SnakeServiceClient } from "./snake_grpc_web_pb"

const App = (props) => {
  const playerRef = useRef(null);
  const difficultyRef = useRef(null);
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [game, setGame] = useState()
  const [player, setPlayer] = useState()

  const snakeService = new SnakeServiceClient('http://' + window.location.hostname + ':8080', null, null);

  useEffect(() => {
    const req = new TestRequest()
    req.setMessage("test connection request")
    snakeService.testConnection(req, {}, (err, _) => {
      if (err) setError(true)
    })
  }, [])

  const startGame = () => {
    console.log({snakeService})
    if (!error) {
      const gameRequest = new NewGameRequest()
      const playerName = playerRef.current.value
      const selectedDiff = difficultyRef.current.value

      const pbPlayer = new Player()
      const playerID = uuidv4()
      pbPlayer.setId(playerID);
      pbPlayer.setName(playerName)

      const newPlayer = { id: pbPlayer.array[0], name: pbPlayer.array[1] }

      setLoading(true)
      setPlayer(newPlayer)

      gameRequest.setPlayer(pbPlayer)
      gameRequest.setDif(selectedDiff)


      snakeService.startNewGame(gameRequest, {}, async (err, gameRoom) => {
        if (err) setError(true)
        else {
          const res = await gameRoom
          const gameRoomConfig = res['array'][0]
          const [, players, boardConfig, snakes, speed] = gameRoomConfig
          const snakeIdx = players.map(p => p[1] === playerID).indexOf(true)
          const player = { ...players[snakeIdx] }
          const GRID = buildGrid(boardConfig)
          const gridSize = GRID.length - 1

          const gameConfig = {
            GRID,
            gridSize,
            roomID: newPlayer.id,
            player,
            players,
            pbPlayer,
            boardConfig,
            snakes,
            speed,
            snakeIdx,
            food: boardConfig[2]
          }

          setGame(gameConfig)
          props.history.push("/gameroom")
        }
        setLoading(false)
      })

    }
  }

  return (
    <>
      <img src={logo} alt="Logo" style={{ marginTop: "1em" }} />
      <Switch>
        <Route exact path="/">
          <div className="App">
            {loading ?
              <>
                <p>Waiting for an opponent to connect</p>
                <br />
                <Spinner />
              </> :
              <>
                <label>Name:</label>
                <input ref={playerRef} type="text" />
                <select defaultValue="-1" ref={difficultyRef}>
                  <option value="-1" disabled >Select Difficulty</option>
                  <option value="0">Begginer</option>
                  <option value="1">Normal</option>
                  <option value="2">Hard</option>
                </select>
                <button onClick={startGame}>Start Game!</button>
              </>
            }
          </div>
        </Route>
        <Route exact path="/gameroom" >
          <GameRoom game={game} snakeService={snakeService} />
        </Route>
      </Switch>
    </>
  );
}


export default withRouter(App);
