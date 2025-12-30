
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, ScaleControl, AttributionControl, Pane, useMap } from 'react-leaflet';
import { GibsLayer, ViewState } from '../types';
import { WMTS_ENDPOINT } from '../constants';
import * as L from 'leaflet';

interface MapComponentProps {
  baseLayer: GibsLayer;
  overlays: GibsLayer[];
  opacities?: Record<string, number>;
  date: Date;
  viewState?: ViewState | null;
}

const MapController: React.FC<{ viewState?: ViewState | null }> = ({ viewState }) => {
  const map = useMap();
  
  useEffect(() => {
    if (viewState) {
      map.flyTo([viewState.lat, viewState.lng], viewState.zoom, {
        duration: 2,
        easeLinearity: 0.25
      });
    }
  }, [viewState, map]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ baseLayer, overlays, opacities, date, viewState }) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const dateStr = date.toISOString().split('T')[0];

  const getGibsUrl = (layer: GibsLayer) => {
    const time = layer.timeParameter || dateStr;
    return `${WMTS_ENDPOINT}/${layer.id}/default/${time}/${layer.matrixSet}/{z}/{y}/{x}.${layer.format}`;
  };

  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [map]);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxZoom={12}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full bg-gray-100"
        ref={setMap}
      >
        <MapController viewState={viewState} />
        <AttributionControl position="bottomright" prefix="NASA GIBS | Leaflet" />
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" />

        <TileLayer
          key={`${baseLayer.id}-${dateStr}`}
          url={getGibsUrl(baseLayer)}
          attribution="&copy; NASA Earthdata"
          maxNativeZoom={baseLayer.maxZoom || 9}
          noWrap={true}
          bounds={[[-90, -180], [90, 180]]}
        />

        <Pane name="overlays" style={{ zIndex: 500 }}>
          {overlays.map((layer) => (
            <TileLayer
              key={`${layer.id}-${dateStr}`}
              url={getGibsUrl(layer)}
              maxNativeZoom={layer.maxZoom || 9}
              opacity={opacities ? (opacities[layer.id] ?? 1) : 1}
              noWrap={true}
            />
          ))}
        </Pane>
      </MapContainer>
      
      {/* Date Overlay Display - Light Mode Styled */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] bg-white/70 backdrop-blur-md px-6 py-2 rounded-full border border-gray-200 text-gray-800 font-mono text-lg shadow-xl pointer-events-none">
        {dateStr}
      </div>
    </div>
  );
};

export default MapComponent;
