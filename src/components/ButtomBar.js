import { useState, useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { FaAngleDoubleUp } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { GiImpactPoint } from "react-icons/gi";
import { MdPinDrop } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import PageLoading from "./PageLoading";
import ModalMarker from "./ModalMarker";

function Map() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [up, setUp] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isLoadingMarker, setIsLoadingMarker] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    useEffect(() => {
        if (!isLoaded || loadError) return;

        const initializeMap = () => {
            if (mapRef.current && window.google && window.google.maps) {
                const mapInstance = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 15.87, lng: 100.9925 },
                    zoom: 8,
                });
                setMap(mapInstance);
            }
        };

        initializeMap();
    }, [isLoaded, loadError]);

    const handleAddMarker = () => {
        setUp(false);
        setIsLoadingMarker(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                if (marker) {
                    marker.setMap(null);
                }

                const newMarker = new window.google.maps.Marker({
                    position: currentLocation,
                    map: map,
                    title: "ตำแหน่งปัจจุบัน",
                });

                setMarker(newMarker);
                map.panTo(currentLocation);
                map.setZoom(15);
                setIsLoadingMarker(false); 
            }, () => setIsLoadingMarker(false));
        }
    };

    const markerAddress = () => {
        setIsOpenModal(true)
        setUp(false);
        setIsLoadingAddress(true); 

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                map.panTo(currentLocation);
                map.setZoom(15);
                setIsLoadingAddress(false); 
            }, () => setIsLoadingAddress(false)); 
        }
    };

    if (!isLoaded) {
        return <PageLoading />;
    }

    if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;

    return (
        <>
            <ModalMarker isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />
            <div className="fixed inset-0">
                <div ref={mapRef} className="w-full h-full" />
            </div>
            <div className={`w-full flex flex-col gap-4 transition-all duration-300 ease-in-out ${up ? "h-[80%]" : "h-[14%]"} bg-white fixed bottom-0 z-10 rounded-t-[40px] p-4`}>
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
                    <button
                        onClick={handleAddMarker}
                        className="w-full border-blue-400 border bg-white rounded-lg p-2 flex items-center gap-2 text-lg font-bold text-blue-400"
                        disabled={isLoadingMarker}
                    >
                        {isLoadingMarker ? (
                            <>
                                <ImSpinner2 className="animate-spin text-blue-400" size={20} />
                                กำลังโหลด...
                            </>
                        ) : (
                            <>
                                <MdPinDrop size={25} className="text-blue-400" />
                                ตำแหน่งปัจจุบัน
                            </>
                        )}
                    </button>

                    <button
                        onClick={markerAddress}
                        className="w-full bg-blue-400 rounded-lg p-2 flex items-center justify-center gap-2 text-lg font-bold text-white"
                        disabled={isLoadingAddress} 
                    >
                        {isLoadingAddress ? (
                            <>
                                <ImSpinner2 className="animate-spin text-white" size={20} />
                                กำลังโหลด...
                            </>
                        ) : (
                            <>
                                <GiImpactPoint size={20} />
                                ปักหมาย
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

export default Map;
