// File: frontend-auth-ui/src/pages/AuthorizePage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../services/api.config';
const API_PREFIX = '/auth';
const AuthorizePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const client_id = searchParams.get('client_id');
  const redirect_uri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post(`${API_PREFIX}/login`, {
        email,
        password
      }, { withCredentials: true });

      // Gọi API để lấy mã code cấp cho client
      const authRes = await apiClient.get(
        `${API_PREFIX}/authorize`,
        {}, // body rỗng vì không gửi gì trong POST body
        {
            params: { client_id, redirect_uri, state },
            withCredentials: true
        }
        );

      const code = authRes.data.code;
      window.location.href = `${redirect_uri}?code=${code}&state=${state}`;

    } catch (err) {
      setError(err?.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Đăng nhập để cấp quyền truy cập</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Đăng nhập và cấp quyền
        </button>
      </form>
    </div>
  );
};

export default AuthorizePage;
