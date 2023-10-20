import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/Navbar.css'


const Login = (props) => {


  let navigate = useNavigate()

    function loginUser(x){
        let name = x.username
    
        const data = {
            "username": name,
        }
    
        fetch('http://localhost:3000/login',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // console.log("POST data", data);
    
            if(data.accessToken){
                let accTok = data.accessToken
                // console.log("AT",accTok);
                tokenVerify(x,accTok)
            }
            else{
                // console.log("No Access Token");
            }
        })
        .catch(err => {
            console.log("POST error: ",err);
        })
    
    }

    async function getExpByUser(name) {
        return fetch('http://localhost:3000/list/'+name, {
          method: 'GET'
        })
          .then(response => response.json())
          .then(data => {
            return data; // Return the data inside the Promise chain
          })
          .catch(error => {
            console.log('Error in GET function', error);
            throw error; // Rethrow the error to propagate it
          });
      }

      async function verifyUser(passedUser){
        return fetch('http://localhost:3000/users',{
                method:"GET"
               }).then(response => response.json())
              .then(data => {
                  let allUsers = data
                  // console.log("AU",allUsers);
                  // console.log("PU",passedUser);
                  let count = 0
                  for(let user in allUsers){
                    let au = (allUsers[user].username).toLowerCase()
                    let pu = (passedUser.username).toLowerCase()
                      if(au == pu || allUsers[user].email == pu){
                          // console.log("USERNAME matched")
                          count++;
                          
                          let data3 = {
                              "plaintext": passedUser.password,
                              "hashed": allUsers[user].password
                          }

                          // console.log("data3", data3);
    
                         return fetch('http://localhost:3000/verifyUser', {
                              method:"POST",
                              headers:{
                                  'Content-type': 'application/json'
                              },
                              body: JSON.stringify(data3)
                          }).then(response => response.json())
                          .then(data => {
                              // console.log("HERE", data);
                              return {"data":data, "user": allUsers[user]}
                          })
                          .catch(err => {
                          console.log(err);
                          })
                      }
                      // else{
                      //   return {message:"user not found"}
                      // }
                  }
                  if(count==0){
                    return {message:"user not found"}
                  }
                  }) 
                  .catch(error => {
                  console.log('ERROR IN VERIFY USER FUNCTION', error);
                  });

      }

      function tokenVerify(x2,x) {
        let accTok = x; 
        let userDetails = {
          "user_id":x2.user_id,
          "username": x2.username,
          "email": x2.email
        }

        // console.log(userDetails);

    
        const url = 'http://localhost:3000/posts';
        const token = accTok
    
        const auth = `Bearer ${token}`
    
        // console.log(auth);
    
        fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': auth
        }
        })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // console.log(data); 
        localStorage.setItem('user', JSON.stringify(userDetails))
        localStorage.setItem('token', token)
        localStorage.setItem('data', JSON.stringify(data))

        props.setAuthToken(token)
        props.setUserData(JSON.stringify(data))
        
        navigate('/expense')
      
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }

     const loginDetails = async (e)  => {
        e.preventDefault()
        // console.log('hello');
      
        let form = document.getElementById('loginForm')
    
        let formDetails = new FormData(form)
        let data = {}
        formDetails.forEach((val,key) => {
            data[key] = val
        })

        // console.log(data);
    
        let uname = data.name
        let pw = data.password
        let user = {'username': uname, "password": pw}
    
        // console.log(user);
        
        let isVerified 
        try{
            isVerified = await verifyUser(user)
        }catch(error){
            console.error('Error', error);
        }
    
        // console.log("IV", isVerified);
    
        if(isVerified.data == true){
            let fullData;
            try {
              fullData = await getExpByUser(uname); // Use await to wait for the Promise to resolve
            } catch (error) {
              console.error('Error in :', error);
            }
        
            // console.log("FD",fullData);
        
            loginUser(isVerified.user)
        }
        else if (isVerified.data == false){
             alert("Incorrect credentials");;
        }else if(isVerified.message){
            alert("User not found")
        }
    }


  return (
    <div className='login'>
          <h2 style={{marginTop:'70px', textAlign:'center'}}>Login</h2>
        <div className="formcontent">
        <form id="loginForm" onSubmit={loginDetails} method="POST">
            <div className="form-group">
              <label htmlFor="name">Username</label>
              <input type="text" className="form-control" id="name" name="name" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" name="password" />
            </div>
    
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
        </div>
    </div>
  )
}

export default Login