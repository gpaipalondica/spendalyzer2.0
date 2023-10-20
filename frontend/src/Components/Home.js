import React from 'react'
import img1 from '../assets/img.jpeg'

function Home() {
  return (
    <div className='home' style={{display:'flex', flexDirection: 'column', alignItems:'center', gap:'40px'}}>
        <h1 style={{textAlign:'center', marginTop:'70px'}}>Welcome to Spendalyzer</h1>
        <img src={img1} style={{width:'70%', maxWidth:'800px', borderRadius:'30px'}} alt="" />
    </div>
  )
}

export default Home