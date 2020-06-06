package helpers

import (
	pb "github.com/elstr/grpc-snake/proto"
)

func generateSnakeBody(snake *pb.Snake, X int32, Y int32) {
	for i := 0; i < 5; i++ {
		snake.Cells = append(snake.Cells, &pb.Coordinate{X: X, Y: (Y + int32(i))})
	}
}

// CreateInitialSnakes returns the initial snake for each player
func CreateInitialSnakes(width, height int32) (*pb.Snake, *pb.Snake) {
	snakeOne := &pb.Snake{}
	snakeTwo := &pb.Snake{}

	snakeOne.Dir = pb.Direction_UP
	snakeTwo.Dir = pb.Direction_UP

	snakeOneHead := &pb.Coordinate{}
	snakeTwoHead := &pb.Coordinate{}

	snakeOneHead.X = int32(width / 4)
	snakeTwoHead.X = int32((width * 3) / 4)

	snakeOneHead.Y = int32(height/2) - 4 // Head needs start from low to high, otherwise the frontend sees it upside down head/tail
	snakeTwoHead.Y = int32(snakeOneHead.Y)

	generateSnakeBody(snakeOne, snakeOneHead.X, snakeOneHead.Y)
	generateSnakeBody(snakeTwo, snakeTwoHead.X, snakeTwoHead.Y)

	return snakeOne, snakeTwo
}
