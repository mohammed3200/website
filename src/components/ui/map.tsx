"use client";

import React, { useRef, useEffect, useState, createContext, useContext } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";

// Types
interface MapContextType {
    map: maplibregl.Map | null;
}

interface MapProps {
    center?: [number, number];
    zoom?: number;
    children?: React.ReactNode;
    className?: string;
}

interface MapMarkerProps {
    longitude: number;
    latitude: number;
    children?: React.ReactNode;
}

interface MarkerContentProps {
    children: React.ReactNode;
}

interface MarkerLabelProps {
    children: React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
}

interface MapRouteProps {
    coordinates: [number, number][];
    color?: string;
    width?: number;
    opacity?: number;
    onClick?: () => void;
}

// Context
const MapContext = createContext<MapContextType>({ map: null });

// Map Component
export function Map({
    center = [0, 0],
    zoom = 2,
    children,
    className
}: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    "osm-tiles": {
                        type: "raster",
                        tiles: [
                            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        ],
                        tileSize: 256,
                    },
                },
                layers: [
                    {
                        id: "osm-tiles",
                        type: "raster",
                        source: "osm-tiles",
                        minzoom: 0,
                        maxzoom: 19,
                    },
                ],
            },
            center: center,
            zoom: zoom,
        });

        map.current.on("load", () => {
            setMapLoaded(true);
        });

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    useEffect(() => {
        if (map.current && mapLoaded) {
            map.current.setCenter(center);
            map.current.setZoom(zoom);
        }
    }, [center, zoom, mapLoaded]);

    return (
        <MapContext.Provider value={{ map: map.current }}>
            <div ref={mapContainer} className={cn("w-full h-full", className)} />
            {mapLoaded && children}
        </MapContext.Provider>
    );
}

// MapMarker Component
export function MapMarker({ longitude, latitude, children }: MapMarkerProps) {
    const { map } = useContext(MapContext);
    const markerRef = useRef<HTMLDivElement>(null);
    const markerInstanceRef = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (!map || !markerRef.current) return;

        markerInstanceRef.current = new maplibregl.Marker({
            element: markerRef.current,
        })
            .setLngLat([longitude, latitude])
            .addTo(map);

        return () => {
            markerInstanceRef.current?.remove();
        };
    }, [map, longitude, latitude]);

    return <div ref={markerRef}>{children}</div>;
}

// MarkerContent Component
export function MarkerContent({ children }: MarkerContentProps) {
    return <div className="relative">{children}</div>;
}

// MarkerLabel Component
export function MarkerLabel({ children, position = "top" }: MarkerLabelProps) {
    const positionClasses = {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2",
        left: "right-full mr-2",
        right: "left-full ml-2",
    };

    return (
        <div
            className={cn(
                "absolute whitespace-nowrap px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-md text-sm font-medium",
                positionClasses[position],
                position === "top" || position === "bottom" ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2"
            )}
        >
            {children}
        </div>
    );
}

// MapRoute Component
export function MapRoute({
    coordinates,
    color = "#3b82f6",
    width = 4,
    opacity = 1,
    onClick,
}: MapRouteProps) {
    const { map } = useContext(MapContext);
    const routeId = useRef(`route-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        if (!map) return;

        const sourceId = routeId.current;
        const layerId = `${routeId.current}-layer`;

        // Add source
        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: coordinates,
                    },
                },
            });
        }

        // Add layer
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: "line",
                source: sourceId,
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": color,
                    "line-width": width,
                    "line-opacity": opacity,
                },
            });
        }

        // Handle click
        if (onClick) {
            map.on("click", layerId, onClick);
        }

        return () => {
            if (onClick) {
                map.off("click", layerId, onClick);
            }
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }
        };
    }, [map, coordinates, color, width, opacity, onClick]);

    return null;
}
