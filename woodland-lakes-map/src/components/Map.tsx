import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/Map.module.css';
import { Marker } from '../types/marker';
import { markers } from '../data/markers';
import propertyLines from '../data/map.json'; // Adjust path as needed

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMarkers, setFilteredMarkers] = useState<Marker[]>(markers);

  useEffect(() => {
    if (mapRef.current && !map) {
      const initialMap = L.map(mapRef.current).setView([38.11288, -91.06786], 1);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 14,
      }).addTo(initialMap);

      // Set the bounds to your desired area (replace with your actual SW/NE coordinates)
      const bounds: L.LatLngBoundsExpression = [
        [38.091, -91.093], // Southwest corner
        [38.139, -91.048], // Northeast corner
      ];
      initialMap.setMaxBounds(bounds);
      // @ts-expect-error: setMaxBoundsViscosity may not be typed in leaflet
      initialMap.setMaxBoundsViscosity?.(1.0);

      // Add property lines from GeoJSON
      L.geoJSON(propertyLines, {
        style: {
          color: '#0080ff',
          weight: 2,
          opacity: 0.7,
        },
      }).addTo(initialMap);

      setMap(initialMap);
    }
  }, [mapRef, map]);

  useEffect(() => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      filteredMarkers.forEach((marker) => {
        const icon = marker.isSpecialLocation
          ? L.icon({ iconUrl: '/special-marker.png', iconSize: [24, 24] })
          : undefined;
        const markerInstance = L.marker([marker.lat, marker.lng], icon ? { icon } : {}).addTo(map);
        markerInstance.bindPopup(marker.label || `${marker.lot}, ${marker.block}, ${marker.section}`);
      });
    }
  }, [map, filteredMarkers]);

  useEffect(() => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation(new L.LatLng(latitude, longitude));
        L.marker([latitude, longitude]).addTo(map).bindPopup('Your Location').openPopup();
        map.setView([latitude, longitude], 15);
      });
    }
  }, [map]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = markers.filter((marker) =>
      `${marker.lot}, ${marker.block}, ${marker.section}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMarkers(filtered);
  };

  return (
    <div className={styles.mapContainer}>
      <input
        type="text"
        placeholder="Search by Lot, Block, Section"
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />
      <div ref={mapRef} className={styles.map} />
    </div>
  );
};

export default Map;
