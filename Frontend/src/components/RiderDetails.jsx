import React,{useContext} from 'react'
import { RiderDataContext } from '../context/RiderContext'


const RiderDetails = () => {

   const { rider } = useContext(RiderDataContext)
  



  return (
        <div>
            <div className='flex items-center justify-between mb-12'>
                            <div className='flex items-center justify-start gap-4'>
                              <img className='h-12 w-12 rounded-full object-cover' src="https://imgs.search.brave.com/I_vRdrr9JtvB71WasZbqU05tw2l7mYOOyRvcwtAShEU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Ymx1ZS1jaXJjbGUt/d2l0aC13aGl0ZS11/c2VyXzc4MzcwLTQ3/MDcuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MCZxPTgw" alt="" />
                              <h4 className='text-lg font-bold capitalize'>rider </h4>
                            </div>

                            <div>
                              <h4 className='text-xl font-semibold'>
                                RS.456
                              </h4>
                              <p className='text-sm text-gray-600'>Earned</p>
                            </div>
                         </div>
                         
                         <div className='flex p-3 mt-6 bg-gray-200 rounded-xl  justify-center gap-24 items-start'>
                            <div className='text-center'>
                             <i className='text-3xl mb-2 font-medium ri-timer-2-line'></i>
                             <h5 className='text-lg font-medium'>10.2</h5>
                             <p className='text-small text-gray-600'>Hrs</p>
                           </div>

                         <div >
                            <i className='text-3xl mb-2 font-medium ri-speed-up-line'></i>
                            <h5 className='text-lg font-medium'>10.2</h5>
                            <p className='text-small text-gray-600'>Hrs</p>
                         </div>

                         <div>
                            <i className='text-3xl mb-2 font-medium ri-booklet-line'></i>
                            <h5 className='text-lg font-medium'>10.2</h5>
                            <p className='text-small text-gray-600'>Hrs</p>
                         </div>
                         </div>
        </div>
  )
}

export default RiderDetails