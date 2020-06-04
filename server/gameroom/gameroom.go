package gameroom

// todo: maybe moove this to shared?
// =========================
type BoardConfig struct {
}

type Snake struct {
}

type Difficulty struct {
}

type State struct {
}

// =========================

// GameRoom is a representation of a game with 2 players, board configuration, etc
type GameRoom struct {
	// from proto
	// 	string roomId
	// 	shared.Player playerOne
	// 	shared.Player playerTwo
	// BoardConfig board
	//  Snake snakes
	// int32 speed
	// Difficulty dif
	// State state
}

// Instance enables you to use a GameRoom instance
type Instance struct {
	gameRoom *GameRoom
}

// Instanciate returns an "instance" of a gameroom with a game/board configuration
func Instanciate() Instance {
	return Instance{}
}
