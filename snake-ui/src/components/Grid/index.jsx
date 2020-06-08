import React from "react"

import "./styles.css"

import { getCellCs } from "../../helpers/utils"

const Grid = ({ isGameOver, snakes, food, grid, gridSize, snakeIdx }) => (
    <div>
      {grid.map(y => (
        <Row
          y={y}
          key={y}
          food={food}
          grid={grid}
          // snack={snack}
          snakes={snakes}
          snakeIdx={snakeIdx}
          gridSize={gridSize}
          isGameOver={isGameOver}
        />
      ))}
    </div>
  );
  
  const Row = ({ grid, isGameOver, snakes, food, y, gridSize, snakeIdx }) => {
    return (
      <div className="grid-row">
        {grid.map(x => (
          <Cell
            x={x}
            y={y}
            key={x}
            food={food}
            // snack={snack}
            snakes={snakes}
            snakeIdx={snakeIdx}
            gridSize={gridSize}
            isGameOver={isGameOver}
          />
        ))}
      </div>
    )
  };
  
  const Cell = ({ isGameOver, snakes, food, x, y, gridSize, snakeIdx }) => (
    <div className={getCellCs(isGameOver, snakes, food, x, y, gridSize, snakeIdx)} />
  );

export default Grid