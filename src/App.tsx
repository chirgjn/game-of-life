import "./styles.css";
import React from "react";
import useGame from "./common/hooks/useGame";

import type { Tile } from "./common/hooks/useGame";

const defaultSpeed = 300;
const gridSize = 38;

function updateCell(
  tiles: Tile[][],
  position: { row: number; column: number }
) {
  const newTiles = [...tiles];
  newTiles[position.row] = [...newTiles[position.row]];
  newTiles[position.row][position.column] = newTiles[position.row][
    position.column
  ]
    ? 0
    : 1;
  return newTiles;
}

function clearCells() {
  return Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));
}

function randomCells() {
  return Array(gridSize)
    .fill(null)
    .map(() =>
      Array(gridSize)
        .fill(0)
        .map((x) => (Math.random() > 0.6 ? 1 : 0))
    );
}

const initialState = randomCells();
export default function App() {
  const [speed, setSpeed] = React.useState<number | null>(null);
  const oldSpeedRef = React.useRef(speed);
  const [tiles, setTiles] = React.useState(initialState);
  const { grid } = useGame({ speed, initialState: tiles });
  return (
    <div className="App">
      <div className="board">
        {grid.map((row, i) => (
          <div className="row" key={i}>
            {row.map((cell, j) => (
              <div
                key={j}
                className={`cell ${cell ? "live" : ""}`}
                onClick={() =>
                  setTiles(updateCell(grid, { row: i, column: j }))
                }
              />
            ))}
          </div>
        ))}
      </div>
      <div>
        <span>Speed:</span>
        <input
          type="number"
          min="0"
          step="100"
          max="1000"
          value={`${speed || oldSpeedRef.current || defaultSpeed}`}
          onChange={(e) => {
            const newSpeed = Number.parseInt(e.target.value, 10);
            oldSpeedRef.current = speed;
            if (Number.isNaN(newSpeed)) {
              setSpeed(null);
            } else {
              setSpeed(newSpeed);
            }
          }}
        />
        <button
          onClick={() => {
            const { current: oldSpeed } = oldSpeedRef;
            oldSpeedRef.current = speed;

            if (speed === null) {
              if (oldSpeed === null) {
                setSpeed(defaultSpeed);
              } else {
                setSpeed(oldSpeed);
              }
            } else {
              setSpeed(null);
            }
          }}
        >
          {speed === null ? "Start" : "Stop"}
        </button>
        <button
          onClick={() => {
            setTiles(clearCells());
            setSpeed(null);
          }}
        >
          Clear
        </button>
        <button
          onClick={() => {
            setTiles(randomCells());
            setSpeed(null);
          }}
        >
          Random
        </button>
      </div>
    </div>
  );
}
