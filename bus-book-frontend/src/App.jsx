import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './AuthComponent/Login'
import { Home } from './HomeComponent/Home'


function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
    </Routes>
    </BrowserRouter>
     {/* <Home></Home>  */}
    </>
  )
}

export default App
