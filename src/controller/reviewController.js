const reviewModel = require('../model/ReviewModel')
const bookModel = require('../model/BookModel');
const validator = require('../utils/validator');


// POST /books/:bookId/review
// Add a review for the book in reviews collection.
// Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Update the related book document by increasing its review count
// Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this

const CreateReview = async (req, res) =>{
    try {
        const bookId = req.params.bookId
        const data = req.body
        const {reviewedBy,rating,review} = data

        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data in body" })
        }
        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required" })
        }
        if (!reviewedBy) {
            return res.status(400).send({ status: false, message: "reviewedBy is required" })
        }
        if (!rating) {
            return res.status(400).send({ status: false, message: "rating is required" })
        }
     //========================================
        const bookData = await bookModel.findById(bookId)

        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }
        data.bookId = bookId

//============================================

        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "enter valid reviewedBy" })
        }
        
        // rating: {number, min 1, max 5, mandatory},
        if (typeof rating !== "number" || rating > 5) {
            return res.status(400).send({ status: false, message: "enter valid reviews" })
        }
        
        // review: {string, optional}
        if (!validator.isValid(review)) {
            return res.status(400).send({ status: false, message: "enter valid review" })
        }
//=====================================================================
        data.reviewedAt = new Date()
        const createdata = await reviewModel.create(data)

        const updateBook = await bookModel.findOneAndUpdate({_id : bookId}, {$inc : {reviews :1}},{new : true})

        const updatedBook = {...updateBook._doc}
        updatedBook.reviewsData = createdata

        return res.status(200).send({ status: true,message: "Review added successfully", data : updatedBook })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const UpdateReview = async(req, res) =>{
    try {
        const params = req.params
        const {bookId, reviewId} = params

        const data = req.body
        const {review, rating, reviewedBy} = data
        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Enter data in body" })
        }

        const bookData = await bookModel.findById(bookId)

        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }
        const reviewData = await reviewModel.findById(reviewId)

        if(!reviewData){
            return res.status(404).send({ status: false, message: "No review found with the bookId" })
        }

        if(reviewData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }

        //===========================
        if(review){
            if(!validator.isValid(review)) return res.status(400).send({status: false,
                message: "Please provide valid review for this book"})
        }
        //==========================
        if(rating){
            if (typeof rating !== "number") {
                return res.status(400).send({ status: false, message: "enter valid reviews" })
            }
        }
        //=============================
        if(reviewedBy){
            if(!validator.isValid(reviewedBy)) return res.status(400).send({status: false,
                message: "Please provide valid name "})
        }

        await reviewModel.findOneAndUpdate({_id : reviewId},data,{new : true})

        const reviewsData = await reviewModel.find({bookId : bookId})

        const BookData = {...bookData._doc}
        BookData.reviewsData = reviewsData

        return res.status(200).send({ status: true,message : "Review updated successfully", data : BookData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const DeleteReview = async (req, res)=> {
    try {
        const params = req.params
        const {bookId, reviewId} = params

        const bookData = await bookModel.findById(bookId)
        if(!bookData){
            return res.status(404).send({ status: false, message: "No book found with the bookId" })
        }
        if(bookData.isDeleted){
            return res.status(404).send({ status: false, message: "Book has been already deleted" })
        }
        const reviewData = await reviewModel.findById(reviewId)

        if(!reviewData){
            return res.status(404).send({ status: false, message: "No review found with the bookId" })
        }

        if(reviewData.isDeleted){
            return res.status(404).send({ status: false, message: "review has already been deleted" })
        }

        await reviewModel.findOneAndUpdate({_id : reviewId},{isDeleted : true, deletedAt : new Date()})

        const updatebookData = await bookModel.findOneAndUpdate({_id : bookId},{$inc : {reviews :-1}},{new : true})

        return res.status(200).send({ status: true, data : updatebookData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = {CreateReview, UpdateReview, DeleteReview}