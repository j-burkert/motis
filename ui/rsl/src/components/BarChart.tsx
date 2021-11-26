import React, { useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useAtom } from "jotai";

import { TripId } from "../api/protocol/motis";
import { universeAtom } from "../data/simulation";
import { addEdgeStatistics } from "../util/statistics";
import Timeline from "./Timeline";
import Bars from "./Bars";
import { PaxMonEdgeLoadInfoWithStats } from "../data/loadInfo";
import {
  formatLongDateTime,
} from "../util/dateFormat";

import {
  queryKeys,
  sendPaxMonTripLoadInfosRequest,
  usePaxMonStatusQuery,
} from "../api/paxmon";

type TripLoadChartProps = {
  tripId: TripId;
  onSectionClick?: (e: PaxMonEdgeLoadInfoWithStats) => void;
};

async function loadAndProcessTripInfo(universe: number, trip: TripId) {
  const res = await sendPaxMonTripLoadInfosRequest({
    universe,
    trips: [trip],
  });
  const tli = res.load_infos[0];
  return addEdgeStatistics(tli);
}

function BarChart({ tripId, onSectionClick } : TripLoadChartProps): JSX.Element | null {

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
  const barGroupWidth = 1200;
  const systemTime = status.system_time;

  const names = [
    ...new Set(
      data.tsi.service_infos.map((si) =>
        si.line ? `${si.train_nr} [${si.name}]` : si.name
      )
    ),
  ];

  const title = `${names.join(", ")} (${data.tsi.primary_station.name} - ${
    data.tsi.secondary_station.name
  }), Vorhersage vom ${formatLongDateTime(systemTime)}`;

  const spacing = 40;
  const chartHeight = spacing * edges.length + 10 + 30;

  const clickRegions = onSectionClick
  ? edges.map((e, id) => {
      return (
        <rect
          key={id.toString()}
          x="200"
          y={id * spacing + 5 + 30}
          width="200"
          height={spacing}
          fill="transparent"
          className="cursor-pointer"
          onClick={() => {
            console.log(e);
            onSectionClick(e);
          }}
        />
      );
    })
  : [];

  return (
    <div>

      <p className="text-center font-bold">
        {title}
      </p>

      <svg
        ref={svgEl2}
        width={barGroupWidth}
        height={chartHeight}
        className="mx-auto mt-2"
      >
        <g><Timeline edges = {data.edges} spacing = {spacing}/></g>
        <g><Bars edges = {data.edges} spacing = {spacing}/></g>
        <g><rect  strokeWidth="2" x="200" y="35" height={chartHeight-10-30} width="200" stroke="#333" fill="transparent"></rect></g>
        <g>{clickRegions}</g>        
      </svg> 

    </div>
  );
}

export default BarChart;