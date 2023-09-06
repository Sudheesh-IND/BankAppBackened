
//bank app backend

//create server application using express

// 1 import express
const express=require('express')
const logic=require('./services/logic')
//4 import cors
const cors=require('cors')
const jwt=require('jsonwebtoken')

//middleware
// const middleware=(req,res,next)=>{
//     console.log('inside application middleware')
//     next()
// }

//router level middleware
const jwtmiddleware=(req,res,next)=>{
    console.log('inside router level middleware')
    
    try{
        const token=req.headers['verify-token']
    console.log(token)
    const data=jwt.verify(token,'superKey2023')
    console.log(data)
    req.currentAcno=data.loginAcno
    next()
    }
    catch{
        res.status(401).json({message:'Please login'})
    }
}

//2 create server using express
const server=express()
//5 use cors
server.use(cors({
    origin:'http://localhost:4200'
}))

//6 parse to a json file(json data)
server.use(express.json()) //returns middlewre that only passes json

//using the middleware
// server.use(middleware)

//3 setup port for server application
server.listen(5000,()=>{
    console.log('server listening to port 5000');
})

//7 API call to resolve- localhost:5000
server.get('/',(req,res)=>{
    res.send('Welcome to backend')
})


//API Calls
//register-localhost:5000/regster
server.post('/register',(req,res)=>{
    console.log('Inside register api call')
    console.log(req.body)
    //logic to create collection
    logic.register(req.body.username,req.body.acno,req.body.password).then((response)=>{
        res.status(response.statusCode).json(response)
    })
   
})

//login-localhost:5000/login
server.post('/login',(req,res)=>{
    console.log('entered into login call')
    console.log(req.body)
    logic.login(req.body.acno,req.body.password).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})

//balance=localhost:5000/balance
server.get('/getBalance/:acno',jwtmiddleware,(req,res)=>{
    console.log('inside api call')
    console.log(req.params)
    logic.getBalance(req.params.acno).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})
//fund transfer
server.post('/fundtransfer',jwtmiddleware,(req,res)=>{
    console.log('Inside fundtransfer api call')
    console.log(req.body)
    logic.fundTransfer(req.currentAcno,req.body.fromPswd,req.body.toAcno,req.body.amount).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})
//transaction-localhost:5000/transaction
server.get('/transactions',jwtmiddleware,(req,res)=>{
    console.log('inside transaction details call')
    console.log(req.body)
    logic.transactionHistory(req.currentAcno).then((response)=>{
        res.status(response.statusCode).json(response)

    })
})

//deleting account
server.delete('/deleteaccount',jwtmiddleware,(req,res)=>{
    console.log('Inside delete api call')
    logic.deleteAccount(req.currentAcno).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})