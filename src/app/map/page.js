"use client";
import { GoogleMap, useLoadScript, OverlayView, InfoWindow } from "@react-google-maps/api";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ModalMarker from "@/components/ModalMarker";
import PageLoading from "@/components/PageLoading";
import { IoCloseSharp } from "react-icons/io5";
import { FaAngleDoubleUp } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { MdPinDrop } from "react-icons/md";
import { GiImpactPoint } from "react-icons/gi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import TopUser from "@/components/TopUser";
import Media from "@/components/Media";




const mapContainerStyle = {
  width: "100%",
  height: "100dvh",
};

const center = { lat: 14.69578, lng: 101.44794 };

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marker, setMarker] = useState(null);
  const [up, setUp] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoadingMarker, setIsLoadingMarker] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepPage, setStepPage] = useState(1);

  // const nextStepPage = () => setStepPage((prev) => prev + 1);
  // const prevStepPage = () => setStepPage((prev) => prev - 1);

  const handlePageChange = (pageNumber) => {
    setStepPage(pageNumber);
  };

  const renderPage = () => {
    switch (stepPage) {
      case 1:
        return (<Media userData={spots} />);
      case 2:
        return (<TopUser />);
      default:
        return null;

    }
  }


  const images = [
    selectedSpot?.spotImages?.[0]?.url,
    selectedSpot?.catches?.[0]?.images?.[0]?.url,
    selectedSpot?.catches?.[0]?.bait?.imageUrl,
  ].filter(Boolean);


  useEffect(() => {
    if (!selectedSpot) return;
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedSpot]);




  const getImageUrl = (url) => {
    try {

      const baseUrl = process.env.NEXT_PUBLIC_MINIO_BASE_URL;

      return `${baseUrl}/${encodeURIComponent(url)}`;
    } catch (error) {
      console.error("Error processing image URL:", error);
    }
  };


  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marked-spot`);
        const data = await response.json();
        console.log("Fetched spots:", data);
        setSpots(data);
      } catch (err) {
        setError("Failed to fetch spots.");
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, [!isOpenModal]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <PageLoading />;

  const handleAddMarker = () => {
    setUp(false);
    setIsLoadingMarker(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (marker) marker.setMap(null);

          const newMarker = new window.google.maps.Marker({
            position: currentLocation,
            map: map,
            title: "ตำแหน่งปัจจุบัน",
          });

          setMarker(newMarker);
          map.panTo(currentLocation);
          map.setZoom(15);
          setIsLoadingMarker(false);
        },
        () => setIsLoadingMarker(false)
      );
    }
  };

  const markerAddress = () => {
    setIsOpenModal(true);
    setUp(false);
    setIsLoadingAddress(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.panTo(currentLocation);
          map.setZoom(15);
          setIsLoadingAddress(false);
        },
        () => setIsLoadingAddress(false)
      );
    }
  };




  return (
    <div className="w-full">
      {!loading && !error && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
          onLoad={(mapInstance) => {
            setMap(mapInstance);
            mapRef.current = mapInstance;
          }}
        >
          {spots.map((spot) => {
            const { lat, lng } = spot;
            const imageUrl = getImageUrl(spot.spotImages?.[0]?.url);

            return (
              <OverlayView key={spot.ID} position={{ lat, lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                <button onClick={() => setSelectedSpot(spot)}>
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform">
                    <Image
                      src={imageUrl}
                      alt={spot.name || "Spot image"}
                      width={64}
                      height={64}
                      className="object-cover rounded-full h-full w-full"
                    />
                  </div>
                </button>
              </OverlayView>
            );
          })}

          {selectedSpot && (
            <InfoWindow position={{ lat: selectedSpot.lat, lng: selectedSpot.lng }} onCloseClick={() => setSelectedSpot(null)}>
              <div className="w-fit p-4 flex flex-col space-y-4 max-w-xs shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold text-center font-mono">{selectedSpot.name}</h3>
                {selectedSpot.spotImages && selectedSpot.spotImages.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <Image
                        src={(selectedSpot.user.avatar)}
                        alt={selectedSpot.user.email}
                        className="rounded-full border"
                        width={30}
                        height={30}
                        placeholder="blur"
                        blurDataURL="/blur.avif"
                      />
                      <p className="font-bold">{selectedSpot.user.email}</p>
                    </div>
                    {/* Image Carousel */}
                    <div className="relative w-full flex justify-center border border-gray-300 rounded-lg overflow-hidden">
                      {selectedSpot.spotImages && (
                        <Image
                          src={getImageUrl(
                            [
                              selectedSpot.spotImages?.[0]?.url,
                              selectedSpot.catches?.[0]?.images?.[0]?.url,
                              selectedSpot.catches?.[0]?.bait?.imageUrl,
                            ].filter(Boolean)[currentIndex]
                          )}
                          alt={`Carousel image ${currentIndex + 1}`}
                          className="w-full h-auto rounded"
                          width={800}
                          height={600}
                          placeholder="blur"
                          blurDataURL="/blur.avif"
                        />
                      )}

                      {images.length > 1 && (
                        <>
                          <button onClick={() => setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))} className="absolute left-1 top-1/2 transform-translate-y-1/2 bg-white p rounded-full shadow-md hover:bg-gray-200">
                            <IoChevronBack size={24} />
                          </button>
                          <button onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)} className="absolute right-1 top-1/2 transform-translate-y-1/2 bg-white p rounded-full shadow-md hover:bg-gray-200">
                            <IoChevronForward size={24} />
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
                <p className="text-gray-700 text-sm">{selectedSpot.description}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}

      <ModalMarker isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />
      <div className={`w-full flex flex-col gap-4 transition-all duration-300 ease-in-out ${up ? "h-[95%]" : "h-[12%]"} bg-white fixed bottom-0 z-10 rounded-t-[40px] p-4`}>
        <div className="w-full flex justify-center relative">
          {up ? (
            <button onClick={() => setUp(false)} className="absolute top-0 right-0 flex justify-center items-center">
              <IoCloseSharp size={40} color="gray" className="mr-2 mt-2 bg-gray-100 rounded-full" />
            </button>
          ) : (
            <FaAngleDoubleUp size={15} color="gray" onClick={() => setUp(true)} className="w-full" />
          )}
        </div>
        <div className={`flex w-full gap-2 justify-center ${up ? "mt-10" : ""}`}>
          <button onClick={handleAddMarker} className="w-full border-blue-400 border bg-white justify-center rounded-lg p-2 flex items-center gap-2 text-lg font-bold text-blue-400" disabled={isLoadingMarker}>
            {isLoadingMarker ? <ImSpinner2 className="animate-spin text-blue-400" size={20} /> : <MdPinDrop size={25} className="text-blue-400" />}
            ตำแหน่งปัจจุบัน
          </button>

          <button onClick={markerAddress} className="w-full bg-blue-400 rounded-lg p-2 flex items-center justify-center gap-2 text-lg font-bold text-white" disabled={isLoadingAddress}>
            {isLoadingAddress ? <ImSpinner2 className="animate-spin text-white" size={20} /> : <GiImpactPoint size={20} />}
            ปักหมาย
          </button>
        </div>


        <div className="w-full flex flex-col h-full">
          <div className="w-full flex">
            <button
              className={`p-2 flex w-full border-r justify-center ${stepPage === 1 ? 'border-b-4 text-black' : ''
                }`}
              onClick={() => handlePageChange(1)}
            >
              ทั่วไป
            </button>
            <button
              className={`p-2 flex w-full justify-center ${stepPage === 2 ? 'border-b-4 text-black' : ''
                }`}
              onClick={() => handlePageChange(2)}
            >
              ลำดับ
            </button>
          </div>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
