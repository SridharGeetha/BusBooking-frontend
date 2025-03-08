import { BrowserRouter, Route, Routes,Navigate  } from 'react-router-dom'
import './App.css'
import Login from './AuthComponent/Login'
import { Home } from './HomeComponent/Home'
import { Ticket } from './HomeComponent/Ticket'
import Signup from './AuthComponent/Signup'
import { AdminDashBoard } from './AdminComponent/AdminDashBoard'
import { NoAccess } from './AdminComponent/NoAccess'
import ProtectedRoute from './AdminComponent/ProtectedRoute'
import { useEffect, useState } from 'react'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  },[]);

  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              userRole === 'ADMIN' ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/signup" element={<Signup />} />


        <Route path="/admin" element={<ProtectedRoute element={AdminDashBoard} />} />
        <Route path="/no-access" element={<NoAccess/>}/>
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
