/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./snake_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.SnakeServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.SnakeServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.NewGameRequest,
 *   !proto.NewGameResponse>}
 */
const methodDescriptor_SnakeService_StartNewGame = new grpc.web.MethodDescriptor(
  '/SnakeService/StartNewGame',
  grpc.web.MethodType.UNARY,
  proto.NewGameRequest,
  proto.NewGameResponse,
  /**
   * @param {!proto.NewGameRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.NewGameResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.NewGameRequest,
 *   !proto.NewGameResponse>}
 */
const methodInfo_SnakeService_StartNewGame = new grpc.web.AbstractClientBase.MethodInfo(
  proto.NewGameResponse,
  /**
   * @param {!proto.NewGameRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.NewGameResponse.deserializeBinary
);


/**
 * @param {!proto.NewGameRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.NewGameResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.NewGameResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.SnakeServiceClient.prototype.startNewGame =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/SnakeService/StartNewGame',
      request,
      metadata || {},
      methodDescriptor_SnakeService_StartNewGame,
      callback);
};


/**
 * @param {!proto.NewGameRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.NewGameResponse>}
 *     A native promise that resolves to the response
 */
proto.SnakeServicePromiseClient.prototype.startNewGame =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/SnakeService/StartNewGame',
      request,
      metadata || {},
      methodDescriptor_SnakeService_StartNewGame);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.MoveRequest,
 *   !proto.MoveResponse>}
 */
const methodDescriptor_SnakeService_MoveSnake = new grpc.web.MethodDescriptor(
  '/SnakeService/MoveSnake',
  grpc.web.MethodType.UNARY,
  proto.MoveRequest,
  proto.MoveResponse,
  /**
   * @param {!proto.MoveRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.MoveResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.MoveRequest,
 *   !proto.MoveResponse>}
 */
const methodInfo_SnakeService_MoveSnake = new grpc.web.AbstractClientBase.MethodInfo(
  proto.MoveResponse,
  /**
   * @param {!proto.MoveRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.MoveResponse.deserializeBinary
);


/**
 * @param {!proto.MoveRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.MoveResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.MoveResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.SnakeServiceClient.prototype.moveSnake =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/SnakeService/MoveSnake',
      request,
      metadata || {},
      methodDescriptor_SnakeService_MoveSnake,
      callback);
};


/**
 * @param {!proto.MoveRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.MoveResponse>}
 *     A native promise that resolves to the response
 */
proto.SnakeServicePromiseClient.prototype.moveSnake =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/SnakeService/MoveSnake',
      request,
      metadata || {},
      methodDescriptor_SnakeService_MoveSnake);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.GameUpdateRequest,
 *   !proto.GameUpdateResponse>}
 */
const methodDescriptor_SnakeService_GetGameUpdates = new grpc.web.MethodDescriptor(
  '/SnakeService/GetGameUpdates',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.GameUpdateRequest,
  proto.GameUpdateResponse,
  /**
   * @param {!proto.GameUpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GameUpdateResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.GameUpdateRequest,
 *   !proto.GameUpdateResponse>}
 */
const methodInfo_SnakeService_GetGameUpdates = new grpc.web.AbstractClientBase.MethodInfo(
  proto.GameUpdateResponse,
  /**
   * @param {!proto.GameUpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GameUpdateResponse.deserializeBinary
);


/**
 * @param {!proto.GameUpdateRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.GameUpdateResponse>}
 *     The XHR Node Readable Stream
 */
proto.SnakeServiceClient.prototype.getGameUpdates =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/SnakeService/GetGameUpdates',
      request,
      metadata || {},
      methodDescriptor_SnakeService_GetGameUpdates);
};


/**
 * @param {!proto.GameUpdateRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.GameUpdateResponse>}
 *     The XHR Node Readable Stream
 */
proto.SnakeServicePromiseClient.prototype.getGameUpdates =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/SnakeService/GetGameUpdates',
      request,
      metadata || {},
      methodDescriptor_SnakeService_GetGameUpdates);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.FinishGameRequest,
 *   !proto.GameUpdateResponse>}
 */
const methodDescriptor_SnakeService_FinishGame = new grpc.web.MethodDescriptor(
  '/SnakeService/FinishGame',
  grpc.web.MethodType.UNARY,
  proto.FinishGameRequest,
  proto.GameUpdateResponse,
  /**
   * @param {!proto.FinishGameRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GameUpdateResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.FinishGameRequest,
 *   !proto.GameUpdateResponse>}
 */
const methodInfo_SnakeService_FinishGame = new grpc.web.AbstractClientBase.MethodInfo(
  proto.GameUpdateResponse,
  /**
   * @param {!proto.FinishGameRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GameUpdateResponse.deserializeBinary
);


/**
 * @param {!proto.FinishGameRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.GameUpdateResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.GameUpdateResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.SnakeServiceClient.prototype.finishGame =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/SnakeService/FinishGame',
      request,
      metadata || {},
      methodDescriptor_SnakeService_FinishGame,
      callback);
};


/**
 * @param {!proto.FinishGameRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.GameUpdateResponse>}
 *     A native promise that resolves to the response
 */
proto.SnakeServicePromiseClient.prototype.finishGame =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/SnakeService/FinishGame',
      request,
      metadata || {},
      methodDescriptor_SnakeService_FinishGame);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.TestRequest,
 *   !proto.TestResponse>}
 */
const methodDescriptor_SnakeService_TestConnection = new grpc.web.MethodDescriptor(
  '/SnakeService/TestConnection',
  grpc.web.MethodType.UNARY,
  proto.TestRequest,
  proto.TestResponse,
  /**
   * @param {!proto.TestRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.TestResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.TestRequest,
 *   !proto.TestResponse>}
 */
const methodInfo_SnakeService_TestConnection = new grpc.web.AbstractClientBase.MethodInfo(
  proto.TestResponse,
  /**
   * @param {!proto.TestRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.TestResponse.deserializeBinary
);


/**
 * @param {!proto.TestRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.TestResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.TestResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.SnakeServiceClient.prototype.testConnection =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/SnakeService/TestConnection',
      request,
      metadata || {},
      methodDescriptor_SnakeService_TestConnection,
      callback);
};


/**
 * @param {!proto.TestRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.TestResponse>}
 *     A native promise that resolves to the response
 */
proto.SnakeServicePromiseClient.prototype.testConnection =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/SnakeService/TestConnection',
      request,
      metadata || {},
      methodDescriptor_SnakeService_TestConnection);
};


module.exports = proto;

