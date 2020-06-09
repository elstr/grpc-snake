package helpers

import (
	"math/rand"
	"time"

	pb "github.com/elstr/grpc-snake/proto"
)

// GetNewRandomFoodCoords returns a new Coordinate (x, y)
func GetNewRandomFoodCoords(boardWidth, boardHeight int32) *pb.Coordinate {
	rand.Seed(time.Now().UnixNano())
	return &pb.Coordinate{
		X: int32(rand.Intn(int(boardWidth - 1))),
		Y: int32(rand.Intn(int(boardHeight - 1))),
	}
}
