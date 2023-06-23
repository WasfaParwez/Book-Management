const { Authorisation } = require('../middleware/middleware');
const BookModel= require('../model/BookModel');
const ReviewModel= require('../model/ReviewModel');
const validator = require('../utils/validator');
const mongoose = require('mongoose');


// Create a book document from request body. Get userId in request body only.
// Make sure the userId is a valid userId by checking the user exist in the users collection.
// Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like this
// Create atleast 10 books for each user
// Return HTTP status 400 for an invalid request with a response body like this

const CreateBook = async (req,res)=>{
    try{
        const data=req.body;
        const{title,excerpt,userId,ISBN,category,subcategory,reviews,deletedAt,isDeleted,releasedAt}=data;

        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data in body" }) }

//============title=========
         if (!title) {
            return res.status(400).send({ status: false, message: "title is required" })}
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "enter valid title" })}
         const istitle = await BookModel.findOne({ title: title })
        if (istitle) {
            return res.status(400).send({ status: false, message: "title is already present" })}

//============excerpt=================
        if (!excerpt) {
            return res.status(400).send({ status: false, message: "excerpt is required" })}
        if (!validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "enter valid excerpt" })}


        //  //   userId: {ObjectId, mandatory, refs to user model},
        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required" })
        }

//============ISBN=========
        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is required" })}
        if (!validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "enter valid ISBN" })}
        const isISBN = await BookModel.findOne({ ISBN: ISBN })
        if (isISBN) {
            return res.status(400).send({ status: false, message: "ISBN is already present" }) }

 //============Category=========
        if (!category) {
            return res.status(400).send({ status: false, message: "category is required" })}
        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, message: "enter valid category" })}

 //============SubCategory=========
        if (!subcategory) {
            return res.status(400).send({ status: false, message: "subcategory is required" })}
        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "enter valid subcategory" })}

//==================reviews========
        if (typeof reviews !== "number" ) {
            return res.status(400).send({ status: false, message: "enter valid reviews" })
        }
//===========releasedAt:("YYYY-MM-DD")}================
        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "releasedAt is required" }) }
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/
        if (!validator.isValid(releasedAt) || !dateFormat.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "enter valid release date" })}

//==============Authorisation==========================
        const userLoggedin = req.decodedToken
        const userToBeModified = userId

        if (userToBeModified !== userLoggedin) {
            return res.status(403).send({ status: false, message: "Unauthorised user" })
        }
        // =============Create Book===========

        const bookdata = await BookModel.create(data);
        return res.status(201).json({status:true,data:bookdata});
    }
    catch(error){
        return res.status(400).send({status: false ,message: error.message});
    }

}

// Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example here
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If no documents are found then return an HTTP status 404 with a response like this
// Filter books list by applying filters. Query param can have any combination of below filters.
// By userId
// By category
// By subcategory example of a query url: books?filtername=filtervalue&f2=fv2
// Return all books sorted by book name in Alphabatical order

const GetBooks= async (req,res)=>{
    try{
        const filter=req.query
        filter.isDeleted = false;

        const getallbooks= await BookModel.find(filter).select({title:1,excerpt:1,userId:1,category:1,subcategory:1,reviews:1}).sort({ title: 1 });
        if(getallbooks.length === 0){
            return res.status(404).json({status:false,message:"No books found"});
        }
        return res.status(200).json({status:true, message: 'Books list',data:getallbooks});
    }
    catch(error){
        return res.status(400).send({status: false,message: error.message});
    }
}

// Returns a book with complete details including reviews. Reviews array would be in the form of Array. Response example here
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If the book has no reviews then the response body should include book detail as shown here and an empty array for reviewsData.
// If no documents are found then return an HTTP status 404 with a response like this

const DetailedBook= async (req,res)=>{
    try{
        const book_id = req.params.bookId
        const detailsofBook= await BookModel.findById(book_id)
        const reviewofBook = await ReviewModel.find({bookId: book_id})
        //================Not Found============
        if(!detailsofBook){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(!reviewofBook){
            return res.status(404).send({ status: false, message: "No review found with the bookId" })
        }
// ==============isDeleted Check==========
        if(detailsofBook.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }
        if(reviewofBook.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }
//==================
        const BookData = {...detailsofBook._doc}
        BookData.reviewsData = reviewofBook

        return res.status(200).send({status:true,message: 'Books list', data:BookData})
    }
    catch(error){
        return res.status(400).send({status: false,message: error.message})

    }
}    

// Update a book by changing its
// title
// excerpt
// release date
// ISBN
// Make sure the unique constraints are not violated when making the update
// Check if the bookId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated book document.


const UpdateBook = async (req,res) => {
        try {
            const bookId = req.params.bookId
            const data = req.body
            const { title, excerpt, releasedAt, ISBN } = data

            if (!validator.isValidRequestBody(data)) {
                return res.status(400).send({ status: false, message: "Enter data in body" })
            }
            //=========title=====
            if (title) {
                if (!validator.isValid(title)) {
                    return res.status(400).send({ status: false, message: "enter valid title" })}
                    const istitle = await BookModel.findOne({ title: title })
                if (istitle) {
                    return res.status(400).send({ status: false, message: "title is already present" })
                }}
            //==========excerpt=======
            if (excerpt) {
                if (!validator.isValid(excerpt)) {
                    return res.status(400).send({ status: false, message: "enter valid excerpt" })
                } }
            //===========releaseAt=====
            if (releasedAt) {
                const dateFormat = /^\d{4}-\d{2}-\d{2}$/
                if (!validator.isValid(releasedAt) || !dateFormat.test(releasedAt)) {
                    return res.status(400).send({ status: false, message: "enter valid release date" })
                }}
            //=====ISBN=====
            if (ISBN) {
                if (!validator.isValid(ISBN)) {
                    return res.status(400).send({ status: false, message: "enter valid ISBN" }) } }
            const ISBN_present = await BookModel.findOne({ ISBN: ISBN })
            if (!ISBN_present) {
                return res.status(400).send({ status: false, message: "ISBN is already present" }) }
    
    //======================================UpdateBook=============================================
            const bookData = await BookModel.findById(bookId)
    
            if (!bookData) {
                return res.status(404).send({ status: false, message: "No book found with the bookId" }) }
            if (bookData.isDeleted) {
                return res.status(404).send({ status: false, message: "Book has been already deleted" })}

            const updateData = await BookModel.findOneAndUpdate({ _id: bookId }, data, { new: true })
            return res.status(200).send({ status: true, message: "Updated data", data: updateData })
            
     } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
    

// Check if the bookId exists and is not deleted. If it does, mark it deleted and return an HTTP status 200 with a response body with status and message.
// If the book document doesn't exist then return an HTTP status of 404 with a body like this

const DeleteBook = async (req, res)=> {
    try {
      let bookId = req.params.bookId;
  
      let deletebookbyid = await BookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },
        { isDeleted: true,
         DeletedAt: Date.now() }
      );
      if (!deletebookbyid)
        return res.status(404).send({ status: false, msg: "No book found" });
  
      return res.status(200).send({ status: true, message: "Book deleted successfully" });

    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  };

module.exports={CreateBook,GetBooks,DetailedBook,UpdateBook,DeleteBook}