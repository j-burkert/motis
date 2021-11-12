import React, { useState } from "react";
import { PaxMonEdgeLoadInfoWithStats } from "../data/loadInfo";

type barProps = {
  width: number;
  height: number;
  maxVal: number;
  edge: PaxMonEdgeLoadInfoWithStats;
};

function Bar({width, height, maxVal, edge} : barProps): JSX.Element {

  const greenX = 0;
  const greenWidth = 0.5 * 0.8 * width;
  const yellowX = greenX + greenWidth;
  const yellowWidth = 0.5 * 0.2 * width;
  const redX = yellowX + yellowWidth;
  const redWidth = 0.5 * width;

  return(
    <svg>
      <rect
        x={greenX}
        y="0"
        width={greenWidth}
        height={height}
        stroke="#DDD"
        fill="#D4FFCA"
      />
      <rect
        x={redX}
        y="0"
        width={redWidth}
        height={height}
        stroke="#DDD"
        fill="#FFCACA"
      />
      <rect
        x={yellowX}
        y="0"
        width={yellowWidth}
        height={height}
        stroke="#DDD"
        fill="#FFF3CA"
      />

      <path stroke-width="3" stroke="blue" d={`M ${edge.expected_passengers / edge.capacity * 0.5 * width} 0 V ${height}`}/>
      <path stroke-width="3" stroke="blue" d={`M ${edge.q_50 / edge.capacity * 0.5 * width} 0 V ${height}`}/>
    </svg>
  );
}

export default Bar;