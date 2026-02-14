import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc } from 'lucide-react';
import MissionCard from './MissionCard';
import MissionDetail from './MissionDetail';
import SearchBar from '@/components/common/SearchBar';
import EmptyState from '@/components/common/EmptyState';
import missionsData from '@/data/missions.json';

function MissionList() {
  const [selectedMission, setSelectedMission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAgency, setFilterAgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Extract unique agencies
  const agencies = ['all', ...new Set(missionsData.map(m => m.agency.split('/')[0]))];
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'planned', label: 'Planned' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' }
  ];

  const filteredAndSortedMissions = useMemo(() => {
    let filtered = missionsData;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mission =>
        mission.name.toLowerCase().includes(query) ||
        mission.description.toLowerCase().includes(query) ||
        mission.spacecraft.toLowerCase().includes(query)
      );
    }

    // Agency filter
    if (filterAgency !== 'all') {
      filtered = filtered.filter(mission =>
        mission.agency.startsWith(filterAgency)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(mission => mission.status === filterStatus);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.launchDate) - new Date(a.launchDate);
        case 'date-asc':
          return new Date(a.launchDate) - new Date(b.launchDate);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, filterAgency, filterStatus, sortBy]);

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search missions, spacecraft, or keywords..."
          />

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Agency Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-gray" />
              <div className="flex flex-wrap gap-2">
                {agencies.slice(0, 5).map(agency => (
                  <button
                    key={agency}
                    onClick={() => setFilterAgency(agency)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterAgency === agency
                        ? 'bg-electric-blue text-white'
                        : 'bg-white/5 text-muted-gray hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {agency === 'all' ? 'All Agencies' : agency}
                  </button>
                ))}
              </div>
            </div>

            {/* Status & Sort */}
            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-bg-secondary border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-electric-blue/50 transition-colors"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-muted-gray" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-bg-secondary border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-electric-blue/50 transition-colors"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-gray">
            {filteredAndSortedMissions.length} mission{filteredAndSortedMissions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Missions Grid */}
        {filteredAndSortedMissions.length === 0 ? (
          <EmptyState
            icon="rocket"
            message="No missions found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            {filteredAndSortedMissions.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClick={setSelectedMission}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <MissionDetail
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
        />
      )}
    </>
  );
}

export { MissionList };
