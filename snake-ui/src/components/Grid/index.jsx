import React from "react"

import "./styles.css"

import { getCellCs } from "../../helpers/utils"

const Grid = ({ isGameOver, snakes, snack, grid, gridSize }) => (
    <div>
      {grid.map(y => (
        <Row
          y={y}
          key={y}
          grid={grid}
          snack={snack}
          snakes={snakes}
          gridSize={gridSize}
          isGameOver={isGameOver}
        />
      ))}
    </div>
  );
  
  const Row = ({ grid, isGameOver, snakes, snack, y, gridSize }) => {
    return (
      <div className="grid-row">
        {grid.map(x => (
          <Cell
            x={x}
            y={y}
            key={x}
            snack={snack}
            snakes={snakes}
            gridSize={gridSize}
            isGameOver={isGameOver}
          />
        ))}
      </div>
    )
  };
  
  const Cell = ({ isGameOver, snakes, snack, x, y, gridSize }) => (
    <div className={getCellCs(isGameOver, snakes, snack, x, y, gridSize)} />
  );

export default Grid