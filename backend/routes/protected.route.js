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



  protectedRouter.get("/", async (req, res) => {
    const { userID } = req.body

    try {
        // Fetch the user first
    const user = await UserModel.findById(userID).lean();

    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    if ( !user?.results || user?.results?.length==0) {
      res.status(200).send(user) ;
    }

    // Populate each nested array of quiz IDs
    const populatedResults = await Promise.all(
      user.results.map(async (quizArray) => {
        return Promise.all(
          quizArray.map(async (quizId) => {
            return await QuizModel.findById(quizId).lean();
          })
        );
      })
    );

    // Add the populated results back to the user object
    user.results = populatedResults;
    res.status(200).send(user)
    } catch (error) {
        res.status(404).send({msg:error})
    }
})

  



module.exports = protectedRouter ;