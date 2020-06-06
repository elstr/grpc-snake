import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import logo from './assets/logo.png';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";

import Spinner from "./components/Spinner";
import GameRoom from "./pages/GameRoom"

import { TestRequest, NewGameRequest, Player } from './snake_pb.js'
import { SnakeServiceClient } from "./snake_grpc_web_pb"

const App = (props) => {
  const playerRef = useRef(null);
  const difficultyRef = useRef(null);
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [game, setGame] = useState()
  const [player, setPlayer] = useState()
  const [difficulty, setDifficulty] = useState()

  const snake = new SnakeServiceClient('http://' + window.location.hostname + ':8080', null, null);

  useEffect(() => {
    const req = new TestRequest()
    req.setMessage("test connection request")
    snake.testConnection(req, {}, (err, _) => {
      if (err) setError(true)
    })
  }, [])

  const startGame = () => {
    if (!error) {
      const gameRequest = new NewGameRequest()
      const playerName = playerRef.current.value
      const selectedDiff = difficultyRef.current.value

      const player = new Player()
      player.setId(uuidv4());
      player.setName(playerName)

      setLoading(true)
      setPlayer(player)
      setDifficulty(selectedDiff)

      gameRequest.setPlayer(player)
      gameRequest.setDif(selectedDiff)


      snake.startNewGame(gameRequest, {}, async (err, gameRoom) => {
        if (err) setError(true)
        else {
          console.log({gameRoom})
          setGame(gameRoom)
          props.history.push("/gameroom")
        }
        setLoading(false)
      })

    }
  }

  return (
    <>
      <img src={logo} alt="Logo" style={{marginTop: "1em"}}/>
      <Switch>

        <Route exact path="/">
          <div className="App">
            {loading ?
              <>
                <p>Waiting for an opponent to connect</p>
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
          <GameRoom game={game} />
        </Route>
      </Switch>
    </>
  );
}


export default withRouter(App);
