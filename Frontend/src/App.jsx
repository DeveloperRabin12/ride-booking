
import { Route, Routes } from 'react-router-dom'
import RiderLogin from './pages/RiderLogin'
import UserLogin from './pages/UserLogin'
import UserRegister from './pages/UserRegister'
import RiderRegister from './pages/RiderRegister'
import StartPage from './pages/StartPage'
import Home from './pages/Home'
import SecureLogin from './pages/SecureLogin'
import UserLogout from './pages/UserLogout'
import RiderHome from './pages/RiderHome'
import RiderProtectedLogin from './pages/RiderProtectedLogin'
import Riding from './pages/Riding'
import RiderRiding from './pages/RiderRiding'
import RiderProfile from './pages/RiderProfile'
import RiderHistory from './pages/RiderHistory'

const App = () => {


  return (
    <>
      <Routes>
        <Route path='/' element={<StartPage />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/rider-riding' element={<RiderRiding />} />
        <Route path='/userRegister' element={<UserRegister />} />
        <Route path='/riderLogin' element={<RiderLogin />} />
        <Route path='/riderRegister' element={<RiderRegister />} />
        <Route path='/home' element={
          <SecureLogin>
            <Home />
          </SecureLogin>
        } />
        <Route path='/user/logout' element={
          <SecureLogin>
            <UserLogout />
          </SecureLogin>
        } />
        <Route path='/riderHome' element={
          <RiderProtectedLogin>
            <RiderHome />
          </RiderProtectedLogin>
        } />
        <Route path='/rider/profile' element={
          <RiderProtectedLogin>
            <RiderProfile />
          </RiderProtectedLogin>
        } />
        <Route path='/rider/history' element={
          <RiderProtectedLogin>
            <RiderHistory />
          </RiderProtectedLogin>
        } />
      </Routes>
    </>
  )
}

export default App