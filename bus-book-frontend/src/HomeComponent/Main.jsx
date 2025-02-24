import React from 'react'
import '/src/css/home.css'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, logout } from '../Service/service';

export const Main = () => {  
  const navigate = useNavigate();
  // console.log(localStorage.getItem('username'))
  const handleLogin = ()=>{
    navigate('/login')
  }
  return (
    <>
    <div className='main'>
      <div>
          <header>
              <nav className='navbar'>
                  <h3 className='title'>Online Local Bus Booking System</h3>
                  {
                    isAuthenticated() ?
                    (
                      <>
                      <a  href='#'>{localStorage.getItem('username')}</a>
                      {/* <a onClick={handleLogout} href='#'>Logout</a> */}
                      </>
                    ):(
                      <>
                      <a onClick={handleLogin} href='#'>Login</a>
                      </>
                    )
                  }
                  {/* <img src="/src/assets/portrait.png" alt="user image" className='profile-img' /> */}
              </nav>
          </header>
      </div>
        </div>
    </>
  )
}
