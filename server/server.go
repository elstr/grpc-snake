package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"

	pb "github.com/elstr/grpc-snake/proto"
	"github.com/elstr/grpc-snake/server/matcher"
	"github.com/elstr/grpc-snake/server/shared"
)

const (
	port = ":9090"
)

type snakeServer struct {
	pb.UnimplementedSnakeServiceServer
	matcher matcher.Instance
}

func (*snakeServer) TestConnection(context context.Context, req *pb.TestRequest) (*pb.TestResponse, error) {
	fmt.Println("Got a new test connection request")
	msg := req.GetMessage()
	return &pb.TestResponse{Result: msg}, nil
}
func (s *snakeServer) StartNewGame(context context.Context, req *pb.NewGameRequest) (*pb.NewGameResponse, error) {
	fmt.Println("Got a new game request")
	playerData := req.GetPlayer()

	player := shared.NewPlayer(playerData.Id, playerData.Name)
	match := s.matcher.Match(&player)

	fmt.Println("StartNewGame - MATCH channel -", <-match)

	return nil, nil
}

func newServer() *snakeServer {
	s := &snakeServer{
		matcher:  matcher.Instanciate(),
		gameRoom: gameRoom.Instanciate(),
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
