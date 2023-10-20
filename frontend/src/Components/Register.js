import React from 'react'
import { useNavigate } from 'react-router-dom'


function Register() {

    const navTo = useNavigate()
    async function registerUser(e){
        e.preventDefault()
      
        let form = document.getElementById('registerForm')
      
        let formDetails = new FormData(form)
        let data = {}
        formDetails.forEach((val,key) => {
            data[key] = val
        })
      
        let newUser = data;
      
        let isUnique 
        try{
            isUnique = await checkUser(newUser)
        }
        catch(error){
            console.log(error);
        }
      
        // console.log(isUnique);
        if ( isUnique == true){
            if (newUser.password == newUser.passwordconfirm){
                // console.log("YASS");
                let data2 = {
                    "username": newUser.name,
                    "email": newUser.email,
                    "password": newUser.password
                }
      
                // console.log("data2", data2);
                fetch('http://localhost:3000/user',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    }, 
                    body: JSON.stringify(data2)
                }).then(response => response.json())
                .then(data => {
                    // console.log(data);
                    alert('User registered successfully')
                    navTo('/login')
                })
                .catch(error => {
                    console.log(error);
                })
      
            }else{
                alert("Passwords do not match")
            }
      
        }else if(isUnique.count == "Email"){
            alert("Email already exists")
        }else if(isUnique.count == "Username"){
            alert("Username already exists")
        }
      }
      
      async function checkUser(newUser){
        // console.log("NU", newUser);
        
        return fetch('http://localhost:3000/users', {
            method:"GET"
        }).then(response => response.json())
        .then(data => {
            let allUsers = data
            let countEmail = 0 
            let countUsername = 0 
      
            for(let user in allUsers){
                if (allUsers[user].email == newUser.email){
                    countEmail++
                }else if(allUsers[user].username == newUser.name){
                    countUsername++
                }
            }
      
            if (countEmail == 0 && countUsername == 0){
                return true 
            }else if(countEmail > 0){ 
              return {bool:false,count:'Email'}
            }
            else if(countUsername > 0){ 
              return {bool:false,count:'Username'}
            }
      
      
        }).catch(error => {
            console.log(error);
        })
      }



  return (
    <div className='register'>
        <h2 style={{marginTop:'70px', textAlign:'center'}}>Register</h2>
        <div className="formcontent">
        <form id="registerForm"onSubmit={registerUser} method="POST">
            <div className="form-group">
              <label htmlFor="name">Username</label>
              <input type="text" className="form-control" id="name" name="name"/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" name="email"/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" name="password"/>
            </div>
            <div className="form-group">
              <label htmlFor="passwordconfirm">Confirm Password</label>
              <input type="password" className="form-control" id="passwordconfirm" name="passwordconfirm"/>
            </div>
    
            <button type="submit" className="btn btn-primary">Register</button>
        </form>
    </div>
    </div>
  )
}

export default Register