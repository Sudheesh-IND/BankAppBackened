//import db
const db=require('./db')

//import jsonwebtoken
const jwt=require('jsonwebtoken')

//logic for register

const register=(username,acno,password)=>{
   return db.User.findOne({acno}).then((response)=>{
    console.log(response)
    if(response){
        return {
            statusCode:401,
            message:'already present'
        }
       }else{
         const newUser=db.User({
            username,
            acno,
            password,
            balance:2000,
            transaction:[]
         })
         //to save inside mongodb
         newUser.save()
         return{
            statusCode:200,
            message:'Registration successful'
         }
       }
   })
}
//logic for login
const login=(acno,password)=>{
     return db.User.findOne({acno,password}).then((response)=>{
        if(response){
            //if acno and password present
            console.log(response)

            //generating token after login
            const token=jwt.sign({
                loginAcno:acno
            },'superKey2023')

            return{
                statusCode:200,
                message:'Login success full',
                currentUser:response.username,
                currentBalance:response.balance,
                token,
                currentAcno:acno
            }
        }else{
            //if acno and password not present
            return{
                statusCode:401,
                message:'Invalid login details'
            }
        }
     })
}

//for getting balance request
const getBalance=(acno)=>{
     return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }else{
            return{
                statusCode:401,
                message:'Invalid account number'
            }
        }
     })
}

//fund transfer
const fundTransfer=(fromAcno,fromPswd,toAcno,amt)=>{

    //convert amt to number
    let amount=parseInt(amt)

    return db.User.findOne({acno:fromAcno,password:fromPswd}).then((debit)=>{
        if(debit){
            //check to acno in mongodb
            return db.User.findOne({acno:toAcno}).then((credit)=>{
                if(credit){
                    if(debit.balance>=amount){
                        debit.balance-=amount
                        debit.transactions.push({
                           type:'debit',
                           amount,
                           fromAcno,
                           toAcno
                        })
                        //save changes into database
                        debit.save()
       
                        credit.balance+=amount
                        credit.transactions.push({
                           type:'credit',
                           amount,
                           fromAcno,
                           toAcno
                        })
                        credit.save()
                        return{
                           statusCode:200,
                           message:'Fundtransfer successfull'
                          }
                      }else{
                       return{
                           statusCode:400,
                           message:'Insufficient balance'
                       }
                      }
                }else{
                    return{
                        statusCode:400,
                        message:'Recipient not found'
                    }
                }
               

             
            })
        }else{
            return{
                statusCode:400,
                message:'Invalid debit details'
            }
        }
    })
     
}

//transaction history
const transactionHistory=(acno)=>{
       return db.User.findOne({acno}).then((details)=>{
        if(details){
            return{
                statusCode:200,
                message:'details found',
                transactions:details.transactions
            }
        }else{
            return{
                statusCode:400,
                message:'Invalid data'
            }
        }
       })
}

//delte account
const deleteAccount=(acno)=>{
    return db.User.deleteOne({acno}).then((response)=>{
        return{
            statusCode:200,
            message:'Account deleted Successfully'
        }
    },(response)=>{
        return{
            statusCode:400,
            message:'Coudnt deleted'
        }
    })
}

module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    transactionHistory,
    deleteAccount
}