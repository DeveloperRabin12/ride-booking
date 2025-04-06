import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './assets/pages/home'
import UserLogin from './assets//pages/UserLogin'
import UserRegister from './assets/pages/UserRegister'
import RiderLogin from './assets/pages/RiderLogin'
import RiderRegister from './assets/pages/RiderRegister'
const App = () => {
  return (
   <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<UserLogin />} />
      <Route path='/register' element={<UserRegister />} />
      <Route path='/riderLogin' element={<RiderLogin />} />
      <Route path='/riderRegister' element={<RiderRegister />} />
    </Routes>
   </>
  )
}

export default App