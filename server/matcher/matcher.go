package matcher

import (
	"fmt"

	"github.com/elstr/grpc-snake/server/shared"
)

// Match struct will hold to the players
type Match struct {
	PlayerOne *shared.Player
	PlayerTwo *shared.Player
}

// Instance enables you to use a Match instance
// I need channels to be able to push values => channels act like queues
type Instance struct {
	matched        chan *Match // this is the actual match of 2 players
	waitingPlayers chan *Match // this will hold the player waiting for a match
}

// Instanciate returns an "instance" of match with a buffed channel with 2, one for each player
// and a waitingPlayers channel buffed 1
func Instanciate() Instance {
	return Instance{matched: make(chan *Match, 2), waitingPlayers: make(chan *Match)}
}

// Match will make the match between two players
func (i *Instance) Match(player *shared.Player) chan *Match {
	fmt.Println("Match service - player: ", *player)

	// https://www.opsdash.com/blog/job-queues-in-go.html
	select {
	case waitingPlayers := <-i.waitingPlayers: // I'm draining the waitingPlayers channel and checking the case

		// Assign the 2nd player to waitingPlayers
		waitingPlayers.PlayerTwo = player

		// I need to assign twice waitingPlayers to matched because it's going to be consumed by two players
		i.matched <- waitingPlayers
		i.matched <- waitingPlayers

	default:
		fmt.Println("entra en waiting porque entra en default")
		i.waitingPlayers <- &Match{PlayerOne: player}
	}

	return i.matched
}
