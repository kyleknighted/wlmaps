import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import styles from '../styles/Map.module.css';
import { Marker } from '../types/marker';
import streetLines from '../data/streetMap.json';
import washMo from '../data/washmo.filtered.json';

import 'leaflet-routing-machine';

type SearchTerm = {
  lot?: string;
  block?: string;
  section?: string;
};

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({});
  const [filteredMarkers, setFilteredMarkers] = useState<Marker[]>([]);
  const markerLayerGroup = useRef<L.LayerGroup | null>(null);
  const routingControlRef = useRef<any>(null);

  const getLegalDescRegex = (lot?: string, block?: string, sec?: string) => {
    if (!lot || !block || !sec) return null;
    return new RegExp(
      `\\b(LT|LOT)\\s*${lot}\\b.*\\bBLK\\s*${block}\\b.*\\bSEC\\s*${sec}\\b`,
      'i'
    );
  };

  // Add/remove property markers as a group (searched)
  useEffect(() => {
    if (map) {
      if (markerLayerGroup.current) {
        markerLayerGroup.current.remove();
        markerLayerGroup.current = null;
      }
      if (filteredMarkers.length > 0) {
        const group = L.layerGroup();
        filteredMarkers.forEach((marker) => {
          const icon = marker.isSpecialLocation
            ? L.icon({ iconUrl: '/special-marker.svg', iconSize: [24, 24] })
            : L.icon({ iconUrl: '/property-marker.svg', iconSize: [24, 24] });
          const markerInstance = L.marker(
            [marker.lat, marker.lng],
            icon ? { icon } : {}
          ).bindPopup(marker.label || '');
          group.addLayer(markerInstance);
        });
        group.addTo(map);
        markerLayerGroup.current = group;
      }
    }
  }, [map, filteredMarkers]);

  // Initialize map and base layers
  useEffect(() => {
    if (mapRef.current && !map) {
      const initialMap = L.map(mapRef.current).setView(
        [38.11288, -91.06786],
        15
      );

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 14,
      }).addTo(initialMap);

      const bounds: L.LatLngBoundsExpression = [
        [38.091, -91.093], // Southwest corner
        [38.139, -91.048], // Northeast corner
      ];
      initialMap.setMaxBounds(bounds);
      // @ts-expect-error: setMaxBoundsViscosity may not be typed in leaflet
      initialMap.setMaxBoundsViscosity?.(1.0);

      L.geoJSON(streetLines as GeoJSON.FeatureCollection, {
        style: () => ({ color: '#fff', weight: 0, opacity: 0 }),
      }).addTo(initialMap);

      setMap(initialMap);
    }
  }, [mapRef, map]);

  // User location marker
  useEffect(() => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation(new L.LatLng(latitude, longitude));
        const icon = L.icon({
          iconUrl: '/property-marker.svg',
          iconSize: [24, 24],
        });
        L.marker([latitude, longitude], {
          icon,
        })
          .addTo(map)
          .bindPopup('Your Location')
          .openPopup();
        map.setView([latitude, longitude], 15);
      });
    }
  }, [map]);

  // Routing Machine effect: route from userLocation to first filtered property marker
  useEffect(() => {
    if (map && userLocation && filteredMarkers.length === 1) {
      const destination = L.latLng(
        filteredMarkers[0].lat,
        filteredMarkers[0].lng
      );

      // Remove previous routing control
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      const control = L.Routing.control({
        waypoints: [userLocation, destination],
        lineOptions: {
          addWaypoints: false,
          styles: [{ color: 'blue', weight: 5 }],
          extendToWaypoints: true,
          missingRouteTolerance: 1,
        },
        routeWhileDragging: false,
        show: true,
      }).addTo(map);

      routingControlRef.current = control;
    } else if (map && routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
  }, [map, userLocation, filteredMarkers]);

  // Filtering by three search fields
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchTerm((prev) => {
      const next = { ...prev, [name]: value };
      // Only filter if all fields are present and not empty
      if (next.lot && next.block && next.section) {
        const regex = getLegalDescRegex(next.lot, next.block, next.section);
        const matches = regex
          ? washMo.features.filter((feature) =>
              regex.test(feature.properties.legaldesc)
            )
          : [];

        setFilteredMarkers(
          matches.map((feature) => ({
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            label: feature.properties.owner
              ? `${feature.properties.owner} (${feature.properties.legaldesc})`
              : feature.properties.legaldesc,
          }))
        );
      } else {
        setFilteredMarkers([]);
      }
      return next;
    });
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.searchBar}>
        <input
          type="number"
          placeholder="LOT"
          name="lot"
          value={searchTerm.lot || ''}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <input
          type="number"
          placeholder="BLK"
          name="block"
          value={searchTerm.block || ''}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <input
          type="number"
          placeholder="SEC"
          name="section"
          value={searchTerm.section || ''}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
      <div ref={mapRef} className={styles.map} />
    </div>
  );
};

export default Map;
