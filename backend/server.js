const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connection } = require('./db');
const bodyParser = require('body-parser');
require('dotenv').config();  // Ensure .env is loaded
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the MCQ Generation API');
});


// POST endpoint to handle MCQ generation
app.post('/generate-mcqs', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required to generate MCQs' });
  }

  try {
    // Set up the prompt to generate MCQs based on the input text
    const prompt = `Generate 10 multiple-choice questions based on the following text. Provide each question in the following JSON format: {"question": "Question text", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "answer": "Correct option"}. Use this format strictly:\n\n${text}`;

    // Access Gemini model and generate content
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate MCQs
    const result = await model.generateContent(prompt);

    // Extract the generated text
    let mcqsRaw = result.response.text();

    // Clean the response to remove unwanted characters (like backticks, '```json', etc.)
    mcqsRaw = mcqsRaw.replace(/```json/g, '').replace(/```/g, '').trim();

    // Attempt to parse the cleaned MCQs as JSON
    let mcqs;
    try {
      mcqs = JSON.parse(mcqsRaw);
    } catch (parseError) {
      console.error('Failed to parse MCQs:', parseError);
      return res.status(500).json({ error: 'Invalid MCQs format received from the AI model.' });
    }

    // Ensure the parsed MCQs is an array of objects
    if (!Array.isArray(mcqs) || mcqs.some(mcq => !mcq.question || !mcq.options || !mcq.answer)) {
      return res.status(500).json({ error: 'Generated MCQs are not in the expected format.' });
    }

    console.log(mcqs, 'Parsed MCQs');
    res.json({ mcqs });
  } catch (error) {
    console.error('Error generating MCQs:', error);
    res.status(500).json({ error: 'An error occurred while generating MCQs.' });
  }
});


// MongoDB connection and server start
const port = process.env.PORT  // Ensure the fallback to default port 5000

app.listen(port, async () => {
  try {
    await connection;
    console.log(`Mongo DB connected on port ${port}`);
  } catch (err) {
    console.log(`Connection failed: ${err}`);
  }
});
