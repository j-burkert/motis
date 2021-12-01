import React from "react";

import { PaxMonEdgeLoadInfoWithStats } from "../data/loadInfo";
import { addEdgeStatistics } from "../util/statistics";

import { formatTime } from "../util/dateFormat";

type timelineProps = {
  edges: PaxMonEdgeLoadInfoWithStats[];
  spacing: number;
};

function Timeline({ edges, spacing }: timelineProps): JSX.Element {
  const offset = 10 + 30;

  return (
    <svg>
      {edges.map((e, id) => {
        let depYPos = offset + spacing * id + 3;
        let arrYPos = offset + spacing * (id + 1) - 7;

        const realTimeArr =
          e.arrival_current_time > e.arrival_schedule_time ? (
            <text
              key={"realtime-arr-" + id}
              x={0}
              y={arrYPos}
              fontSize="x-small"
            >
              {" "}
              {formatTime(e.arrival_current_time)}{" "}
            </text>
          ) : (
            <div />
          );
        const realTimeDep =
          e.departure_current_time > e.departure_schedule_time ? (
            <text
              key={"realtime-dep" + id}
              x="0"
              y={depYPos}
              fontSize="x-small"
            >
              {" "}
              {formatTime(e.departure_current_time)}{" "}
            </text>
          ) : (
            <div />
          );

        return (
          <React.Fragment key={"dates-" + id}>
            <text key={"dep-" + id} x={10} y={depYPos} fontSize="x-small">
              {" "}
              {formatTime(e.departure_schedule_time)}{" "}
            </text>
            <text key={"arr-" + id} x={10} y={arrYPos} fontSize="x-small">
              {" "}
              {formatTime(e.arrival_schedule_time)}{" "}
            </text>
          </React.Fragment>
        );
      })}

      <text x="50" y={offset}>
        {edges[0].from.name}
      </text>
      {edges.map((e, id) => {
        let yPos = spacing * (id + 1) + offset;

        return (
          <text key={"name-" + id} x={50} y={yPos}>
            {e.to.name}
          </text>
        );
      })}
    </svg>
  );
}

export default Timeline;
