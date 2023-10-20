import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Expense from './Components/Expense';
import { useEffect, useState } from 'react';


function App() {

  const [authToken, setAuthToken] = useState('')
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('token')
    setAuthToken(token)
    const data = localStorage.getItem('data')
    if (data){
      setUserData({...JSON.parse(data)})
      }} , [])

  return (
      <Router>
    <div className="App">
        <Navbar userData={userData} authToken={authToken} setAuthToken={setAuthToken} setUserData={setUserData}/>
        <Routes>
          <Route exact path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login setAuthToken={setAuthToken} setUserData={setUserData} />}></Route>
          <Route path='/expense' element={<Expense authToken={authToken}/>}></Route>
          <Route path='/register' Component={Register}></Route>
        </Routes>
    </div>
      </Router>
  );
}

export default App;
