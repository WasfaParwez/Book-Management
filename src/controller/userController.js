const validator= require('../utils/validator')
const UserModel = require('../model/UserModel');
const jwt = require('jsonwebtoken')
const JWT_EXPIRY = '12h';

//Register user=================================================================================
const createUser = async (req, res) => {
  try {
    const Data = req.body;
    const { title, name, phone, email, password, address } = Data;

    if (!title) {
        return res.status(400).send({ status: false, message: "title is required" })
    }
    if (!name) {
        return res.status(400).send({ status: false, message: "name is required" })
    }
    if (!phone) {
        return res.status(400).send({ status: false, message: "phone is required" })
    }
    if (!email) {
        return res.status(400).send({ status: false, message: "email is required" })
    }
    if (!password) {
        return res.status(400).send({ status: false, message: "password is required" })
    }
    if (!address) {
        return res.status(400).send({ status: false, message: "address is required" })
    }

    // title check

    if(!validator.isValidTitle(title)) {
      return res.status(400).json({ status: false, message: "Invalid title" });
    }
    // email check

    if (!validator.isValidEmail(email)) {

     return res.status(400).json({ status: false, message: "Invalid email" });
    }
    //password check
    if (!validator.isValidPassword(password)) {

    return  res.status(400).json({ status: false, message: "Invalid password" });
    }
    //phone number check
    if(!validator.isValid(phone) || !validator.isValidMobileNum(phone)){

        return res.status(400).send({status: false, message : "Invalid phone number"})
    }

    const emailUsed = await UserModel.findOne({ email: email });
    if (emailUsed) {
        return res.status(400).json({status: false, message:"email already exists"})
    }
    const phonenumUsed = await UserModel.findOne({ phone: phone });
    if (phonenumUsed) {
        return res.status(400).json({status: false, message:"phone number already exists"})
    }
        
//=================================================================================
    
    const data = await UserModel.create(Data);
    return res.status(201).json({status: true, message:data})

  } catch (error) {
    res.status(500).json({status: false,message: error.message,});
  }
};

//=====================Login User===========================

// Allow an user to login with their email and password.
// On a successful login attempt return a JWT token contatining the userId, exp, iat. The response should be a JSON object like this
// If the credentials are incorrect return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

const loginuser= async (req, res)=>{
    try{
        const{email,password}=req.body;
        const credentials= await UserModel.findOne({email:email} && {password:password});
        if(credentials){
            const logintoken = jwt.sign({userId:credentials._id},"thisismysecretkey",{expiresIn:JWT_EXPIRY});
            res.setHeader('x-api-key', logintoken);
            
            return res.status(200).json({ status:true,data:{ token :logintoken}});
        }
        else{
            return res.status(400).json({status:false,message:"invalid credentials"})
        }
    }
    catch(error){
        return res.status(500).send({status: false,message: error.message});
    }

}


module.exports={createUser,loginuser}