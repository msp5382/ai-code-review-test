"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  imsiTowers,
  getHitsForSuspect,
  getTowerById,
  suspects,
} from "../data/mock";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface MapViewProps {
  selectedSuspectIds: string[];
  highlightTowerIds: string[];
  onSelectTower: (towerId: string) => void;
}

const TRACE_SOURCE_PREFIX = "trace-";
const TRACE_LAYER_PREFIX = "trace-layer-";
const TRACE_ARROW_PREFIX = "trace-arrow-";

export default function MapView({
  selectedSuspectIds,
  highlightTowerIds,
  onSelectTower,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const isLoaded = useRef(false);
  const onSelectTowerRef = useRef(onSelectTower);
  onSelectTowerRef.current = onSelectTower;

  const handleTowerClick = useCallback((towerId: string) => {
    onSelectTowerRef.current(towerId);
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [100.55, 13.855],
      zoom: 12,
    });

    const m = map.current;

    m.on("load", () => {
      isLoaded.current = true;

      imsiTowers.forEach((tower) => {
        const el = document.createElement("div");
        el.className = "imsi-tower-marker";
        el.dataset.towerId = tower.id;
        el.innerHTML = `
          <div class="tower-icon ${tower.status === "active" ? "active" : "inactive"}">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
              <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/>
              <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
              <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <div class="tower-label">${tower.name}</div>
        `;

        el.addEventListener("click", () => handleTowerClick(tower.id));

        new mapboxgl.Marker({ element: el })
          .setLngLat([tower.lng, tower.lat])
          .addTo(m);

        m.addSource(`tower-radius-${tower.id}`, {
          type: "geojson",
          data: createCircle([tower.lng, tower.lat], tower.radius),
        });

        m.addLayer({
          id: `tower-radius-fill-${tower.id}`,
          type: "fill",
          source: `tower-radius-${tower.id}`,
          paint: {
            "fill-color": "rgba(0, 255, 136, 0.06)",
            "fill-opacity": 0.5,
          },
        });

        m.addLayer({
          id: `tower-radius-line-${tower.id}`,
          type: "line",
          source: `tower-radius-${tower.id}`,
          paint: {
            "line-color": "rgba(0, 255, 136, 0.25)",
            "line-width": 1,
            "line-dasharray": [4, 4],
          },
        });
      });
    });

    return () => {
      m.remove();
      map.current = null;
      isLoaded.current = false;
    };
  }, [handleTowerClick]);

  useEffect(() => {
    const m = map.current;
    if (!m || !isLoaded.current) return;

    suspects.forEach((s) => {
      const layerId = TRACE_LAYER_PREFIX + s.id;
      const arrowId = TRACE_ARROW_PREFIX + s.id;
      const sourceId = TRACE_SOURCE_PREFIX + s.id;
      if (m.getLayer(arrowId)) m.removeLayer(arrowId);
      if (m.getLayer(layerId)) m.removeLayer(layerId);
      if (m.getSource(sourceId)) m.removeSource(sourceId);
    });

    imsiTowers.forEach((tower) => {
      const fillId = `tower-radius-fill-${tower.id}`;
      const lineId = `tower-radius-line-${tower.id}`;
      if (m.getLayer(fillId)) {
        m.setPaintProperty(fillId, "fill-color", "rgba(0, 255, 136, 0.06)");
        m.setPaintProperty(fillId, "fill-opacity", 0.5);
      }
      if (m.getLayer(lineId)) {
        m.setPaintProperty(lineId, "line-color", "rgba(0, 255, 136, 0.25)");
        m.setPaintProperty(lineId, "line-width", 1);
      }
      const markerEl = document.querySelector(
        `.imsi-tower-marker[data-tower-id="${tower.id}"]`
      );
      markerEl?.classList.remove("highlighted");
    });

    if (selectedSuspectIds.length === 0) return;

    highlightTowerIds.forEach((towerId) => {
      const fillId = `tower-radius-fill-${towerId}`;
      const lineId = `tower-radius-line-${towerId}`;
      if (m.getLayer(fillId)) {
        m.setPaintProperty(fillId, "fill-color", "rgba(255, 200, 0, 0.12)");
        m.setPaintProperty(fillId, "fill-opacity", 0.8);
      }
      if (m.getLayer(lineId)) {
        m.setPaintProperty(lineId, "line-color", "rgba(255, 200, 0, 0.6)");
        m.setPaintProperty(lineId, "line-width", 2);
      }
      const markerEl = document.querySelector(
        `.imsi-tower-marker[data-tower-id="${towerId}"]`
      );
      markerEl?.classList.add("highlighted");
    });

    selectedSuspectIds.forEach((suspectId, idx) => {
      const suspect = suspects.find((s) => s.id === suspectId);
      if (!suspect) return;

      const hits = getHitsForSuspect(suspectId);
      if (hits.length < 2) return;

      const coords: [number, number][] = [];
      hits.forEach((hit) => {
        const tower = getTowerById(hit.towerId);
        if (tower) {
          const offset = idx * 0.002;
          coords.push([tower.lng + offset, tower.lat + offset]);
        }
      });

      const sourceId = TRACE_SOURCE_PREFIX + suspectId;
      const layerId = TRACE_LAYER_PREFIX + suspectId;
      const arrowId = TRACE_ARROW_PREFIX + suspectId;

      m.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: coords },
        },
      });

      m.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": suspect.color,
          "line-width": 3,
          "line-opacity": 0.8,
          "line-dasharray": [2, 1],
        },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      m.addLayer({
        id: arrowId,
        type: "symbol",
        source: sourceId,
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 80,
          "text-field": "▶",
          "text-size": 12,
          "text-rotate": 0,
          "text-keep-upright": false,
        },
        paint: { "text-color": suspect.color },
      });
    });

    if (highlightTowerIds.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      highlightTowerIds.forEach((tid) => {
        const tower = getTowerById(tid);
        if (tower) bounds.extend([tower.lng, tower.lat]);
      });
      m.fitBounds(bounds, { padding: 100, duration: 800 });
    }
  }, [selectedSuspectIds, highlightTowerIds]);

  return <div ref={mapContainer} className="w-full h-full" />;
}

function createCircle(
  center: [number, number],
  radiusMeters: number
): GeoJSON.FeatureCollection {
  const points = 64;
  const coords: [number, number][] = [];
  const km = radiusMeters / 1000;

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = km * Math.cos(angle);
    const dy = km * Math.sin(angle);
    const lat = center[1] + (dy / 6371) * (180 / Math.PI);
    const lng =
      center[0] +
      ((dx / 6371) * (180 / Math.PI)) / Math.cos((center[1] * Math.PI) / 180);
    coords.push([lng, lat]);
  }
  coords.push(coords[0]);

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: { type: "Polygon", coordinates: [coords] },
      },
    ],
  };
}
