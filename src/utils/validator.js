
const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z]{1,20}$/; 
    return nameRegex.test(name);
  };
  
const isValidEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };
  

  const isValidPassword = (password) => {
    if(password.length < 8 || password.length > 15 ) false
    return true 
}


  
 const isValidarr = (arr) => {
    if (arr && Array.isArray(arr))  return true;
    return false;;
  }
  
  
  const checkFormat=(input)=>
  {
    if (!input) return false
    input = input.trim();
    if (input == "") return false;
    else return input
      
  }
  const isValid = (value)=> {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
  
  const isValidRequestBody = (requestBody)=> {
    return Object.keys(requestBody).length > 0;
  };

  const isValidObjectId = (objectId)=> {
    return mongoose.Types.ObjectId.isValid(objectId);
  };
  const isValidMobileNum = (MobileNumber)=> {
    if(MobileNumber.length != 10) {
        return false
    }
    return MobileNumber.match(/^[0-9]+$/)
  };
  const isValidTitle = (value) => {
    let arr = ['Mr', 'Mrs', 'Miss']
    if(arr.includes(value)) return true
    return false
}


  module.exports = {checkFormat,isValidEmail,isValidPassword,isValidName,isValidarr,isValid,isValidRequestBody,isValidObjectId,isValidMobileNum,isValidTitle};