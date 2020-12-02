#include "motis/paxmon/output/mcfp_scenario.h"

#include <cstdint>
#include <fstream>
#include <iomanip>

#include "utl/verify.h"

#include "motis/core/access/trip_iterator.h"
#include "motis/hash_map.h"

#include "motis/paxmon/messages.h"

namespace fs = boost::filesystem;
using namespace motis::module;

namespace motis::paxmon::output {

void write_stations(fs::path const& dir, schedule const& sched) {
  std::ofstream out{(dir / "stations.csv").string()};
  out.exceptions(std::ios_base::failbit | std::ios_base::badbit);
  out << "id,transfer,name\n";
  for (auto const& st : sched.stations_) {
    out << st->eva_nr_.view() << "," << st->transfer_time_ << ","
        << std::quoted(st->name_.view(), '"', '"') << "\n";
  }
}

void write_footpaths(fs::path const& dir, schedule const& sched) {
  std::ofstream out{(dir / "footpaths.csv").string()};
  out.exceptions(std::ios_base::failbit | std::ios_base::badbit);
  out << "from_station,to_station,duration\n";
  for (auto const& st : sched.stations_) {
    for (auto const& fp : st->outgoing_footpaths_) {
      out << st->eva_nr_.view() << ","
          << sched.stations_.at(fp.to_station_)->eva_nr_.view() << ","
          << fp.duration_ << "\n";
    }
  }
}

void write_trip(std::ofstream& out, schedule const& sched, trip const* trp,
                std::uint64_t id) {
  for (auto const& section : access::sections{trp}) {
    auto const& lc = section.lcon();
    // TODO(pablo): capacity
    out << id << "," << section.from_station(sched).eva_nr_ << "," << lc.d_time_
        << "," << section.to_station(sched).eva_nr_ << "," << lc.a_time_ << ","
        << 0 << "\n";
  }
}

void write_trips(fs::path const& dir, schedule const& sched,
                 mcd::hash_map<trip const*, std::uint64_t>& trip_ids) {
  std::ofstream out{(dir / "trips.csv").string()};
  out.exceptions(std::ios_base::failbit | std::ios_base::badbit);
  out << "id,from_station,departure,to_station,arrival,capacity\n";
  auto id = 1ULL;
  for (auto const& trp : sched.trip_mem_) {
    if (trp->edges_->empty()) {
      continue;
    }
    write_trip(out, sched, trp.get(), id);
    trip_ids[trp.get()] = id;
    ++id;
  }
}

void write_groups(fs::path const& dir, schedule const& sched,
                  paxmon_data const& data, std::vector<msg_ptr> const& messages,
                  mcd::hash_map<trip const*, std::uint64_t> const& trip_ids) {
  std::ofstream out{(dir / "groups.csv").string()};
  out.exceptions(std::ios_base::failbit | std::ios_base::badbit);
  out << "id,start,departure,destination,arrival,passengers,in_trip\n";
  auto id = 1ULL;
  for (auto const& msg : messages) {
    auto const update = motis_content(MonitoringUpdate, msg);
    for (auto const& event : *update->events()) {
      if (event->type() == MonitoringEventType_NO_PROBLEM) {
        continue;
      }
      auto const loc =
          from_fbs(sched, event->localization_type(), event->localization());
      auto const pg = data.get_passenger_group(event->group()->id());
      utl::verify(pg != nullptr, "mcfp_scenario: invalid group");
      out << id << "," << loc.at_station_->eva_nr_.view() << ","
          << loc.current_arrival_time_ << ","
          << sched.stations_
                 .at(pg->compact_planned_journey_.destination_station_id())
                 ->eva_nr_.view()
          << "," << pg->planned_arrival_time_ << "," << pg->passengers_ << ",";
      if (loc.in_trip()) {
        out << trip_ids.at(loc.in_trip_);
      }
      out << "\n";
      ++id;
    }
  }
}

void write_scenario(fs::path const& dir, schedule const& sched,
                    paxmon_data const& data,
                    std::vector<msg_ptr> const& messages) {
  mcd::hash_map<trip const*, std::uint64_t> trip_ids;
  write_stations(dir, sched);
  write_footpaths(dir, sched);
  write_trips(dir, sched, trip_ids);
  write_groups(dir, sched, data, messages, trip_ids);
}

}  // namespace motis::paxmon::output
