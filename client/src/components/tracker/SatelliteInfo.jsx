import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Users, Rocket, Target } from 'lucide-react';

function SatelliteInfo() {
  const issInfo = {
    name: 'International Space Station',
    mission: 'Human spaceflight and research laboratory',
    crew: 7,
    launchDate: 'November 20, 1998',
    countries: ['USA', 'Russia', 'Japan', 'Europe', 'Canada'],
    mass: '419,725 kg',
    volume: '916 m³',
    powerGeneration: '120 kW',
    orbitalPeriod: '~93 minutes',
    purpose: [
      'Scientific research in microgravity',
      'Technology development',
      'Earth observation',
      'Educational outreach'
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary border border-white/10 rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-electric-blue" />
        <h3 className="font-semibold text-white">About the ISS</h3>
      </div>

      <div className="space-y-4">
        {/* Mission */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-muted-gray" />
            <p className="text-sm text-muted-gray">Mission</p>
          </div>
          <p className="text-sm text-white leading-relaxed">
            {issInfo.mission}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-muted-gray" />
              <p className="text-xs text-muted-gray">Current Crew</p>
            </div>
            <p className="text-xl font-bold text-white">{issInfo.crew}</p>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="w-3.5 h-3.5 text-muted-gray" />
              <p className="text-xs text-muted-gray">Orbital Period</p>
            </div>
            <p className="text-xl font-bold text-white">{issInfo.orbitalPeriod}</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-gray">Launch Date</span>
            <span className="text-white font-medium">{issInfo.launchDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-gray">Mass</span>
            <span className="text-white font-medium">{issInfo.mass}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-gray">Volume</span>
            <span className="text-white font-medium">{issInfo.volume}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-gray">Power</span>
            <span className="text-white font-medium">{issInfo.powerGeneration}</span>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <p className="text-sm text-muted-gray mb-2">Key Purposes</p>
          <ul className="space-y-1">
            {issInfo.purpose.map((purpose, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-electric-blue mt-1">•</span>
                <span>{purpose}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* International Partnership */}
        <div className="p-3 bg-electric-blue/10 border border-electric-blue/20 rounded-lg">
          <p className="text-xs text-muted-gray mb-2">International Partnership</p>
          <div className="flex flex-wrap gap-2">
            {issInfo.countries.map((country, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 rounded text-xs text-white"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { SatelliteInfo };
