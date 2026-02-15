import { format, addDays, parseISO } from 'date-fns';
import { getSatellitePasses } from './satelliteService';
import { getMoonPhase, getPlanetPositions } from './astronomyService';
import api from './api';
import { API_ENDPOINTS, NORAD_IDS } from '@/utils/constants';

/**
 * Event Service
 * Aggregates celestial events from multiple APIs
 */

/**
 * Get all upcoming celestial events (dynamic from APIs)
 * @param {number} lat - Observer latitude
 * @param {number} lon - Observer longitude
 * @param {number} days - Number of days ahead (default: 7)
 * @returns {Promise<Array>} Unified array of celestial events
 */
export async function getUpcomingCelestialEvents(lat, lon, days = 7) {
  try {
    // Fetch data from all sources in parallel
    const [
      issPassesData,
      moonPhaseData,
      planetData,
      solarFlares,
      geomagneticStorms
    ] = await Promise.allSettled([
      getSatellitePasses(NORAD_IDS.ISS, lat, lon, days),
      fetchMoonEvents(days),
      fetchPlanetEvents(lat, lon, days),
      fetchSolarEvents(),
      fetchGeomagneticStorms()
    ]);

    const events = [];

    // Process ISS passes
    if (issPassesData.status === 'fulfilled' && issPassesData.value?.passes) {
      const issEvents = issPassesData.value.passes.slice(0, 3).map((pass, index) => ({
        id: `iss-${index}`,
        name: pass.maxEl > 50 ? 'ISS High Pass' : 'ISS Evening Pass',
        type: 'satellite',
        date: pass.startUTC,
        description: `The International Space Station will be visible in the ${getDirectionName(pass.startAz)} sky, appearing as a bright moving 'star'.`,
        viewingInstructions: `Look towards the ${getDirectionName(pass.startAz)} horizon around ${format(new Date(pass.startUTC), 'h:mm a')}. The ISS will rise from the ${getDirectionName(pass.startAz)} and move across the sky towards the ${getDirectionName(pass.endAz)}. The pass will last approximately ${Math.round(pass.duration / 60)} minutes and will be ${pass.mag < -2 ? 'very bright' : 'visible'} (magnitude ${pass.mag.toFixed(1)}).`,
        maxElevation: Math.round(pass.maxEl),
        brightness: pass.mag,
        visibility: pass.maxEl > 50 ? 'excellent' : pass.maxEl > 30 ? 'good' : 'fair'
      }));
      events.push(...issEvents);
    }

    // Process Moon phases
    if (moonPhaseData.status === 'fulfilled' && moonPhaseData.value) {
      events.push(...moonPhaseData.value);
    }

    // Process Planet events
    if (planetData.status === 'fulfilled' && planetData.value) {
      events.push(...planetData.value);
    }

    // Process Solar Flares
    if (solarFlares.status === 'fulfilled' && solarFlares.value && Array.isArray(solarFlares.value)) {
      const solarEvents = solarFlares.value.slice(0, 2).map((flare, index) => ({
        id: `solar-${index}`,
        name: `Solar Flare Activity`,
        type: 'solar',
        date: flare.beginTime || new Date().toISOString(),
        description: `${flare.classType || 'M-class'} solar flare detected. May cause minor radio disruptions and enhanced auroral displays.`,
        viewingInstructions: 'Solar flares cannot be directly viewed. If you\'re in polar regions, watch for enhanced aurora (Northern/Southern Lights) 1-3 days after the event.',
        maxElevation: 0,
        brightness: 0,
        visibility: 'fair'
      }));
      events.push(...solarEvents);
    }

    // Process Geomagnetic Storms
    if (geomagneticStorms.status === 'fulfilled' && geomagneticStorms.value && Array.isArray(geomagneticStorms.value)) {
      const stormEvents = geomagneticStorms.value.slice(0, 2).map((storm, index) => ({
        id: `storm-${index}`,
        name: 'Aurora Alert',
        type: 'aurora',
        date: storm.startTime || new Date().toISOString(),
        description: `Geomagnetic storm activity may produce visible aurora at high latitudes.`,
        viewingInstructions: 'Best viewed from dark locations away from city lights. Aurora typically appears as green, pink, or purple curtains of light dancing across the northern (or southern) sky. Check aurora forecast apps for real-time predictions.',
        maxElevation: 0,
        brightness: 0,
        visibility: lat > 45 || lat < -45 ? 'good' : 'fair'
      }));
      events.push(...stormEvents);
    }

    // Sort by date
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Error fetching celestial events:', error);
    // Return empty array instead of throwing to prevent UI breakage
    return [];
  }
}

/**
 * Fetch moon-related events
 */
async function fetchMoonEvents(days) {
  const events = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = format(addDays(today, i), 'yyyy-MM-dd');
    try {
      const moonData = await getMoonPhase(date);
      
      // Only add events for significant phases or high illumination
      if (moonData.illumination > 80 || moonData.phaseName === 'Full Moon' || moonData.phaseName === 'New Moon') {
        events.push({
          id: `moon-${i}`,
          name: moonData.phaseName,
          type: 'moon',
          date: `${date}T20:00:00Z`,
          description: `The Moon will be ${Math.round(moonData.illumination)}% illuminated${moonData.phaseName === 'Full Moon' ? ', perfect for observing lunar features' : ''}.`,
          viewingInstructions: moonData.phaseName === 'Full Moon'
            ? 'The Full Moon will be high in the southern sky after sunset. Excellent for naked-eye viewing, binoculars, or telescope observation.'
            : `The Moon will appear as a ${moonData.phaseName}. ${moonData.illumination > 50 ? 'Good phase for viewing craters along the terminator (the line between light and dark).' : 'Best viewed in darker skies.'}`,
          maxElevation: 68,
          brightness: -12.4,
          visibility: 'excellent'
        });
      }
    } catch (error) {
      console.error(`Error fetching moon phase for ${date}:`, error);
    }
  }

  return events.slice(0, 2); // Limit to 2 moon events
}

/**
 * Fetch planet-related events
 */
async function fetchPlanetEvents(lat, lon, days) {
  const events = [];
  
  try {
    const planets = await getPlanetPositions(lat, lon);
    
    if (planets && Array.isArray(planets)) {
      // Filter for bright, easily visible planets
      const visiblePlanets = planets.filter(p => 
        p.magnitude < 1.5 && p.altitude > 10
      ).slice(0, 3);

      visiblePlanets.forEach((planet, index) => {
        const timeOfDay = planet.altitude > 45 ? 'evening' : 'morning';
        events.push({
          id: `planet-${planet.name}-${index}`,
          name: `${planet.name} Viewing`,
          type: 'planet',
          date: addDays(new Date(), index).toISOString(),
          description: `${planet.name} ${planet.magnitude < -2 ? 'shines brilliantly' : 'is visible'} in the ${timeOfDay} sky${planet.name === 'Venus' ? ' as the Morning/Evening Star' : ''}.`,
          viewingInstructions: `Look towards the ${getDirectionFromAzimuth(planet.azimuth)} at ${planet.altitude > 45 ? 'around 9 PM' : 'before sunrise'}. ${planet.name} will appear as a bright ${getPlanetColor(planet.name)} 'star'. ${planet.name === 'Jupiter' || planet.name === 'Saturn' ? 'Use binoculars or a telescope for details.' : ''}`,
          maxElevation: Math.round(planet.altitude),
          brightness: planet.magnitude,
          visibility: planet.magnitude < -1 ? 'excellent' : planet.magnitude < 1 ? 'good' : 'fair'
        });
      });
    }
  } catch (error) {
    console.error('Error fetching planet data:', error);
  }

  return events;
}

/**
 * Fetch solar flare events
 */
async function fetchSolarEvents() {
  try {
    const response = await api.get(API_ENDPOINTS.SOLAR_FLARES);
    return response.data || [];
  } catch (error) {
    // Silently handle rate limits - return empty array
    if (error.response?.status !== 429) {
      console.error('Error fetching solar events:', error.message);
    }
    return [];
  }
}

/**
 * Fetch geomagnetic storm events
 */
async function fetchGeomagneticStorms() {
  try {
    const response = await api.get(API_ENDPOINTS.GEOMAGNETIC_STORMS);
    return response.data || [];
  } catch (error) {
    // Silently handle rate limits - return empty array
    if (error.response?.status !== 429) {
      console.error('Error fetching geomagnetic storms:', error.message);
    }
    return [];
  }
}

/**
 * Helper: Convert azimuth degrees to direction name
 */
function getDirectionName(azimuth) {
  const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  const index = Math.round(azimuth / 45) % 8;
  return directions[index];
}

/**
 * Helper: Get direction from azimuth
 */
function getDirectionFromAzimuth(azimuth) {
  if (azimuth < 45 || azimuth >= 315) return 'northern';
  if (azimuth < 135) return 'eastern';
  if (azimuth < 225) return 'southern';
  return 'western';
}

/**
 * Helper: Get planet color description
 */
function getPlanetColor(planetName) {
  const colors = {
    'Venus': 'brilliant white',
    'Mars': 'reddish-orange',
    'Jupiter': 'yellowish-white',
    'Saturn': 'pale yellow',
    'Mercury': 'whitish'
  };
  return colors[planetName] || 'bright';
}
