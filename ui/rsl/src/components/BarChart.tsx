import React, { useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";

import { TripId } from "../api/protocol/motis";
import { universeAtom } from "../data/simulation";
import { addEdgeStatistics } from "../util/statistics";

import {
  queryKeys,
  sendPaxMonTripLoadInfosRequest,
  usePaxMonStatusQuery,
} from "../api/paxmon";

import BarGroup from "./BarGroup";

type TripLoadChartProps = {
  tripId: TripId;
};

async function loadAndProcessTripInfo(universe: number, trip: TripId) {
  const res = await sendPaxMonTripLoadInfosRequest({
    universe,
    trips: [trip],
  });
  const tli = res.load_infos[0];
  return addEdgeStatistics(tli);
}

function BarChart({ tripId } : TripLoadChartProps): JSX.Element | null {

  const [universe] = useAtom(universeAtom);
  const { data: status } = usePaxMonStatusQuery();

  const queryClient = useQueryClient();
  const { data, isLoading, error} = useQuery(
    queryKeys.tripLoad(universe, tripId),
    async () => loadAndProcessTripInfo(universe, tripId),
    {
      enabled: !!status,
      placeholderData: () => {
        return universe != 0
          ? queryClient.getQueryData(queryKeys.tripLoad(0, tripId))
          : undefined;
      },
    }
  );

  const svgEl2 = useRef<SVGSVGElement>(null);

  if (!status || !data) {
    return null;
  }

  const edges = data.edges;

  const maxPax = edges.reduce((max, ef) => Math.max(max, ef.max_pax || 0), 0);
  const maxCapacity = edges.reduce(
    (max, ef) => (ef.capacity ? Math.max(max, ef.capacity) : max),
    0
  );
  const maxVal = Math.max(maxPax, maxCapacity) * 1.1;

  const barGroupHeight = 50;
  const barGroupWidth = 1200;
  const barChartHeight = 120 + edges.length * barGroupHeight;

  return (
    <svg
      ref={svgEl2}
      width={barGroupWidth}
      height={barChartHeight}
      className="mx-auto mt-2"
    >
      {edges.map((e, idx) => {
        return(
          <g key={idx} transform={`translate(0, ${idx * barGroupHeight})`}>
            <BarGroup
              barGroupWidth={barGroupWidth} 
              barGroupHeight={barGroupHeight} 
              edge={e} 
              id={idx} 
              maxVal={maxVal}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default BarChart;