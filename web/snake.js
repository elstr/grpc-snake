'use strict';
const {TestRequest} = require('./snake_pb.js');
const {SnakeServiceClient} = require('./snake_grpc_web_pb.js');

function main() {
    const snake =  new SnakeServiceClient('http://' + window.location.hostname + ':8080', null, null);
    const req = new TestRequest()
    req.setMessage("this is a test")
    snake.testConnection(req, {}, (err, res) => {
      console.log({err})
      console.log({res})
    })
}

main();