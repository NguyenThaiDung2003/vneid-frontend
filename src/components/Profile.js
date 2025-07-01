// --- Thiết kế lại hoàn toàn trang Profile ---
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";


// Component con cho việc upload ảnh để tái sử dụng
const ImageUpload = ({ onDrop, initialImage, title }) => {
    const [preview, setPreview] = useState(initialImage);

    const onDropAccepted = useCallback(acceptedFiles => {
        onDrop(acceptedFiles[0]);
        setPreview(URL.createObjectURL(acceptedFiles[0]));
    }, [onDrop]);

    useEffect(() => {
        setPreview(initialImage);
    }, [initialImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDropAccepted,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        maxFiles: 1
    });

    return (
        <div {...getRootProps()} className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer ${isDragActive ? 'border-blue-500' : ''}`}>
            <div className="space-y-1 text-center">
                {preview ? (
                    <img src={preview} alt="Preview" className="mx-auto h-24 w-36 object-cover " />
                ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
                <div className="flex text-sm text-gray-600">
                    <p className="pl-1">{title}</p>
                </div>
                 <input {...getInputProps()} />
                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
            </div>
        </div>
    );
};


const Profile = () => {
    const { register, handleSubmit, reset} = useForm();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [idFrontFile, setIdFrontFile] = useState(null);
    const [idBackFile, setIdBackFile] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [isMfaLoading, setIsMfaLoading] = useState(false);
    // Fetch profile data on component mount
    useEffect(() => {
        UserService.getProfile().then(
            (response) => {
                const user = response.data;
                setCurrentUser(user);
                setMfaEnabled(user.mfa?.enabled || false);
                // Populate form with fetched data
                const profile = user.profile || {};
                const health =user.health||{};
                const dateOfBirth = profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '';
                reset({
                    fullName: profile.fullName,
                    idNumber: profile.idNumber,
                    phoneNumber: profile.phoneNumber,
                    address: profile.address,
                    dateOfBirth: dateOfBirth,
                    gender: profile.gender,
                    height: health.height || "",
                    weight: health.weight || "",
                    bloodType: health.bloodType || "",
                    chronicDiseases: health.chronicDiseases || "",
                    allergies: health.allergies || "",
                });
                setLoading(false);
                console.log(response.data);
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setLoading(false);
            }
        );
        
    }, [reset]);
    const handleGetVerify=()=>{
             UserService.getVerificationStatus().then(
            (res) => {
                if (res.data?.success) {
                    setVerificationStatus(res.data.data);
                }
            },
            (err) => {
                console.error("Verification status fetch error:", err);
            }
        );
    }
    useEffect(() => {
       handleGetVerify();
    }, []);

    const handleProfileUpdate = (data) => {
    setMessage("");
    setLoading(true);

    const profileData = {
        firstName: data.fullName.split(' ')[0] || '',
        lastName: data.fullName.split(' ').slice(1).join(' ') || '',
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        idNumber: data.idNumber,
        address: data.address,
    };

    UserService.updateProfile(profileData).then(
        (response) => {
        setLoading(false);
        setMessage("Cập nhật hồ sơ thành công!");
        },
        (error) => {
        setLoading(false);
        setMessage(error?.response?.data?.message || error.message || error.toString());
        }
    );
    };

    const handleHealthUpdate = (data) => {
        setMessage("");
        setLoading(true);

        const healthData = {
            height: data.height,
            weight: data.weight,
            bloodType: data.bloodType,
            chronicDiseases: data.chronicDiseases,
            allergies: data.allergies,
        };

        UserService.updateUserHealth(healthData)
            .then(() => {
            setLoading(false);
            setMessage("Cập nhật thông tin sức khỏe thành công!");
            })
            .catch((error) => {
            setLoading(false);
            setMessage(
                error?.response?.data?.message || "Lỗi khi cập nhật sức khỏe."
            );
            });
        };

    const handleAvatarUpload = () => {
        if (!avatarFile) return;
        setLoading(true);
        UserService.uploadAvatar(avatarFile).then(response => {
            setLoading(false);
            setMessage("Cập nhật ảnh đại diện thành công!");
            // Cập nhật lại user trong localStorage nếu cần
            const localUser = AuthService.getCurrentUser();
            if(localUser) {
                localUser.profile = response.data.user.profile;
                localStorage.setItem("user", JSON.stringify(localUser));
            }
        }).catch(error => {
            setLoading(false);
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            setMessage(resMessage);
        })
    }
    
    const handleIdCardUpload = () => {
        if (!idFrontFile || !idBackFile) return;

        setLoading(true);
        UserService.uploadIdCard(idFrontFile, idBackFile)
            .then(() => {
            setLoading(false);
            setMessage("Tải CCCD thành công!");
            })
            .catch((error) => {
            setLoading(false);
            setMessage(error?.response?.data?.message || error.message);
            });
        handleGetVerify();
        };
    if (loading) {
        return <div className="text-center">Đang tải hồ sơ...</div>;
    }

    if (!currentUser) {
        return <div className="text-center text-red-500">Không thể tải hồ sơ. Vui lòng đăng nhập lại.</div>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            <header className="mb-6">
                <h3 className="text-3xl font-bold">
                    Hồ sơ của <strong>{currentUser.email}</strong>
                </h3>
            </header>

            {/* Form cập nhật thông tin */}
            <form onSubmit={handleSubmit(handleProfileUpdate)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Họ và tên</label>
                        <input {...register("fullName")} className="input-style" />
                    </div>
                     <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Số CCCD</label>
                        <input {...register("idNumber")} className="input-style" />
                    </div>
                     <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Số điện thoại</label>
                        <input {...register("phoneNumber")} className="input-style" />
                    </div>
                     <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Ngày sinh</label>
                        <input type="date" {...register("dateOfBirth")} className="input-style" />
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Địa chỉ</label>
                        <input {...register("address")} className="input-style" />
                    </div>
                     <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Giới tính</label>
                        <select {...register("gender")} className="input-style">
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
            
            {/* Phần upload ảnh */}
            <div className="mt-8 border-t pt-6">
                 <h4 className="text-xl font-bold mb-4">Ảnh hồ sơ</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Ảnh đại diện</label>
                        <ImageUpload onDrop={setAvatarFile} initialImage={currentUser.profile?.avatar} title="Kéo thả hoặc chọn ảnh đại diện"/>
                        <button onClick={handleAvatarUpload} className="mt-2 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" disabled={!avatarFile || loading}>Tải ảnh đại diện</button>
                     </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">CCCD mặt trước</label>
                        <ImageUpload onDrop={setIdFrontFile} initialImage={currentUser.verification?.documents?.frontImagePath} title="Kéo thả hoặc chọn ảnh"/>
                       
                     </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">CCCD mặt sau</label>
                         <ImageUpload onDrop={setIdBackFile} initialImage={currentUser.verification?.documents?.backImagePath} title="Kéo thả hoặc chọn ảnh"/>
                         
                     </div>
                      <button
                                onClick={handleIdCardUpload}
                                disabled={loading || !idFrontFile || !idBackFile}
                                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                                >
                                Tải CCCD
                        </button>
                 </div>
                 {/* Bạn có thể thêm nút upload cho CCCD ở đây */}
            </div>


            {message && (
                <div className="mt-4 p-4 rounded bg-yellow-100 border border-yellow-400 text-yellow-700" role="alert">
                    {message}
                </div>
            )}

            <hr className="my-6" />
             <form onSubmit={handleSubmit(handleHealthUpdate)}>
            <h4 className="text-xl font-bold mb-2">Thông tin sức khỏe</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Chiều cao (cm)</label>
                <input {...register("height")} className="input-style" />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Cân nặng (kg)</label>
                <input {...register("weight")} className="input-style" />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nhóm máu</label>
                <input {...register("bloodType")} className="input-style" placeholder="VD:A, B, AB, O, unknown" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Bệnh lý mãn tính</label>
                <input {...register("chronicDiseases")} className="input-style" placeholder="VD: Tiểu đường, huyết áp cao" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Dị ứng</label>
                <input {...register("allergies")} className="input-style" placeholder="VD: Dị ứng thuốc, hải sản" />
            </div>
            </div>
            <div className="mt-6">
                <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                >
                    {loading ? 'Đang lưu...' : 'Cập nhật sức khỏe'}
                </button>
                </div>
            </form>

            {verificationStatus && (
                    <div className="mt-6 bg-gray-50 border p-4 rounded-md">
                        <h4 className="text-lg font-bold mb-2">Trạng thái xác minh</h4>
                        <p><strong>Trạng thái:</strong> {verificationStatus.status}</p>
                        {verificationStatus.reviewedBy && (
                            <p><strong>Người duyệt:</strong> {verificationStatus.reviewedBy.email}</p>
                        )}
                        {verificationStatus.reviewedAt && (
                            <p><strong>Ngày duyệt:</strong> {new Date(verificationStatus.reviewedAt).toLocaleString()}</p>
                        )}
                        {verificationStatus.reviewNotes && (
                            <p><strong>Ghi chú:</strong> {verificationStatus.reviewNotes}</p>
                        )}
                        {verificationStatus.verificationScore && (
                            <p><strong>Độ chính xác AI:</strong> {verificationStatus.verificationScore}%</p>
                        )}
                        {verificationStatus.errors?.length > 0 && (
                            <p className="text-red-600"><strong>Lỗi:</strong> {verificationStatus.errors.join(", ")}</p>
                        )}
                        {verificationStatus.warnings?.length > 0 && (
                            <p className="text-yellow-600"><strong>Cảnh báo:</strong> {verificationStatus.warnings.join(", ")}</p>
                        )}
                    </div>
                )}
                        {/*mfa */}
                    <div className="mt-6 border-t pt-6">
                    <h4 className="text-xl font-bold mb-4">Xác thực đa yếu tố (MFA)</h4>

                    <p className="mb-2">
                        Trạng thái MFA:{" "}
                        <strong className={mfaEnabled ? "text-green-600" : "text-red-600"}>
                        {mfaEnabled ? "Đã bật" : "Chưa bật"}
                        </strong>
                    </p>

                    {!mfaEnabled ? (
                        <>
                        <button
                            onClick={async () => {
                            setIsMfaLoading(true);
                            try {
                                const res = await AuthService.setupMFA();
                                setMessage(res.data.message || "Đã gửi mã OTP tới email.");
                            } catch (err) {
                                setMessage(err?.response?.data?.message || err.message);
                            }
                            setIsMfaLoading(false);
                            }}
                            className="mb-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                            disabled={isMfaLoading}
                        >
                            {isMfaLoading ? "Đang gửi OTP..." : "Gửi mã OTP đến email"}
                        </button>

                        <div className="flex items-center space-x-2 mb-2">
                            <input
                            type="text"
                            placeholder="Nhập mã OTP"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            className="input-style w-64"
                            />
                            <button
                            onClick={async () => {
                                setIsMfaLoading(true);
                                try {
                                const res=await AuthService.verifyMFA(otpInput);
                                setMessage("MFA đã được bật thành công.");
                                setMfaEnabled(true);
                                } catch (err) {
                                setMessage(err?.response?.data?.message || err.message);
                                }
                                setIsMfaLoading(false);
                            }}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                            Xác nhận OTP
                            </button>
                        </div>
                        </>
                    ) : (
                        <button
                        onClick={async () => {
                            const respon =await AuthService.sendDisable();
                            const password = prompt("Nhập mật khẩu để tắt MFA:");
                            const otp = prompt("Nhập mã OTP vừa gửi đến email:");

                            if (!password || !otp) return;

                            setIsMfaLoading(true);
                            try {
                            const res = await AuthService.disableMFA(password, otp);
                            setMessage(res.data.message || "MFA đã được tắt.");
                            setMfaEnabled(false);
                            } catch (err) {
                            setMessage(err?.response?.data?.message || err.message);
                            }
                            setIsMfaLoading(false);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                        Tắt MFA
                        </button>
                    )}
                    </div>
        </div>
    );
};
// Thêm style cho input để tránh lặp lại
const styles = `
.input-style {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    appearance: none;
    border-radius: 0.375rem;
    border-width: 1px;
    width: 100%;
    padding: 0.5rem 0.75rem;
    color: #4a5568;
    line-height: 1.5;
}
.input-style:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
    border-color: #4299e1;
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default Profile;