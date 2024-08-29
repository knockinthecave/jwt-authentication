import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedPage() {
     const [message, setMessage] = useState('');
     const navigate = useNavigate();

     const getCookie = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
     };

     const refreshAccessToken = useCallback(async () => {
          try {
               const refreshToken = getCookie('refresh_token');
               const response = await fetch('http://localhost:8000/api/token/refresh/', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                    credentials: 'include',
               });

               if (response.ok) {
                    const data = await response.json();
                    document.cookie = `access_token=${data.access}; path=/; secure`;
                    return data.access;
               } else {
                    throw new Error('Failed to refresh token');
               }
          } catch (err) {
               console.error('Token refresh failed:', err);
               navigate('/login');  // 토큰 갱신 실패 시 로그인 페이지로 리디렉션
          }
     }, [navigate]);

     useEffect(() => {
          const fetchProtectedData = async () => {
               try {
                    let token = getCookie('access_token');
                    if (!token) {
                         navigate('/login');  // 토큰이 없으면 로그인 페이지로 리디렉션
                         return;
                    }

                    let response = await fetch('http://localhost:8000/api/protected/', {
                         headers: {
                              Authorization: `Bearer ${token}`,
                         },
                         credentials: 'include',
                    });

                    if (response.status === 401) {
                         // 토큰이 만료된 경우 토큰 갱신 시도
                         token = await refreshAccessToken();
                         response = await fetch('http://localhost:8000/api/protected/', {
                              headers: {
                                   Authorization: `Bearer ${token}`,
                              },
                              credentials: 'include',
                         });
                    }

                    if (response.ok) {
                         const data = await response.json();
                         setMessage(data.message);
                    } else {
                         throw new Error('Unauthorized');
                    }
               } catch (error) {
                    navigate('/login');  // 인증 실패 시 로그인 페이지로 리디렉션
               }
          };

          fetchProtectedData();
     }, [navigate, refreshAccessToken]);

     return (
          <div>
               <h2>Protected Page</h2>
               <p>{message}</p>
          </div>
     );
}

export default ProtectedPage;
