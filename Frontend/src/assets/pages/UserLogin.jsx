import React from 'react'

const UserLogin = () => {
  return (
   <div className='p-7'>

  <img className=' w-20 ' src="https://imgs.search.brave.com/yfhjvPmbpij5DnmuCDlZMi4F2HgTGPqGRKLV3SCp3LM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/NDExMDE0MjcvZmls/ZS9vcmlnaW5hbC0y/YTY2NmQxMzUzOWRh/MzdkNzg1ZmVmODAy/ZWIyOTk2Ni5qcGc_/cmVzaXplPTQwMHgw" alt="" />
    <form action="" className='mt-10'>
      <h3 className='text-xl font-medium mb-2'>Enter the email</h3>
      <input  className='bg-[#c5c2c2] text-lg mb-5  rounded px-4 py-2 border w-full'
      required 
      type="email"
       placeholder='something@example.com'/>
      <h3 className='text-xl font-medium mb-2'>Enter password</h3>
      <input className='bg-[#c5c2c2] mb-5 text-lg  rounded px-4 py-2 border w-full'
       required 
       type="password" 
       placeholder='********'/>
      <button className = ' w-full bg-black text-white mt-4 py-3 rounded-lg'
      >Log In</button>
    </form>
   </div>
  )
}

export default UserLogin