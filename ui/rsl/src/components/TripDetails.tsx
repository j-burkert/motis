import React, { useState } from "react";

import { TripId } from "../api/protocol/motis";
import { PaxMonEdgeLoadInfoWithStats } from "../data/loadInfo";
import BarChart from "./BarChart";

import TripLoadForecastChart from "./TripLoadForecastChart";
import TripSectionDetails from "./TripSectionDetails";

type TripDetailsProps = {
  tripId: TripId;
};

function TripDetails({ tripId }: TripDetailsProps): JSX.Element {
  const [selectedSection, setSelectedSection] =
    useState<PaxMonEdgeLoadInfoWithStats>();

  return (
    <div>
      <BarChart
        tripId={tripId}
        onSectionClick={setSelectedSection}
      />
      <TripLoadForecastChart
        tripId={tripId}
        mode="Interactive"
        onSectionClick={setSelectedSection}
      />
      {selectedSection && (
        <TripSectionDetails
          tripId={tripId}
          selectedSection={selectedSection}
          onClose={() => setSelectedSection(undefined)}
        />
      )}
    </div>
  );
}

export default TripDetails;
