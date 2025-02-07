"use client";

import { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import ButtomBar from "@/components/ButtomBar";

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const initializeMap = () => {
      if (mapRef.current && window.google && window.google.maps) {
        new window.google.maps.Map(mapRef.current, {
          center: { lat: 15.87, lng: 100.9925 },
          zoom: 8,
          // mapTypeId: "satellite",
        });
      }
    };

    initializeMap();
  }, [isLoaded, loadError]);

  if (!isLoaded) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 min-h-screen min-w-full">
        <div className="w-full h-full bg-sky-300 animate-pulse flex justify-center items-center">
          <p className="font-extrabold text-4xl text-sky-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-0 min-h-screen min-w-full">
      <div ref={mapRef} className="w-full h-full" />
      <ButtomBar/>
    </div>
  );
}

export default Map;