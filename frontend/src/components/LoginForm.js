import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
          e.preventDefault();
          try {
               const response = await fetch('http://localhost:8000/api/token/', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include', // 쿠키를 포함시킵니다.
               });

               if (response.ok) {
                    const data = await response.json();
                    document.cookie = `access_token=${data.access}; path=/; secure`;
                    document.cookie = `refresh_token=${data.refresh}; path=/; secure`;
                    navigate('/protected');  // 로그인 성공 시 보호된 페이지로 이동
               } else {
                    setError('Invalid credentials');
               }
          } catch (err) {
               setError('Something went wrong. Please try again later.');
          }
     };

     return (
          <div>
               <h2>Login</h2>
               <form onSubmit={handleSubmit}>
                    <div>
                         <label>Username:</label>
                         <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                         />
                    </div>
                    <div>
                         <label>Password:</label>
                         <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                         />
                    </div>
                    <button type="submit">Login</button>
               </form>
               {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
     );
}

export default LoginForm;
