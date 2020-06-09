package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"sync"

	"google.golang.org/grpc"

	pb "github.com/elstr/grpc-snake/proto"
	"github.com/elstr/grpc-snake/server/gameroom"
	helpers "github.com/elstr/grpc-snake/server/helpers"
	"github.com/elstr/grpc-snake/server/matcher"
)

const (
	port = ":9090"
)

type snakeServer struct {
	pb.UnimplementedSnakeServiceServer
	matcher  matcher.Instance
	gameRoom gameroom.Instance
	mu       sync.Mutex
}

func (*snakeServer) TestConnection(context context.Context, req *pb.TestRequest) (*pb.TestResponse, error) {
	// fmt.Println("Got a new test connection request")
	msg := req.GetMessage()
	return &pb.TestResponse{Result: msg}, nil
}

func (s *snakeServer) StartNewGame(context context.Context, req *pb.NewGameRequest) (*pb.NewGameResponse, error) {
	playerData := req.GetPlayer()
	fmt.Println("playerData", playerData)
	player := helpers.NewPlayer(playerData.Id, playerData.Name)

	match := s.matcher.Match(&player) // This returns a channel
	playersMatched := <-match         // This takes the values of the channel so I can access them

	// 1. lock the function to be able to create a gameroom with the specified match id
	s.mu.Lock()
	defer s.mu.Unlock()

	// 2. if the game room does not exist, we create a new one with both players and the matchID (playersMatched.ID)
	gameRoom, exists := s.gameRoom.GameRooms[playersMatched.ID]
	if !exists {
		gameRoom, _ = s.gameRoom.NewGameRoom(playersMatched.ID, *playersMatched.PlayerOne, *playersMatched.PlayerTwo)
		// 3. save the gameroom in our collection with the matchID as key
		s.gameRoom.GameRooms[playersMatched.ID] = gameRoom
	}
	// 4. return the gameroom that both players will be updating
	return &pb.NewGameResponse{Game: gameRoom}, nil
}

func (s *snakeServer) MoveSnake(context context.Context, req *pb.MoveRequest) (*pb.MoveResponse, error) {
	roomID := req.GetRoomId()
	snakeIdx := req.GetSnakeIdx()
	newSnakeBody := req.GetSnake()

	// 1. get the game room to be updated
	room := s.gameRoom.GameRooms[roomID]

	// 2. update snake body
	snake := room.Snakes[snakeIdx]
	snake.Cells = newSnakeBody.Cells

	// 3. update the gameroom with the new snake body
	room.Snakes[snakeIdx] = snake

	return &pb.MoveResponse{IsValid: true}, nil
}

func (s *snakeServer) GetGameUpdates(req *pb.GameUpdateRequest, stream pb.SnakeService_GetGameUpdatesServer) error {
	roomID := req.GetRoomId()
	fmt.Println(roomID)
	player := req.GetPlayer()
	updates := make(chan *pb.GameUpdateResponse)

	gameRoom := s.gameRoom.GameRooms[roomID]
	var snakeIdx int = 0
	for i, p := range gameRoom.Players {
		if p.Id == player.Id {
			snakeIdx = i
		}
	}
	s.gameRoom.RunUpdates(gameRoom, player, snakeIdx, updates)

	for {
		select {
		case update := <-updates:
			err := stream.Send(update)
			if err != nil {
				fmt.Println(err)
			}
		}
	}

}

func newServer() *snakeServer {
	s := &snakeServer{
		matcher:  matcher.Instanciate(),
		gameRoom: gameroom.Instanciate(),
	}
	return s
}

func main() {
	fmt.Println("Snake server running")
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	var opts []grpc.ServerOption
	grpcServer := grpc.NewServer(opts...)
	pb.RegisterSnakeServiceServer(grpcServer, newServer())
	grpcServer.Serve(lis)
}
