// src/components/MFASettings.js
import React, { useState } from "react";
import AuthService from "../services/auth.service";

const MFASettings = ({ user, onMFAStatusChange }) => {
    const [showSetup, setShowSetup] = useState(false);
    const [showDisable, setShowDisable] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [password, setPassword] = useState("");
    const [backupCodes, setBackupCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSetupMFA = () => {
        setLoading(true);
        setMessage("");
        
        AuthService.setupMFA().then(
            (response) => {
                setQrCode(response.data.qrCode);
                setSecret(response.data.secret);
                setShowSetup(true);
                setLoading(false);
                setMessage(response.data.message);
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setLoading(false);
            }
        );
    };

    const handleVerifyMFA = () => {
        if (!verificationCode) {
            setMessage("Vui lòng nhập mã xác thực.");
            return;
        }

        setLoading(true);
        AuthService.verifyMFA(verificationCode).then(
            (response) => {
                setBackupCodes(response.data.backupCodes);
                setShowSetup(false);
                setMessage(response.data.message);
                setLoading(false);
                onMFAStatusChange(true);
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setLoading(false);
            }
        );
    };

    const handleDisableMFA = () => {
        if (!password || !verificationCode) {
            setMessage("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        setLoading(true);
        AuthService.disableMFA(password, verificationCode).then(
            (response) => {
                setShowDisable(false);
                setPassword("");
                setVerificationCode("");
                setMessage(response.data.message);
                setLoading(false);
                onMFAStatusChange(false);
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setLoading(false);
            }
        );
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setMessage("Đã sao chép vào clipboard!");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Xác thực 2 lớp (MFA)
            </h4>

            <div className="mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user?.mfaEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${user?.mfaEnabled ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    {user?.mfaEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                </div>
            </div>

            <p className="text-gray-600 mb-4">
                Xác thực 2 lớp tăng cường bảo mật cho tài khoản của bạn bằng cách yêu cầu mã xác thực từ điện thoại khi đăng nhập.
            </p>

            {!user?.mfaEnabled ? (
                <div>
                    {!showSetup ? (
                        <button
                            onClick={handleSetupMFA}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                        >
                            {loading ? 'Đang thiết lập...' : 'Kích hoạt MFA'}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-bold mb-2">Bước 1: Quét mã QR</h5>
                                <p className="text-sm text-gray-600 mb-3">
                                    Sử dụng ứng dụng Google Authenticator hoặc Microsoft Authenticator để quét mã QR dưới đây:
                                </p>
                                {qrCode && <img src={qrCode} alt="QR Code" className="mx-auto" />}
                                
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-700">Hoặc nhập mã thủ công:</p>
                                    <div className="flex items-center mt-1">
                                        <code className="bg-gray-200 px-2 py-1 rounded text-sm break-all">{secret}</code>
                                        <button
                                            onClick={() => copyToClipboard(secret)}
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-bold mb-2">Bước 2: Nhập mã xác thực</h5>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        maxLength="6"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                                    />
                                    <button
                                        onClick={handleVerifyMFA}
                                        disabled={loading || !verificationCode}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                                    >
                                        {loading ? 'Đang xác thực...' : 'Xác thực'}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSetup(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Hủy thiết lập
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {!showDisable ? (
                        <button
                            onClick={() => setShowDisable(true)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Vô hiệu hóa MFA
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <h5 className="font-bold text-yellow-800 mb-2">Cảnh báo</h5>
                                <p className="text-yellow-700 text-sm">
                                    Việc vô hiệu hóa MFA sẽ làm giảm tính bảo mật của tài khoản. Bạn cần nhập mật khẩu và mã xác thực để xác nhận.
                                </p>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Mã xác thực
                                </label>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    maxLength="6"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={handleDisableMFA}
                                    disabled={loading || !password || !verificationCode}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                                >
                                    {loading ? 'Đang xử lý...' : 'Xác nhận vô hiệu hóa'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDisable(false);
                                        setPassword("");
                                        setVerificationCode("");
                                    }}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Display backup codes after setup */}
            {backupCodes.length > 0 && (
                <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">Mã khôi phục</h5>
                    <p className="text-green-700 text-sm mb-3">
                        Lưu các mã này ở nơi an toàn. Bạn có thể sử dụng chúng để đăng nhập khi không có thiết bị xác thực.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {backupCodes.map((code, index) => (
                            <code key={index} className="bg-white px-2 py-1 rounded text-sm border">
                                {code}
                            </code>
                        ))}
                    </div>
                    <button
                        onClick={() => copyToClipboard(backupCodes.join('\n'))}
                        className="mt-2 text-green-600 hover:text-green-800 text-sm"
                    >
                        📋 Sao chép tất cả
                    </button>
                </div>
            )}

            {message && (
                <div className={`mt-4 p-3 rounded ${message.includes('thành công') || message.includes('clipboard') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`} role="alert">
                    {message}
                </div>
            )}
        </div>
    );
};

export default MFASettings;