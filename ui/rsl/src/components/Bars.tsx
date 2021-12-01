import React from "react";
import { PaxMonEdgeLoadInfoWithStats } from "../data/loadInfo";

type barProps = {
  edges: PaxMonEdgeLoadInfoWithStats[];
  spacing: number;
};

function Bars({ edges, spacing }: barProps): JSX.Element {
  const xPos = 200;
  const width = 200;

  function createLabels(doubleCapacity: number) {
    const stepSize =
      doubleCapacity >= 20000
        ? 2000
        : doubleCapacity >= 10000
        ? 1000
        : doubleCapacity >= 3000
        ? 500
        : doubleCapacity >= 1500
        ? 200
        : doubleCapacity >= 700
        ? 100
        : 50;
    const labels = [];
    for (let pax = stepSize; pax < doubleCapacity; pax += stepSize) {
      labels.push({
        pax,
        x: xPos + Math.round((pax / doubleCapacity) * width),
      });
    }
    return labels;
  }

  const greenX = xPos;
  const yellowX = xPos + 0.8 * width * 0.5;
  const redX = xPos + width * 0.5;
  const darkRedX = xPos + 2 * width * 0.5;

  console.log(edges.map((e) => e.expected_passengers));

  return (
    <svg>
      {edges.map((e, id) => {
        let yPos = spacing * id + 5 + 30;
        return (
          <React.Fragment key={"bar-" + id}>
            <rect
              key={"darkRed-" + id}
              x={darkRedX}
              y={yPos}
              width={width - darkRedX}
              height={spacing}
              stroke="#DDD"
              fill="#f57a7a"
            />
            <rect
              key={"green-" + id}
              x={greenX}
              y={yPos}
              width={yellowX - greenX}
              height={spacing}
              stroke="#DDD"
              fill="#D4FFCA"
            />
            <rect
              key={"yellow-" + id}
              x={yellowX}
              y={yPos}
              width={redX - yellowX}
              height={spacing}
              stroke="#DDD"
              fill="#FFF3CA"
            />
            <rect
              key={"red-" + id}
              x={redX}
              y={yPos}
              width={darkRedX - redX}
              height={spacing}
              stroke="#DDD"
              fill="#FFCACA"
            />

            <rect
              x={
                xPos +
                Math.round(((e.q_5 || 0) / edges[0].capacity) * 0.5 * width)
              }
              y={yPos}
              height={spacing}
              width={Math.round(((e.q_95 || 0) / edges[0].capacity) * 0.5)}
              className="fill-current text-blue-400"
            />

            <path
              stroke-width="3"
              className="stroke-current text-blue-800"
              d={`M ${
                (e.expected_passengers / e.capacity) * 0.5 * width + xPos
              } ${yPos} V ${yPos + spacing}`}
            />
            <path
              strokeWidth="3"
              className="stroke-current text-blue-800"
              d={`M ${(e.q_50 / e.capacity) * 0.5 * width + xPos} ${yPos} V ${
                yPos + spacing
              }`}
            />

            <text
              fontSize="small"
              x={xPos + width + 3}
              y={yPos + spacing / 2 + 5}
            >
              {(e.p_load_gt_100 * 100).toFixed(0) + "%"}
            </text>

            <path stroke="gray" d={`M ${xPos} ${yPos} H ${xPos + width}`} />
          </React.Fragment>
        );
      })}

      {createLabels(edges[0].capacity * 2).map((label, id) => {
        return (
          <text
            key={"y-label-" + id}
            fontSize="small"
            x={label.x}
            y="30"
            transform={`rotate(300, ${label.x}, 30)`}
          >
            {label.pax}
          </text>
        );
      })}
    </svg>
  );
}

export default Bars;
