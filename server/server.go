package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"

	pb "github.com/elstr/grpc-snake/proto"
)

const (
	port = ":9090"
)

type snakeServer struct {
	pb.UnimplementedSnakeServiceServer
}

func (*snakeServer) TestConnection(context context.Context, req *pb.TestRequest) (*pb.TestResponse, error) {
	fmt.Println("Got a new test connection request")
	msg := req.GetMessage()
	fmt.Println(msg)

	return nil, nil
}

func newServer() *snakeServer {
	s := &snakeServer{}
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
