import React, { useState, useEffect } from 'react';
// THAY ĐỔI LỚN NHẤT: Thay thế 'lucide-react' bằng 'react-icons/lu'
// Các icon trong 'lucide-react' thường có tên giống hoặc tương tự trong 'react-icons/lu'
import { LuUsers, LuUserCheck, LuShield, LuClock, LuTrendingUp ,LuX} from 'react-icons/lu';
import AdminService from "../services/admin.service";

const AdminBoard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    pendingVerifications: 0,
    mfaEnabledUsers: 0,
    recentRegistrations: 0
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // URL của ảnh đang được xem
  const [selectedUserForComparison, setSelectedUserForComparison] = useState(null); // Thông tin user để so sánh

  // Simulate API calls (replace with actual API calls)
  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, [currentPage, searchTerm, statusFilter, verificationFilter]);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call to /api/admin/dashboard
      // Replace with actual API call
      const res = await AdminService.getDashboard() ;
      setDashboardData(res.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAllUsers({ // Use AdminService
        page: currentPage,
        search: searchTerm,
        status: statusFilter,
        verification: verificationFilter,
        limit: 10 // Or whatever your desired limit is
      });
      setUsers(response.data.users); // Assuming response.data contains a 'users' array
      setTotalPages(response.data.totalPages); // Assuming response.data contains 'totalPages'
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      // Handle error
    }
  };
   const handleImageClick = (imageUrl, user) => {
    setSelectedImage(imageUrl);
    setSelectedUserForComparison(user);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedUserForComparison(null);
  };
   const getGenderDisplayName = (genderValue) => {
    switch (genderValue) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      case 'other':
        return 'Khác';
      default:
        return 'N/A'; // Hoặc một giá trị mặc định khác nếu không khớp
    }
  };

  const handleVerificationStatusChange = async (userId, status, notes = '') => {
    try {
      await AdminService.updateVerificationStatus(userId, status, notes); // Use AdminService
      console.log(`Verification status for user ${userId} updated to ${status}`);
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error('Error updating verification status:', error);
      // Handle error
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await AdminService.toggleUserStatus(userId); // Use AdminService
      console.log(`Toggled status for user ${userId}`);
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error('Error toggling user status:', error);
      // Handle error
    }
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: { color: 'bg-green-100 text-green-800', text: 'Đã xác minh' },
      pending_review: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ duyệt' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Từ chối' },
      needs_improvement: { color: 'bg-orange-100 text-orange-800', text: 'Cần cải thiện' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: 'Chưa xác minh' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {/* Đây vẫn hoạt động bình thường vì Icon là một component React được truyền vào */}
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý người dùng và theo dõi thống kê hệ thống
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard
            title="Tổng người dùng"
            value={dashboardData.totalUsers}
            icon={LuUsers} // Dùng LuUsers từ react-icons/lu
            color="text-blue-600"
          />
          <StatCard
            title="Người dùng hoạt động"
            value={dashboardData.activeUsers}
            icon={LuUserCheck} // Dùng LuUserCheck từ react-icons/lu
            color="text-green-600"
          />
          <StatCard
            title="Đã xác minh"
            value={dashboardData.verifiedUsers}
            icon={LuShield} // Dùng LuShield từ react-icons/lu
            color="text-purple-600"
          />
          <StatCard
            title="Chờ duyệt"
            value={dashboardData.pendingVerifications}
            icon={LuClock} // Dùng LuClock từ react-icons/lu
            color="text-yellow-600"
          />
          <StatCard
            title="Bật MFA"
            value={dashboardData.mfaEnabledUsers}
            icon={LuShield} // Dùng LuShield từ react-icons/lu (nếu muốn dùng lại)
            color="text-indigo-600"
          />
          <StatCard
            title="Đăng ký gần đây"
            value={dashboardData.recentRegistrations}
            icon={LuTrendingUp} // Dùng LuTrendingUp từ react-icons/lu
            color="text-orange-600"
          />
        </div>

        {/* User Management */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quản lý người dùng
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Danh sách người dùng và trạng thái xác minh
            </p>
          </div>

          {/* Filters */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo email hoặc tên..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
              <div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                >
                  <option value="">Tất cả xác minh</option>
                  <option value="verified">Đã xác minh</option>
                  <option value="pending_review">Chờ duyệt</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </div>
          </div>

          {/* User List - Cập nhật phần hiển thị ảnh */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">Không tìm thấy người dùng nào</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.profile?.firstName?.[0] || user.email[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {user.profile?.firstName && user.profile?.lastName
                              ? `${user.profile.firstName} ${user.profile.lastName}`
                              : 'Chưa cập nhật'}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Hoạt động' : 'Khóa'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center mt-1">
                          {getStatusBadge(user.verification?.status)}
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        {/* THÔNG TIN IDCARD */}
                        {user.verification?.idCard?.idNumber && (
                          <div className="mt-3 text-sm text-gray-600 space-y-1">
                            <p><strong>CCCD/CMND:</strong> {user.verification.idCard.idNumber}</p>
                            <p><strong>Họ tên trên CCCD:</strong> {user.verification.idCard.name || 'N/A'}</p>
                            <p><strong>Ngày sinh trên CCCD:</strong> {user.verification.idCard.dateOfBirth || 'N/A'}</p>
                            <p><strong>Giới tính trên CCCD:</strong> {user.verification.idCard.gender || 'N/A'}</p>
                            <p><strong>Địa chỉ trên CCCD:</strong> {user.verification.idCard.address || 'N/A'}</p>
                            {user.verification.idCard.verifiedAt && (
                              <p><strong>Xác minh lúc:</strong> {new Date(user.verification.idCard.verifiedAt).toLocaleString('vi-VN')}</p>
                            )}
                          </div>
                        )}

                        {/* HIỂN THỊ ẢNH ID CARD - THÊM onClick */}
                        {user.verification?.documents?.frontImagePath && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Ảnh CCCD/CMND mặt trước:</p>
                            <img
                              src={user.verification.documents.frontImagePath}
                              alt="ID Card Front"
                              className="w-32 h-20 object-cover rounded-md border border-gray-200 cursor-pointer transition-all duration-200 hover:scale-105"
                              onClick={() => handleImageClick(user.verification.documents.frontImagePath, user)}
                              onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder-image.png"; }} // Đảm bảo bạn có ảnh placeholder này
                            />
                          </div>
                        )}
                        {user.verification?.documents?.backImagePath && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Ảnh CCCD/CMND mặt sau:</p>
                            <img
                              src={user.verification.documents.backImagePath}
                              alt="ID Card Back"
                              className="w-32 h-20 object-cover rounded-md border border-gray-200 cursor-pointer transition-all duration-200 hover:scale-105"
                              onClick={() => handleImageClick(user.verification.documents.backImagePath, user)}
                              onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder-image.png"; }} // Đảm bảo bạn có ảnh placeholder này
                            />
                          </div>
                        )}

                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.verification?.status === 'pending_review' && (
                        <>
                          <button
                            onClick={() => handleVerificationStatusChange(user._id, 'verified')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleVerificationStatusChange(user._id, 'rejected')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleToggleUserStatus(user._id)}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                          user.isActive
                            ? 'text-red-700 bg-red-100 hover:bg-red-200'
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        {user.isActive ? 'Khóa' : 'Mở khóa'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Trang <span className="font-medium">{currentPage}</span> trên{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
                {/* Modal hiển thị ảnh lớn và so sánh */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 relative flex flex-col lg:flex-row gap-6">
            {/* Nút đóng */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LuX className="h-6 w-6" />
            </button>

            {/* Phần hiển thị ảnh lớn */}
            <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-0">
              <img src={selectedImage} alt="Large View" className="max-w-full max-h-[70vh] object-contain rounded-md shadow-md" />
            </div>

            {/* Phần thông tin để so sánh */}
            <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Thông tin đối chiếu</h3>

              {selectedUserForComparison && (
                <div className="space-y-3 text-sm">
                  {/* Thông tin từ Profile */}
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-semibold text-gray-700 mb-2">Thông tin khai báo (Profile):</p>
                    <p><strong>Họ & Tên:</strong> {selectedUserForComparison.profile?.firstName} {selectedUserForComparison.profile?.lastName}</p>
                    <p><strong>Ngày sinh:</strong> {selectedUserForComparison.profile?.dateOfBirth ? new Date(selectedUserForComparison.profile.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    <p><strong>Giới tính:</strong> {getGenderDisplayName(selectedUserForComparison.profile?.gender) || 'N/A'}</p>
                    <p><strong>Địa chỉ:</strong> {selectedUserForComparison.profile?.address || 'N/A'}</p>
                    <p><strong>Số điện thoại:</strong> {selectedUserForComparison.profile?.phoneNumber || 'N/A'}</p>
                    <p><strong>CCCD/CMND (khai báo):</strong> {selectedUserForComparison.profile?.idNumber || 'N/A'}</p>
                  </div>

                  {/* Thông tin từ ID Card (OCR/Xác minh) */}
                  {selectedUserForComparison.verification?.idCard && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="font-semibold text-gray-700 mb-2">Thông tin từ CCCD/CMND (Xác minh):</p>
                      <p><strong>CCCD/CMND:</strong> {selectedUserForComparison.verification.idCard.idNumber || 'N/A'}</p>
                      <p><strong>Họ & Tên:</strong> {selectedUserForComparison.verification.idCard.name || 'N/A'}</p>
                      <p><strong>Ngày sinh:</strong> {selectedUserForComparison.verification.idCard.dateOfBirth || 'N/A'}</p>
                      <p><strong>Giới tính:</strong> {selectedUserForComparison.verification.idCard.gender || 'N/A'}</p>
                      <p><strong>Địa chỉ:</strong> {selectedUserForComparison.verification.idCard.address || 'N/A'}</p>
                      {/* Có thể thêm verificationScore, validationErrors, completeness nếu muốn */}
                    </div>
                  )}

                  {/* Trạng thái xác minh */}
                  <div className="text-xs text-gray-600">
                    <p><strong>Trạng thái xác minh:</strong> {getStatusBadge(selectedUserForComparison.verification?.status)}</p>
                    {selectedUserForComparison.verification?.reviewedAt && (
                      <p><strong>Đánh giá lúc:</strong> {new Date(selectedUserForComparison.verification.reviewedAt).toLocaleString('vi-VN')}</p>
                    )}
                    {selectedUserForComparison.verification?.reviewNotes && (
                      <p><strong>Ghi chú:</strong> {selectedUserForComparison.verification.reviewNotes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AdminBoard;