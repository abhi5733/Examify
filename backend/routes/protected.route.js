const express = require("express")
const UserModel = require("../models/user.model")
const QuizModel = require("../models/quiz.model.js")
const auth = require("../middlewares/auth.js")
const mongoose = require('mongoose');
require("dotenv").config()


const protectedRouter = express.Router()


// save mcq

protectedRouter.post("/saveMcq", async (req,res)=>{
    console.log(req.body,"body")
    const session = await mongoose.startSession(); // Start a new session for the transaction
  session.startTransaction(); // Start the transaction
    try{
        const userId = req.body.userID
      const mcqs = await QuizModel.insertMany(req.body , {session})
  
  // Extract IDs of created quizzes
      const quizIds = mcqs.map((quiz) => quiz._id);
  console.log(quizIds)
 const user = await UserModel.findByIdAndUpdate(
    userId,
    { $push: { results: quizIds } }, // Add the new array of quiz IDs
    { new: true , session }
  );

  await session.commitTransaction();
  session.endSession();
  res.status(200).send({"msg":"Quizzes saved successfully",user})
  
    }catch(err){
        console.log(err)
            // Roll back the transaction if any operation fails
    await session.abortTransaction();
    session.endSession();
        res.status(400).send({"msg":"Something went wrong", err})
    }
  })
  



module.exports = protectedRouter ;