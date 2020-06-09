package gameroom

import (
	"fmt"
	"sync"
	"time"

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

// RunUpdates start running the game updates (new food and opponents movements)
func (i *Instance) RunUpdates(gameRoom *pb.GameRoom, player *pb.Player, snakeIdx int, ch chan *pb.GameUpdateResponse) {
	go i.GetUpdates(gameRoom, player, snakeIdx, ch)
}

// func (i *Instance) RunUpdates(roomID string, player *pb.Player, snakeIdx int, ch chan *pb.GameUpdateResponse) {
// 	go i.GetUpdates(i.GameRooms[roomID], player, snakeIdx, ch)
// }

// GetUpdates feeds the channel with game updates
func (i *Instance) GetUpdates(gameRoom *pb.GameRoom, player *pb.Player, snakeIdx int, ch chan *pb.GameUpdateResponse) {
	// func (i *Instance) GetUpdates(gameRoom *pb.GameRoom, player *pb.Player, snakeIdx int, ch chan *pb.GameUpdateResponse) {
	// for gameRoom.State == pb.State_PLAYING {
	for {
		scores := []int32{10, 10}             // missing: score logic
		fruit := &pb.Coordinate{X: 20, Y: 20} // randomize

		fmt.Println("gameRoom.Snakes[0]", gameRoom.Snakes[0])
		fmt.Println("gameRoom.Snakes[1]", gameRoom.Snakes[1])

		update := &pb.GameUpdateResponse{
			Scores: scores,
			Fruit:  fruit,
			Snakes: gameRoom.Snakes,
			State:  pb.State_PLAYING,
		}

		time.Sleep(1 * time.Second)
		select {
		case ch <- update:
		}

	}

}
