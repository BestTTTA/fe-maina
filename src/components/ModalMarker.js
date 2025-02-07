import { useState } from "react";

const ModalMarker = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    addressName: "",
    fishName: "",
    fee: "",
    difficulty: "",
    spotImage: null,
    fishImage: null,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96 relative">
        {/* ปุ่มปิด Modal */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-700">📍 รายละเอียดหมาย</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ชื่อหมาย */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">🏞 ชื่อหมาย</label>
            <input
              type="text"
              name="addressName"
              value={formData.addressName}
              placeholder="โปรดใส่ชื่อหมาย"
              className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
          </div>

          {/* อัพโหลดรูปหมาย */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">📸 อัพโหลดรูปหมาย</label>
            <input
              type="file"
              name="spotImage"
              accept="image/*"
              className="border-2 p-2 rounded-lg bg-gray-100 cursor-pointer"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* ผลงาน */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">🐟 ผลงาน</label>
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

          {/* อัพโหลดรูปปลาที่ตกได้ */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">📷 อัพโหลดรูปปลาที่ได้</label>
            <input
              type="file"
              name="fishImage"
              accept="image/*"
              className="border-2 p-2 rounded-lg bg-gray-100 cursor-pointer"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* ค่าใช้จ่าย */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">💰 ค่าใช้จ่ายในการเข้าหมาย</label>
            <div className="flex items-center gap-3">
              <input type="radio" name="fee" value="paid" onChange={handleChange} required />
              <label>มีค่าใช้จ่าย</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="radio" name="fee" value="free" onChange={handleChange} required />
              <label>ไม่มีค่าใช้จ่าย</label>
            </div>
          </div>

          {/* ความยากในการเข้าหมาย */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">🚶 ความยากในการเข้าหมาย</label>
            <div className="flex items-center gap-3">
              <input type="radio" name="difficulty" value="easy" onChange={handleChange} required />
              <label>เดินเท้าเข้าได้เลย</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="radio" name="difficulty" value="medium" onChange={handleChange} required />
              <label>เป็นพื้นที่รก</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="radio" name="difficulty" value="hard" onChange={handleChange} required />
              <label>ต้องใช้ยานพาหนะพิเศษ</label>
            </div>
          </div>

          {/* ปุ่มส่งฟอร์ม */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            ✅ ส่งข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalMarker;
