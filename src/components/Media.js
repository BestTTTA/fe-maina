import Image from "next/image";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";

const Media = ({ userData }) => {
  console.log(userData)
  const [currentIndices, setCurrentIndices] = useState(
    Object.fromEntries(userData.map(data => [data.id, 0]))
  );

  const getImageUrl = (url) => {
    if (!url) return "/default-marker.png";
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_MINIO_BASE_URL}/${encodeURI(url)}`;
  };

  const getImages = (data) => {
    return [
      data?.spotImages?.[0]?.url,
      data?.catches?.[0]?.images?.[0]?.url,
      data?.catches?.[0]?.bait?.imageUrl,
    ].filter(Boolean);
  };

  const handlePrevClick = (id, imagesLength) => {
    setCurrentIndices(prev => ({
      ...prev,
      [id]: prev[id] === 0 ? imagesLength - 1 : prev[id] - 1
    }));
  };

  const handleNextClick = (id, imagesLength) => {
    setCurrentIndices(prev => ({
      ...prev,
      [id]: (prev[id] + 1) % imagesLength
    }));
  };

  return (
    <div className="flex flex-col w-full gap-4 overflow-auto mt-4">
      {userData.map((data) => {
        const images = getImages(data);
        const currentIndex = currentIndices[data.id] || 0;

        return (
          <div key={data.id} className="w-full border rounded-md p-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={getImageUrl(data.user.avatar)}
                alt={data.user.email}
                className="rounded-full border"
                width={30}
                height={30}
                placeholder="blur"
                blurDataURL="/blur.avif"
              />
              <div className="flex justify-between w-full">
                <p className="text-black text-[12px]"><strong>{data.user.name}</strong></p>
                <p className="text-black text-[12px]">
                  {new Date(new Date(data.createdAt).getTime() - (7 * 60 * 60 * 1000)).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </p>
              </div>
            </div>
            {images.length > 0 && (
              <div className="relative w-full aspect-video flex justify-center border border-gray-300 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(images[currentIndex])}
                  alt={`Image ${currentIndex + 1} of ${images.length}`}
                  className="object-cover"
                  fill
                  placeholder="blur"
                  blurDataURL="/blur.avif"
                />

                {images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button
                      onClick={() => handlePrevClick(data.id, images.length)}
                      className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
                      aria-label="Previous image"
                    >
                      <IoChevronBack size={24} />
                    </button>
                    <button
                      onClick={() => handleNextClick(data.id, images.length)}
                      className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
                      aria-label="Next image"
                    >
                      <IoChevronForward size={24} />
                    </button>
                  </div>
                )}

                {/* เพิ่ม indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndices(prev => ({
                          ...prev,
                          [data.id]: index
                        }))}
                        className={`w-2 h-2 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-white/50'
                          }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div>
              <p><strong>ชื่อหมาย</strong>: {data.name}</p>
              <p><strong>รายละเอียด</strong>: {data.description}</p>
              <p><strong>รายละเอียด</strong>: {data.catches[0]?.fishName}</p>
              <p><strong>ชื่อเหยื่อ</strong>: {data.catches[0]?.bait.brand}</p>
              <p><strong>ความยากในการเข้าหมาย</strong>: {data.difficulty}</p>
              <p><strong>ค่าใช้จ่ายในการเข้าหมาย</strong>: {data.fee}</p>
            </div>
            <div className="flex justify-end w-full">
            <button
              onClick={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`;
                window.open(url, '_blank');
              }}
              className="bg-blue-500 flex justify-center hover:bg-blue-600 text-white p-2 rounded-md text-sm transition-colors"
            >
              <FaMapMarkerAlt size={18} color="white"/>
              ไปที่หมาย
            </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Media;