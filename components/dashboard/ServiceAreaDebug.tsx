'use client';

import React from 'react';
import { useState } from 'react';
import { useLocksmiths } from '@/hooks/useLocksmiths';
import { useGeocoding } from '@/hooks/useGeocoding';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { calculateDistance } from '@/lib/utils';

export default function ServiceAreaDebug() {
  const { findNearby } = useLocksmiths();
  const { geocodePostcode } = useGeocoding();
  const [testPostcode, setTestPostcode] = useState('');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const addLog = (
    message: string,
    type: 'info' | 'error' | 'success' = 'info'
  ) => {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    setDebugLogs((prev) => [`[${timestamp}] ${prefix} ${message}`, ...prev]);

    // Also log to console with appropriate styling
    const consoleMsg = `[${timestamp}] ${message}`;
    switch (type) {
      case 'error':
        console.error(consoleMsg);
        break;
      case 'success':
        console.log('%c' + consoleMsg, 'color: green');
        break;
      default:
        console.log(consoleMsg);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setSearchResults([]);
    setCoordinates(null);

    try {
      addLog(`Starting search test for postcode: ${testPostcode}`, 'info');

      // Geocoding step
      addLog('Geocoding postcode...', 'info');
      const coords = await geocodePostcode(testPostcode);
      setCoordinates({ lat: coords.latitude, lon: coords.longitude });
      addLog(
        `Geocoding successful: ${coords.latitude}, ${coords.longitude}`,
        'success'
      );

      // Locksmith search step
      addLog('Searching for nearby locksmiths...', 'info');
      const results = await findNearby(coords.latitude, coords.longitude, 25);
      setSearchResults(results);

      addLog(`Found ${results.length} locksmiths`, 'success');

      // Log detailed results
      results.forEach((result) => {
        const distance = calculateDistance(
          coords.latitude,
          coords.longitude,
          result.latitude,
          result.longitude
        );

        addLog(
          `${result.companyName}: ` +
            `Distance: ${distance.toFixed(2)}km, ` +
            `ETA: ${result.eta}min, ` +
            `Services: ${result.servicesOffered.join(', ')}`,
          'info'
        );
      });
    } catch (error) {
      addLog(
        `Search failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Debug Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Search Postcode</label>
          <div className="join w-full">
            <input
              type="text"
              placeholder="Enter postcode to test..."
              className="input input-bordered join-item flex-1"
              value={testPostcode}
              onChange={(e) => setTestPostcode(e.target.value)}
            />
            <button
              className={`btn join-item ${loading ? 'loading' : ''}`}
              onClick={handleTest}
              disabled={!testPostcode || loading}
            >
              Test Search
            </button>
          </div>
        </div>

        {coordinates && (
          <div className="p-4 bg-base-200 rounded-lg">
            <h3 className="font-medium mb-2">Search Coordinates</h3>
            <p className="font-mono text-sm">
              Latitude: {coordinates.lat.toFixed(6)}
              <br />
              Longitude: {coordinates.lon.toFixed(6)}
            </p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Search Results</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Distance</th>
                    <th>ETA</th>
                    <th>Services</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((result, index) => (
                    <tr key={index}>
                      <td>{result.companyName}</td>
                      <td>
                        {coordinates
                          ? `${calculateDistance(
                              coordinates.lat,
                              coordinates.lon,
                              result.latitude,
                              result.longitude
                            ).toFixed(2)}km`
                          : 'N/A'}
                      </td>
                      <td>{result.eta} min</td>
                      <td>{result.servicesOffered.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-2">Debug Log</h3>
          <div className="bg-base-300 p-4 rounded-lg h-60 overflow-y-auto font-mono text-xs space-y-1">
            {debugLogs.map((log, index) => (
              <div
                key={index}
                className={`whitespace-pre-wrap ${
                  log.includes('❌')
                    ? 'text-error'
                    : log.includes('✅')
                    ? 'text-success'
                    : 'text-base-content'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
