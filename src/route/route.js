const express=require('express');

const route= express.Router();

const UserController = require('../controller/userController')

const BookController = require('../controller/bookController')

const ReviewController = require('../controller/reviewController')

const {Authentication,Authorisation} = require('../middleware/middleware')

//====================================================================

// User API
//createUser,loginuser

route.post('/register', UserController.createUser)

route.post('/login', UserController.loginuser)

//======================================================================
// Books API
//CreateBook,GetBooks,DetailedBook,UpdateBook,DeleteBook

route.post('/books',Authentication, BookController.CreateBook)

route.get('/books',Authentication,BookController.GetBooks)

route.get('/books/:bookId',Authentication,BookController.DetailedBook)

route.put('/books/:bookId',Authentication,Authorisation,BookController.UpdateBook)

route.delete('/books/:bookId',Authentication,Authorisation,BookController.DeleteBook)

//===========================================================================

// Review APIs
route.post('/books/:bookId/review',ReviewController.CreateReview)

route.put('/books/:bookId/review/:reviewId',ReviewController.UpdateReview)

route.delete('/books/:bookId/review/:reviewId',ReviewController.DeleteReview)

//==============================================================================

// route.use('*',(req, res) =>{
//     res.status(400).send("Invalid url request");
// })












module.exports = route;