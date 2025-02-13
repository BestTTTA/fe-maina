import { IoCheckmarkDoneCircle } from "react-icons/io5";

function UploadSuccess({ isOpen, isClose }) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div className="bg-white p-6 rounded-xl shadow-xl w-52 h-52 relative">
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
                    onClick={isClose}
                >
                    &times;
                </button>
                <div className="flex flex-col w-full h-full justify-center items-center">
                    <IoCheckmarkDoneCircle size={40} color="green" />
                    <h1>ปักหมายสำเร็จ</h1>
                </div>
            </div>
        </div>
    )
}

export default UploadSuccess
