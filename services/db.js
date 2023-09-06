//mongoDb connecting with node js

//1 connection library-mongoose npm i mongoose

//import mongoose
const mongoose=require('mongoose')

//Define connection string between mongoose and node
mongoose.connect('mongodb://localhost:27017/Bankapp')

//creating model
const User=mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transactions:[]

})

module.exports={
    User
}