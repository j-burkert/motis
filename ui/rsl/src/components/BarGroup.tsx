import React, { useState } from "react";
import ChartStats from "./ChartStats";
import ChartTimeline from "./ChartTimeline";
import Bar from "./Bar";
import { PaxMonEdgeLoadInfoWithStats } from "../data/loadInfo";

import { formatTime } from "../util/dateFormat";

type barGroupProps = {
  barGroupWidth: number;
  barGroupHeight: number;
  edge: PaxMonEdgeLoadInfoWithStats;
  id: number;
  maxVal: number;
};

function BarGroup({ barGroupWidth, barGroupHeight, edge, id, maxVal }: barGroupProps): JSX.Element {
  let barPadding = 2
  let yMid = barGroupHeight * 0.5

  return(
    <svg>
      <g transform={`translate(300, 0)`}>
        <Bar width={barGroupWidth * 0.25} height={barGroupHeight - barPadding} maxVal={maxVal} edge={edge}/> 
      </g>

      <text fontSize="smaller" x="250" y="12">{formatTime(edge.departure_schedule_time)}</text>

      <text x="0" y="8">{edge.from.name}</text>
      <text x="0" y="58">{edge.to.name}</text>

      <text fontSize="smaller" x="250" y="48">{formatTime(edge.arrival_schedule_time)}</text>

      <text className="value-label" x="620" y={yMid} alignmentBaseline="middle">
        {edge.expected_passengers + " (" + (edge.expected_passengers/edge.capacity*100).toFixed(0) + "%)"}
      </text>
    </svg>
  );
}

export default BarGroup;