import React from "react";
import useInterval from "./useInterval";

export type Tile = 0 | 1;
const reducer = (
  state: Tile[][],
  action: { type: "next" } | { type: "set"; newState: typeof state }
): Tile[][] => {
  if (action && action.type === "set") {
    return action.newState;
  }
  const numRows = state.length;
  const numCols = state[0].length;
  return state.map((row, i) => {
    return row.map((x, j) => {
      const left = j === 0 ? numCols - 1 : j - 1;
      const up = i === 0 ? numRows - 1 : i - 1;
      const right = j === numCols - 1 ? 0 : j + 1;
      const down = i === numRows - 1 ? 0 : i + 1;
      const liveCount = [
        state[up][left],
        state[up][j],
        state[up][right],
        state[i][right],
        state[down][right],
        state[down][j],
        state[down][left],
        state[i][left]
      ].reduce((prev: number, current) => {
        if (current === 1) return prev + 1;
        return prev;
      }, 0);

      switch (liveCount) {
        case 3:
          return 1;
        case 2:
          return x;
        default:
          return 0;
      }
    });
  });
};

export default function useGame({
  speed,
  initialState
}: {
  speed: number | null;
  initialState: Tile[][];
}) {
  const oldInitialStateRef = React.useRef(initialState);
  const [grid, dispatch] = React.useReducer(reducer, initialState);

  if (oldInitialStateRef.current !== initialState) {
    oldInitialStateRef.current = initialState;
    dispatch({ type: "set", newState: initialState });
  }

  let interval = speed;
  if (speed !== null) {
    interval = 150 - speed / 10;
  }

  // game loop
  useInterval(() => {
    dispatch({ type: "next" });
  }, interval);

  return { grid };
}
