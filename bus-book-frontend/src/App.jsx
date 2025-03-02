import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './AuthComponent/Login'
import { Home } from './HomeComponent/Home'
import { Ticket } from './HomeComponent/Ticket'
import Signup from './AuthComponent/Signup'


function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/signup" element={<Signup />} />
    </Routes>
    </BrowserRouter>
     {/* <Home></Home>  */}
    </>
  )
}

export default App
