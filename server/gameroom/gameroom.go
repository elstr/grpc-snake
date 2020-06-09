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
func (i *Instance) NewGameRoom(gameRoomID string, playerOne helpers.Player, playerTwo helpers.Player) (*pb.GameRoom, error) {
	food := []*pb.Coordinate{
		{X: 8, Y: 20},
	}
	board := &pb.BoardConfig{
		Width:  35,
		Height: 35,
		Food:   food,
	}

	players := []*pb.Player{{Id: playerOne.ID, Name: playerOne.Name}, {Id: playerTwo.ID, Name: playerTwo.Name}}

	snakeOne, snakeTwo := helpers.CreateInitialSnakes(board.Width, board.Height)
	snakes := []*pb.Snake{snakeOne, snakeTwo}

	newGame := &pb.GameRoom{
		RoomId:  gameRoomID,
		Players: players,
		Board:   board,
		Snakes:  snakes,
		Speed:   10,
		Dif:     pb.Difficulty_EASY,
		State:   pb.State_BEGIN,
	}

	i.GameRooms[players[0].Id] = newGame
	i.GameRooms[players[1].Id] = newGame

	return newGame, nil
}

// RunUpdates start running the game updates (new food and opponents movements)
func (i *Instance) RunUpdates(gameRoom *pb.GameRoom, player *pb.Player, snakeIdx int, ch chan *pb.GameUpdateResponse) {
	go i.GetUpdates(gameRoom, player, snakeIdx, ch)
}

// GetUpdates feeds the channel with game updates
func (i *Instance) GetUpdates(gameRoom *pb.GameRoom, player *pb.Player, snakeIdx int, ch chan *pb.GameUpdateResponse) {
	for {
		scores := []int32{10, 10}
		foodCoords := gameRoom.Board.Food[0]
		snakeHead := gameRoom.Snakes[snakeIdx].Cells[0]

		fmt.Println("snakeHead", snakeHead)
		fmt.Println("foodCoords X:", foodCoords.X, " Y: ", foodCoords.Y)
		// 1. validate if snake ate the food
		var newFood *pb.Coordinate = foodCoords
		if snakeHead.X == foodCoords.X && snakeHead.Y == foodCoords.Y {
			// 2. get new random coords for food
			newFood = helpers.GetNewRandomFoodCoords(gameRoom.Board.Width, gameRoom.Board.Height)
			gameRoom.Board.Food[0] = newFood
		}

		update := &pb.GameUpdateResponse{
			Scores: scores,
			Fruit:  newFood,
			Snakes: gameRoom.Snakes,
			State:  pb.State_PLAYING,
		}

		time.Sleep(300 * time.Millisecond)
		select {
		case ch <- update:
		}

	}

}
