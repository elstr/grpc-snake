const DIRECTION_TICKS = {
    UP: (x, y) => ([x, y-1]),
    BOTTOM: (x, y) => ([ x, y + 1 ]),
    RIGHT: (x, y) => ([ x + 1, y ]),
    LEFT: (x, y) => ([ x - 1, y ]),
  };
const KEY_CODES_MAPPER = {
    38: 'UP',
    39: 'RIGHT',
    37: 'LEFT',
    40: 'BOTTOM',
};
const DIRECTIONS = {
    UP: 'UP',
    BOTTOM: 'BOTTOM',
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
  };
  
  

export {
    DIRECTIONS,
    DIRECTION_TICKS,
    KEY_CODES_MAPPER
}