const jwt = require('jsonwebtoken');
const bookModel = require('../model/BookModel');

const Authentication = async function(req, res, next){
    try{
        const token = req.headers["x-api-key"];
        if(!token){
            return res.status(400).send({status : false, message : "token is missing"})
        }
        const decodeToken = jwt.verify(token,"thisismysecretkey");
        req.decodedToken = decodeToken.userId
        next()

    }
    catch(error){
        if(error.message =="Invalid token"){
            return res.status(401).send({status : false, message : "Enter valid token"})
        }
        return res.status(500).send({status : false, message : error.message})
    }
}

const Authorisation = async function(req,res,next){
    try{
        
        let bookId = req.params.bookId
        let userLoggedin = req.decodedToken
       
        const bookData = await bookModel.findById(bookId)
        const userToBeModified = bookData.userId.toString()
            
        if(userToBeModified!==userLoggedin){
            return res.status(403).send({status: false, message : "Unauthorised user"})
        }
      
        next()

    }
    catch(error){
        return res.status(500).send({status : false, message : error.message})
    }

}

module.exports = {Authentication,Authorisation}