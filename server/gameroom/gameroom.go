package gameroom

import (
	"fmt"
	"sync"

	pb "github.com/elstr/grpc-snake/proto"
	helpers "github.com/elstr/grpc-snake/server/helpers"
)

// Instance enables you to use a GameRoom instance that handles many gamerooms
type Instance struct {
	// hashtable by id => map[KeyType]ValueType
	GameRooms map[string]*pb.GameRoom
	Updates   chan pb.GameUpdateResponse
	mux       sync.Mutex
}

// Instanciate returns an "instance" of a gameroom service
// gameroom service can handle many gamerooms
func Instanciate() Instance {
	return Instance{GameRooms: make(map[string]*pb.GameRoom)}
}

// NewGameRoom returns a new game room with two players ready to play
func (i *Instance) NewGameRoom(playerOne helpers.Player, playerTwo helpers.Player) (*pb.GameRoom, error) {
	food := []*pb.Coordinate{
		{X: 10, Y: 21},
	}
	board := &pb.BoardConfig{
		Width:  35,
		Height: 35,
		Food:   food,
	}

	players := []*pb.Player{{Id: playerOne.ID, Name: playerOne.Name}, {Id: playerTwo.ID, Name: playerTwo.Name}}

	snakeOne, snakeTwo := helpers.CreateInitialSnakes(board.Width, board.Height)
	snakes := []*pb.Snake{snakeOne, snakeTwo}

	// this sets twice the roomID, with different uuid values
	// roomID := uuid.New().String()

	newGame := &pb.GameRoom{
		Players: players,
		Board:   board,
		Snakes:  snakes,
		Speed:   10,
		Dif:     pb.Difficulty_EASY,
		State:   pb.State_BEGIN,
	}

	i.GameRooms[players[0].Id] = newGame
	i.GameRooms[players[1].Id] = newGame

	// fmt.Println(i.GameRooms)

	return newGame, nil
}

// GetGameUpdates returns the game updates (new food and opponents movements)
func (i *Instance) GetGameUpdates(roomID string, player *pb.Player, snakeIdx int) (chan pb.GameUpdateResponse, error) {
	// chan pb.GameUpdateResponse will return all updates
	// 1. fill the channel with the updates
	// 2. return the channel and iterate in the server
	// An external goroutine will push events to this channel as they come
	gameRoom := i.GameRooms[roomID]
	go i.GetUpdates(gameRoom, player, snakeIdx)
	return i.Updates, nil
}

// GetUpdates will be called as a goroutine that will feed the channel
func (i *Instance) GetUpdates(gameRoom *pb.GameRoom, player *pb.Player, snakeIdx int) {
	// for gameRoom.State == pb.State_PLAYING {
	for {
		scores := []int32{10, 10}             // missing: score logic
		fruit := &pb.Coordinate{X: 20, Y: 20} // randomize

		update := pb.GameUpdateResponse{
			Scores: scores,
			Fruit:  fruit,
			Snakes: gameRoom.Snakes,
			State:  pb.State_PLAYING,
		}

		fmt.Println("update - ", update)

		// time.Sleep(100 * time.Millisecond)

		end := false
		for !end {
			select {
			case i.Updates <- update:
				end = true
			default:
				fmt.Println("estoy bloqueado en el buffer")
			}
		}

	}

}
