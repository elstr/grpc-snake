const DIRECTION_TICKS = {
    UP: (x, y) => ([x, y-1]),
    DOWN: (x, y) => ([ x, y + 1 ]),
    RIGHT: (x, y) => ([ x + 1, y ]),
    LEFT: (x, y) => ([ x - 1, y ]),
  };
const KEY_CODES_MAPPER = {
    38: 'UP',
    39: 'RIGHT',
    37: 'LEFT',
    40: 'DOWN',
};
const DIRECTIONS = {
    UP: 'UP',
    DOWN: 'DOWN',
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
  };

const DIRECTION_MAPPER = {
  UP: 0,
  DOWN: 1,
  LEFT: 4,
  RIGHT: 3,
}
  

export {
    DIRECTIONS,
    DIRECTION_TICKS,
    DIRECTION_MAPPER,
    KEY_CODES_MAPPER
}