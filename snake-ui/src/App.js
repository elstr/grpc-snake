import React from 'react';
import logo from './logo.svg';
import './App.css';
const {TestRequest} = require('./snake_pb.js');
const {SnakeServiceClient} = require('./snake_grpc_web_pb.js');

function App() {
  const snake =  new SnakeServiceClient('http://' + window.location.hostname + ':8080', null, null);
  const req = new TestRequest()
  req.setMessage("this is a test")
  snake.testConnection(req, {}, (err, res) => {
    console.log({err})
    console.log({res})
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
