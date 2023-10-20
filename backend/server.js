require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const app = express()

const jwt = require('jsonwebtoken')

const {getList, getListByUser, getAllUsers, registerUser, createExpense, updateExpense, deleteExpense, getGraph} = require('./database.js')

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.use(express.json())

let list
let list3
app.get('/list', async (req,res) => {
    list = await getList()
    res.json(list)
})

app.get('/list/:id', async (req,res) => {
    const name = req.params.id
    list3 = await getListByUser(name)
    res.json(list3)
})


// const posts = [
//     {
//         username: "Gpai",
//         title: 'Post 1'
//     },
//     {
//         username: "Poozza",
//         title: 'Post 3'
//     },
//     {
//         username: "Gpai",
//         title: 'Post 2'
//     }

// ]

app.get('/posts', authenticateToken, (req,res) => {
      res.json(list3)
    // res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req,res) => {
    //Authenticate User
    const username = req.body.username
    const user = {name: username}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
})

app.get('/users', async (req, res) => {
    const result = await getAllUsers()
    res.send(result)
})

app.post('/verifyUser', async(req, res) => {
    const {plaintext, hashed} = req.body
    // console.log(plaintext, hashed);
    bcrypt.compare(plaintext, hashed, (err, result) => {
        if (err) {
            // Handle the error (e.g., database error, invalid hash)
            console.error('Error comparing passwords:', err);
        } else if (result) {
            // Passwords match
            // console.log('Passwords match');
            res.send(result)
        } else {
            // Passwords do not match
            res.send(false);
        }
    });
})

app.post('/user', async(req,res) => {
    const {username, email, password} = req.body
    let hashedPassword = await bcrypt.hash(password,8)
    // console.log(password, hashedPassword);
    try{
    const result = await registerUser(username, email, hashedPassword)
    return res.status(201).send(result)
    }
    catch(error){
        console.error(error);
    }
})


function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
        if(err) return res.sendStatus(403)

        req.user = result
        next()
    })
}


app.post('/expense', async (req,res) => {
    const {title, amount, date, username} = req.body
    const exp = await createExpense(title, amount, date, username)
    res.status(201).send(exp)
})


app.put('/expense/:id', async (req,res) => {
    const id = req.params.id
    const {title, amount} = req.body
    const exp = await updateExpense(title, amount, id)
    res.send(exp)
})

app.delete('/expense/:id', async (req,res) => {
    const id = req.params.id
    const exp = await deleteExpense(id)
    res.send(exp)
})

app.get('/graph/:id', async (req,res) => {
    const id = req.params.id
    const data = await getGraph(id)
    res.send(data)
})

app.listen(3000)

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Handle or log the error as needed
  });

