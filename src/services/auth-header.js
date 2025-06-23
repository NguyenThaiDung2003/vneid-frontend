// --- Helper function để lấy token từ localStorage ---
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    // Cho các backend Spring Boot, header là 'Authorization'
    // return { Authorization: 'Bearer ' + user.accessToken };
    
    // Cho các backend Node.js Express, header là 'x-access-token'
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}