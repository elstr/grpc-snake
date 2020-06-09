package main

import (
	"context"
	"fmt"
	"log"
	"net"

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
}

func (*snakeServer) TestConnection(context context.Context, req *pb.TestRequest) (*pb.TestResponse, error) {
	// fmt.Println("Got a new test connection request")
	msg := req.GetMessage()
	return &pb.TestResponse{Result: msg}, nil
}

func (s *snakeServer) StartNewGame(context context.Context, req *pb.NewGameRequest) (*pb.NewGameResponse, error) {
	// fmt.Println("Got a new game request")
	playerData := req.GetPlayer()
	player := helpers.NewPlayer(playerData.Id, playerData.Name)

	match := s.matcher.Match(&player) // This returns a channel
	playersMatched := <-match         // This takes the values of the channel so I can access them

	gameRoom, _ := s.gameRoom.NewGameRoom(*playersMatched.PlayerOne, *playersMatched.PlayerTwo)
	s.gameRoom.GameRooms[playerData.Id] = gameRoom

	res := &pb.NewGameResponse{Game: gameRoom}

	return res, nil
}

func (s *snakeServer) MoveSnake(context context.Context, req *pb.MoveRequest) (*pb.MoveResponse, error) {
	roomID := req.GetRoomId()
	snakeIdx := req.GetSnakeIdx()
	newSnakeBody := req.GetSnake()

	room := s.gameRoom.GameRooms[roomID]

	// update snake body
	snake := room.Snakes[snakeIdx]
	snake.Cells = newSnakeBody.Cells

	fmt.Println("MOVE REQUEST - nueva snake - ", snake)
	fmt.Println("")
	// update the gameroom with the new snake body
	room.Snakes[snakeIdx] = snake

	res := &pb.MoveResponse{IsValid: true}
	return res, nil
}

func (s *snakeServer) GetGameUpdates(req *pb.GameUpdateRequest, stream pb.SnakeService_GetGameUpdatesServer) error {
	roomID := req.GetRoomId()
	player := req.GetPlayer()
	updates := make(chan *pb.GameUpdateResponse)

	gameRoom := s.gameRoom.GameRooms[roomID]

	s.gameRoom.RunUpdates(gameRoom, player, 1, updates)
	// s.gameRoom.RunUpdates(roomID, player, 1, updates)

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
