package gameroom

import (
	"fmt"

	pb "github.com/elstr/grpc-snake/proto"
	helpers "github.com/elstr/grpc-snake/server/helpers"
	"github.com/google/uuid"
)

// GameRoom is a representation of a game with 2 players, board configuration, etc
type GameRoom struct {
	roomID     string
	players    []*helpers.Player
	board      *pb.BoardConfig
	snakes     []*pb.Snake
	speed      int32
	difficulty pb.Difficulty
	state      *pb.State
}

// Instance enables you to use a GameRoom instance that handles many gamerooms
type Instance struct {
	// hashtable by id => map[KeyType]ValueType
	gameRooms map[string]*GameRoom
}

// Instanciate returns an "instance" of a gameroom service
// gameroom service can handle many gamerooms
func Instanciate() Instance {
	return Instance{gameRooms: make(map[string]*GameRoom)}
}

// NewGameRoom returns a new game room with two players ready to play
func (i *Instance) NewGameRoom(playerOne helpers.Player, playerTwo helpers.Player) (*pb.GameRoom, error) {
	// fmt.Println("new game room - player one", playerOne)
	// fmt.Println("new game room - player two", playerTwo)

	food := []*pb.Coordinate{
		{X: 10, Y: 21},
	}
	board := &pb.BoardConfig{
		Width:  35,
		Height: 35,
		Food:   food,
	}

	players := []*pb.Player{{Id: playerOne.ID, Name: playerOne.Name}, {Id: playerOne.ID, Name: playerOne.Name}}

	snakeOne, snakeTwo := helpers.CreateInitialSnakes(board.Width, board.Height)
	snakes := []*pb.Snake{snakeOne, snakeTwo}
	roomID := uuid.New().String()

	fmt.Println(snakes)
	return &pb.GameRoom{
		RoomId:  roomID,
		Players: players,
		Board:   board,
		Snakes:  snakes,
		Speed:   10,
		Dif:     pb.Difficulty_EASY,
		State:   pb.State_BEGIN,
	}, nil
}
