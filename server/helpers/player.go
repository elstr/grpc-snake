package helpers

// Player structure
type Player struct {
	ID   string
	Name string
}

// NewPlayer returns an actual player with the given data
func NewPlayer(id string, name string) Player {
	return Player{ID: id, Name: name}
}
