import React, { useState } from 'react';

import '/src/css/login.css'
import { login } from '../Service/service';
import { useNavigate } from 'react-router-dom';



const Login = () => {
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState('');
    const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const userData = await login(email,password);
console.log(userData)
      if(userData.token){
        localStorage.setItem('token',userData.token)
        localStorage.setItem('role',userData.role)
        localStorage.setItem('id',userData.userId)
        console.log(userData.userId)
        localStorage.setItem('username',userData.username)
        console.log(userData.username)  
        console.log(userData.userId);
        if (userData.role === 'ADMIN') {
          alert("Admin ")
        } else{
          navigate("/")
        }   
    }

    } catch (err) {
      setError('Invalid email or password.');
      console.error('Login error:', err);
    }
  };

  return (
    <>
    <div className='body'>

    
        <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="signup-link">
        Don't have an account? <a>Sign up</a>
      </p>
    </div>
    </div>
    </>
  );
};

export default Login;
