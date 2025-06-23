// Frontend React Component for ID Verification
import React, { useState, useRef } from 'react';
import axios from 'axios';

const IDCardVerification = () => {
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontPreview, setFrontPreview] = useState(null);
    const [backPreview, setBackPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);

    const handleImageChange = (e, side) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (side === 'front') {
                    setFrontImage(file);
                    setFrontPreview(event.target.result);
                } else {
                    setBackImage(file);
                    setBackPreview(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadAndVerify = async () => {
        if (!frontImage) {
            setError('Vui lòng chọn ảnh mặt trước CCCD');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('front', frontImage);
        if (backImage) {
            formData.append('back', backImage);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/user/upload/idcard',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-access-token': token
                    }
                }
            );

            setResult(response.data); // giả sử API trả JSON với thông tin xác minh
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Đã xảy ra lỗi khi tải lên và xác minh ID'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-4 border rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-center">Xác minh CCCD</h2>

            {/* Input mặt trước */}
            <div>
                <label className="block mb-2">Ảnh mặt trước:</label>
                <input
                    ref={frontInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'front')}
                    className="block w-full"
                />
                {frontPreview && (
                    <img src={frontPreview} alt="Front preview" className="mt-2 w-32 rounded border" />
                )}
            </div>

            {/* Input mặt sau */}
            <div>
                <label className="block mb-2">Ảnh mặt sau (tuỳ chọn):</label>
                <input
                    ref={backInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'back')}
                    className="block w-full"
                />
                {backPreview && (
                    <img src={backPreview} alt="Back preview" className="mt-2 w-32 rounded border" />
                )}
            </div>

            {/* Nút upload */}
            <button
                onClick={uploadAndVerify}
                disabled={loading}
                className={`w-full p-2 mt-4 rounded text-white ${
                    loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {loading ? 'Đang tải lên...' : 'Tải lên và xác minh'}
            </button>

            {/* Hiển thị lỗi */}
            {error && <p className="text-red-600 mt-2">{error}</p>}

            {/* Hiển thị kết quả */}
            {result && (
                <div className="mt-4 p-2 border rounded bg-green-50">
                    <h3 className="font-medium">Kết quả xác minh:</h3>
                    <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default IDCardVerification;