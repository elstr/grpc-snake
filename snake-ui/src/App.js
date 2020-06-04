import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TestRequest, NewGameRequest, Player } from './snake_pb.js'
import { SnakeServiceClient } from "./snake_grpc_web_pb"

const App = () => {
  const playerRef = useRef(null);
  const difficultyRef = useRef(null);
  const [connErr, setConnError] = useState(false)
  
  const [game, setGame] = useState()
  const [player, setPlayer] = useState()
  const [difficulty, setDifficulty] = useState()
  
  const snake = new SnakeServiceClient('http://' + window.location.hostname + ':8080', null, null);

  useEffect( () => {
      const req = new TestRequest()
      req.setMessage("test connection request")
      snake.testConnection(req, {}, (err, _) => {
        if(err) setConnError(true)
      })
  }, [])

  const startGame = () => {
    if(!connErr) {
      const gameRequest = new NewGameRequest()
      const playerName = playerRef.current.value
      const selectedDiff = difficultyRef.current.value

      const player = new Player()
      player.setId(uuidv4());
      player.setName(playerName)

      setPlayer(player)
      setDifficulty(selectedDiff)

      gameRequest.setPlayer(player)
      gameRequest.setDif(selectedDiff)
      
      snake.startNewGame(gameRequest, {}, (err, res) => {
        console.log({err})
        console.log({res})
      })

    }
  }

  return (
    <div className="App">
      <label>Name:</label>
      <input ref={playerRef} type="text"  />
      <select defaultValue="-1" ref={difficultyRef}>
        <option value="-1" disabled >Select Difficulty</option>
        <option value="0">Slug</option>
        <option value="1">Worm</option>
        <option value="2">Python</option>
      </select>
      <button onClick={startGame}>Start Game!</button>
    </div>
  );
}

export default App;
