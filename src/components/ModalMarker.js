import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import UploadSuccess from "@/components/UploadSuccess";


const ModalMarker = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const token = getCookie("token");
  const [userData, setUserData] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("token");
        if (!token) throw new Error("No authentication token found");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUserData(String(data.id));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    name: "", 
    description: "",
    spotImage: null,
    fee: "",
    difficulty: "",

    fishName: "",
    fishImage: null,

    baitType: "",
    baitBrand: "",
    baitEffectiveness: "",
    baitImage: null,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };


  const [submit, setSubmit] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmit(true)
      const formDataToSend = new FormData();

      const currentLocation = await new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error) => {
              reject(error);
            }
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });

      formDataToSend.append("lat", String(currentLocation.lat));
      formDataToSend.append("lng", String(currentLocation.lng));
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("fee", formData.fee.toUpperCase());
      formDataToSend.append("difficulty", formData.difficulty.toUpperCase());
      if (userData) {
        formDataToSend.append("userId", userData);
      }
      if (formData.spotImage) {
        formDataToSend.append("spotImage", formData.spotImage);
      }

      formDataToSend.append("fishName", formData.fishName);
      if (formData.fishImage) {
        formDataToSend.append("fishImage", formData.fishImage);
      }

      formDataToSend.append("baitType", formData.baitType.toUpperCase());
      formDataToSend.append("baitBrand", formData.baitBrand);
      formDataToSend.append("baitEffectiveness", formData.baitEffectiveness.toUpperCase());
      if (formData.baitImage) {
        formDataToSend.append("baitImage", formData.baitImage);
      }

      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marked-spot`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Spot created successfully:", result);
      setUploadSuccess(true)
    } catch (error) {
      console.error("Error creating spot:", error);
    } finally {
      setSubmit(false)
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);



  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-700">
              ข้อมูลหมาย (Spot Information)
            </h3>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">🏞 ชื่อหมาย</label>
              <input
                type="text"
                name="name" 
                value={formData.name}
                placeholder="โปรดใส่ชื่อหมาย"
                className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">รายละเอียด</label>
              <textarea
                name="description"
                value={formData.description}
                placeholder="โปรดใส่รายละเอียดหมาย"
                className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                📸 อัพโหลดรูปหมาย
              </label>
              <input
                type="file"
                name="spotImage"
                accept="image/*"
                className="border-2 p-2 rounded-lg bg-gray-100 cursor-pointer"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                💰 ค่าใช้จ่ายในการเข้าหมาย
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="fee"
                  value="paid"
                  onChange={handleChange}
                  required
                />
                <label>มีค่าใช้จ่าย</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="fee"
                  value="free"
                  onChange={handleChange}
                  required
                />
                <label>ไม่มีค่าใช้จ่าย</label>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                🚶 ความยากในการเข้าหมาย
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  onChange={handleChange}
                  required
                />
                <label>เดินเท้าเข้าได้เลย</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  onChange={handleChange}
                  required
                />
                <label>เป็นพื้นที่รก</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  onChange={handleChange}
                  required
                />
                <label>ต้องใช้ยานพาหนะพิเศษ</label>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-700">
              ข้อมูลปลา (Fish Information)
            </h3>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">🐟 ชื่อปลา</label>
              <input
                type="text"
                name="fishName"
                value={formData.fishName}
                placeholder="โปรดใส่ชื่อปลาที่ตกได้"
                className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                📷 อัพโหลดรูปปลาที่ได้
              </label>
              <input
                type="file"
                name="fishImage"
                accept="image/*"
                className="border-2 p-2 rounded-lg bg-gray-100 cursor-pointer"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-700">
              ข้อมูลเหยื่อ (Bait Information)
            </h3>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                🎣 ประเภทเหยื่อ
              </label>
              <select
                name="baitType"
                value={formData.baitType}
                onChange={handleChange}
                className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">เลือกประเภทเหยื่อ</option>
                <option value="live">เหยื่อสด</option>
                <option value="artificial">เหยื่อปลอม</option>
                <option value="natural">เหยื่อธรรมชาติ</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                🏷 ยี่ห้อ/ชนิดเหยื่อ
              </label>
              <input
                type="text"
                name="baitBrand"
                value={formData.baitBrand}
                placeholder="ระบุยี่ห้อหรือชนิดเหยื่อ"
                className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />

            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                ⭐ ประสิทธิภาพของเหยื่อ
              </label>
              <select
                name="baitEffectiveness"
                value={formData.baitEffectiveness}
                onChange={handleChange}
                className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">เลือกประสิทธิภาพ</option>
                <option value="excellent">ดีมาก</option>
                <option value="good">ดี</option>
                <option value="fair">พอใช้</option>
                <option value="poor">แย่</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                📷 อัพโหลดรูปเหยื่อที่ใช้
              </label>
              <input
                type="file"
                name="baitImage"
                accept="image/*"
                className="border-2 p-2 rounded-lg bg-gray-100 cursor-pointer"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <UploadSuccess isOpen={uploadSuccess} isClose={() => {setUploadSuccess(false), onClose()}} />
      <div className="bg-white p-6 rounded-xl shadow-xl w-96 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          📍 รายละเอียดหมาย
        </h2>

        <div className="mb-4">
          <div className="flex justify-evenly items-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step === i
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {i}
                </div>
                {i < 3 && <div className="mx-2">------</div>}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {renderStepContent()}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                ย้อนกลับ
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ml-auto"
              >
                ถัดไป
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ml-auto"
              >
               {submit ? "บันทึก..." : "บันทึก"} 
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalMarker;
