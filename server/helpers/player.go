package helpers

// Player structure
type Player struct {
	ID   string
	Name string
}

// NewPlayer returns an actual player with the given data
func NewPlayer(name string, id string) Player {
	return Player{Name: name, ID: id}
}
