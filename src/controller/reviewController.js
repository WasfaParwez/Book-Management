const reviewModel = require('../model/ReviewModel')
const bookModel = require('../model/BookModel');
const validator = require('../utils/validator');


// POST /books/:bookId/review
// Add a review for the book in reviews collection.
// Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Update the related book document by increasing its review count
// Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this

const CreateReview = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const data = req.body
        const {reviewedBy,rating,review} = data

        //==========is required==========

        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data in body" })}
        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required" })}
        if (!reviewedBy) {
            return res.status(400).send({ status: false, message: "reviewedBy is required" })}
        if (!rating) {
            return res.status(400).send({ status: false, message: "rating is required" })}
     //========================================
     // Check if the bookId is deleted or not found
        const BookData = await bookModel.findById(bookId)
        if(!BookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })}
        if(BookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })}
        data.bookId = bookId

    //============================================
    //is valid
        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "enter valid reviewedBy" })}
        if (!validator.isValid(review)) {
            return res.status(400).send({ status: false, message: "enter valid review" }) }
        if (typeof rating !== "number" || rating > 5) {
            return res.status(400).send({ status: false, message: "enter valid reviews" }) }

        //============================================================
        // Creating Review
        
        data.reviewedAt = new Date()
        const createdata = await reviewModel.create(data)

        const updateBook = await bookModel.findOneAndUpdate({_id : bookId}, {$inc : {reviews :1}},{new : true})

        // creating a new updatedBook object in which copying the existing updateBook and adding the reviewsData
        const updatedBook = {...updateBook._doc}
        updatedBook.reviewsData = createdata
        return res.status(200).send({ status: true,message: "Review added successfully", data : updatedBook })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// Update the review - review, rating, reviewer's name.
// Check if the bookId exists and is not deleted before updating the review. Check if the review exist before updating the review. Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this

const UpdateReview = async(req, res) =>{
    try {
        const params = req.params
        const {bookId, reviewId} = params

        const data = req.body
        const {review, rating, reviewedBy} = data
        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data in body" }) }

        const bookData = await bookModel.findById(bookId)
        const reviewData = await reviewModel.findById(reviewId)
//================Not Found============
        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(!reviewData){
            return res.status(404).send({ status: false, message: "No review found with the bookId" })
        }
// ==============isDeleted Check==========
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }
        if(reviewData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        //===========================isValid=========
        if(review){
            if(!validator.isValid(review)) return res.status(400).send({status: false,
                message: "Provide valid review for this book"})}

        if(rating){
            if (typeof rating !== "number") {
                return res.status(400).send({ status: false, message: "enter valid reviews" })}}

        if(reviewedBy){
            if(!validator.isValid(reviewedBy)) return res.status(400).send({status: false,
                message: "Please provide valid name "})}

//===========================================
// updating a review
        await reviewModel.findOneAndUpdate({_id : reviewId},data,{new : true})
        const reviewsData = await reviewModel.find({bookId : bookId})

        const BookData = {...bookData._doc}
        BookData.reviewsData = reviewsData

        return res.status(200).send({ status: true,message : "Review updated successfully", data : BookData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// Check if the review exist with the reviewId. Check if the book exist with the bookId. Send an error response with appropirate status code like this if the book or book review does not exist
// Delete the related reivew.
// Update the books document - decrease review count by one


const DeleteReview = async (req, res)=> {
    try {
        const params = req.params
        const {bookId, reviewId} = params
        const bookData = await bookModel.findById(bookId)
        const reviewData = await reviewModel.findById(reviewId)
//=================================
        // Not found
        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" }) }

        if(!reviewData){
            return res.status(404).send({ status: false, message: "No review found with the bookId" })}
//===================================
        // Already deleted
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" }) }

        if(reviewData.isDeleted){
            return res.status(404).send({ status: false, message: "review has already been deleted" }) }
//===========================================
// deleting a review
        await reviewModel.findOneAndUpdate({_id : reviewId},{isDeleted : true, deletedAt : new Date()})

        const updatebookData = await bookModel.findOneAndUpdate({_id : bookId},{$inc : {reviews :-1}},{new : true})

        return res.status(200).send({ status: true, data : updatebookData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = {CreateReview, UpdateReview, DeleteReview}