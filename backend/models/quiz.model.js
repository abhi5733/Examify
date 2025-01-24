const { default: mongoose } = require("mongoose")
const mongoode = require("mongoose")

const quizSchema = mongoose.Schema({
    
        question: { type: String, required: true },
        options: {
          type: [String], // Array of options
          required: true
         
        },
        answer: { type: String, required: true },
        myAnswer: { type: String } // Optional: User's selected answer
      
})


const QuizModel = mongoose.model("quiz",quizSchema) ;
module.exports = QuizModel ; 