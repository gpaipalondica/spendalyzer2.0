import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Styles/Navbar.css'

function Navbar({userData, authToken, setAuthToken, setUserData}) {
  
        const navigate = useNavigate()

      const logmeout = () => {
        // Implement logout logic and clear user data from localStorage
        
        setAuthToken('')
        setUserData(null)

        localStorage.clear()

        setTimeout(() => {
          window.location.href = '/'
        },500)

    };

  return (
    
      <div className='navbar'>
    {authToken ? (
        <>
        <Link to='/expense'>Expenses</Link>
        <Link onClick={logmeout}>Logout</Link>
      </>
    ) : (
        <>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/register'>Register</Link>
        </>
    )}
  </div>
  )
}

export default Navbar