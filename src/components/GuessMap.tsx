import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polyline,
} from "react-leaflet";

import { useMap } from "react-leaflet";
import { useEffect } from "react";

import { useState } from "react";

import type { LatLng } from "leaflet";

interface GuessMapProps {
  guess?: {
    lat: number;
    lng: number;
  };
  answer?: {
    lat: number;
    lng: number;
  };
  resetKey: number;
  showResult: boolean;
  onGuessChange: (latitude: number, longitude: number) => void;
}

function MapClickHandler({ onGuessChange }: GuessMapProps) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      onGuessChange(lat, lng);
    },
  });

  return null;
}

function FitBounds({
  guess,
  answer,
}: {
  guess: { lat: number; lng: number };
  answer: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(
      [
        [guess.lat, guess.lng],
        [answer.lat, answer.lng],
      ],
      {
        padding: [80, 80],
        animate: true,
        duration: 0.8,
      },
    );
  }, [map, guess, answer]);

  return null;
}

export function ResetMapView({
  resetKey,
}: {
  resetKey: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(
      [56.2, 10.0],
      5,
      {
        animate: true,
      }
    );
  }, [resetKey, map]);

  return null;
}

export default function GuessMap({
  onGuessChange,
  showResult,
  answer,
  guess,
  resetKey
}: GuessMapProps) {
  return (
    <MapContainer
      center={[56.2, 10.0]}
      zoom={5}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <ResetMapView resetKey={resetKey} />

      {!showResult && (
        <MapClickHandler onGuessChange={onGuessChange} showResult={false} resetKey={resetKey}/>
      )}

      {guess && <Marker position={guess} />}

      {showResult && answer && guess && (
        <>
          <FitBounds guess={guess} answer={answer} />

          <Marker position={answer} />

          <Polyline positions={[guess, answer]} />
        </>
      )}

      {!showResult && guess && (
        <Marker
          position={guess}
          draggable
          eventHandlers={{
            dragend(event) {
              const marker = event.target;
              const coords = marker.getLatLng();

              onGuessChange(coords.lat, coords.lng);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
