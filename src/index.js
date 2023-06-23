const mongoose= require('mongoose');
const express= require('express');
const app= express();
const route = require('./route/route');
require('dotenv').config();

const { PORT, MONGODB_URL } = process.env


app.use(express.json());
app.use(express.urlencoded({extended:true}));


mongoose.connect(MONGODB_URL,{useNewUrlParser:true})
.then(()=>(console.log("Connected to MongoDB")))
.catch((err)=>(console.log(err)))

app.use('/',route)

app.listen(PORT,()=>(console.log(`Server is running on port ${PORT}`)))