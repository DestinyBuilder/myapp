// Backend - index.js

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/examPortal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to the database');
});

// Schema for exam questions
const ExamSchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true,
    unique: true
  },
  questions: {
    Physics: [{
      questionNumber: Number,
      questionText: String,
      options: [String],
      correctAnswer: String
    }],
    Chemistry: [{
      questionNumber: Number,
      questionText: String,
      options: [String],
      correctAnswer: String
    }],
    Maths: [{
      questionNumber: Number,
      questionText: String,
      options: [String],
      correctAnswer: String
    }]
  },
  responses: [{
    userId: String,
    answers: {
      Physics: [{
        questionNumber: Number,
        questionText: String,
        selectedAnswer: String
      }],
      Chemistry: [{
        questionNumber: Number,
        questionText: String,
        selectedAnswer: String
      }],
      Maths: [{
        questionNumber: Number,
        questionText: String,
        selectedAnswer: String
      }]
    },
    startTime: Date
  }]
});

const Exam = mongoose.model('Exam', ExamSchema);

// Endpoint for creating exam questions
app.post('/admin/exam/questions', async (req, res) => {
  try {
    const { examId, subject, questionNumber, questionText, options, correctAnswer } = req.body;
    const result = await Exam.findOneAndUpdate(
      { examId: examId },
      { $push: { [`questions.${subject}`]: { questionNumber, questionText, options, correctAnswer } } },
      { upsert: true, new: true }
    );
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Could not add questiono' });
  }
});


// Endpoint for fetching exam questions
// Endpoint for fetching exam questions
// Endpoint for fetching exam questions
app.get('/admin/exam/questions', async (req, res) => {
  try {
    const questions = await Exam.find();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    res.status(500).json({ error: 'Could not fetch exam questions', message: error.message });
  }
});
// Endpoint for saving responses
// Endpoint for saving responses



app.post('/admin/exam/createNewResponse',async (req,res)=>{
  const { examId, userId } = req.body;
  console.log({examId})
  const startTime = new Date();
      const newResponse = await Exam.findOneAndUpdate(
        { examId: examId },
        {
          $push: {
            'responses': {
              userId,
              answers: {
              },
              startTime
            }
          }
        },
        { new: true }
      );

      res.status(201).json(newResponse);
});
app.post('/admin/exam/saveResponse', async (req, res) => {
  try {
    const { examId, subject, questionNumber, questionText, selectedAnswer, userId } = req.body;

    // Find if there is an existing response for the given user ID
    const existingResponse = await Exam.findOne({ examId: examId, 'responses.userId': userId });

    // Update the existing response if it exists, otherwise create a new one
    if (existingResponse) {
      // Find the index of the existing response for the given user ID
      const index = existingResponse.responses.findIndex(response => response.userId === userId);

      // Check if the user has already answered the current question for the subject
      const existingAnswerIndex = existingResponse.responses[index].answers[subject].findIndex(answer => answer.questionNumber === questionNumber);
      
      // Update the existing answer if it exists, otherwise add a new answer
      if (existingAnswerIndex !== -1) {
        existingResponse.responses[index].answers[subject][existingAnswerIndex].selectedAnswer = selectedAnswer;
      } else {
        existingResponse.responses[index].answers[subject].push({ questionNumber, questionText, selectedAnswer });
      }

      // Save the updated document
      await existingResponse.save();

      res.status(201).json(existingResponse);
    } else {
      // Create a new response object
      const timeStamp = new Date();
      const newResponse = await Exam.findOneAndUpdate(
        { examId: examId },
        {
          $push: {
            'responses': {
              userId,
              answers: {
                [subject]: [{ questionNumber, questionText, selectedAnswer }]
              },
              timeStamp
            }
          }
        },
        { new: true }
      );

      res.status(201).json(newResponse);
    }
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ error: 'Could not save responseo' });
  }
});
app.post("/admin/exam/getResult",async (req, res) => {
  try {

    const { examId, userId } = req.body;
    console.log(examId)
    console.log(">>>>>>>>>>>");
    // Find if there is an existing response for the given user ID
    const existingResponse = await Exam.findOne({ examId: examId, 'responses.userId': userId });
    const correctAnswers = await Exam.findOne({examId:examId});
    const dt = Object.entries(correctAnswers.questions)
    // Update the existing response if it exists, otherwise create a new one
    if (existingResponse && correctAnswers) {
      const responseCandidate = existingResponse.responses.find((x)=>x.userId==userId).answers;
      const t = Object.fromEntries(Object.entries(responseCandidate).map(([section, answers])=>{
        return [section, Object.fromEntries(answers.map((x)=>{
          return [x.questionNumber, x.selectedAnswer];
        }))]
      }))
      
      let scores = {}
      const r = {scores, response: dt.map(([section, answers])=>{
        return [section, answers.map((x)=>{
          const selectedAnswer = t[section]["questionNumber"]
          if(!(section in scores)){
            scores[section] = 0;
           
          }   
          console.log(x.correctAnswers)
          
          if(x.correctAnswer == selectedAnswer){            
            score[section]++;
          }
          return {...x, selectedAnswer};
        })]
      })};
      console.log(JSON.stringify(r))
      res.status(200).json(r);
    } else{
      res.status(400).json({existingResponse: false})
    }
    
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    res.status(500).json({ error: 'Could not fetch exam questions', message: error.message });
  }
});
app.post('/admin/exam/getSavedResponse', async (req, res) => {
  try {
    const { examId, userId } = req.body;

    // Find if there is an existing response for the given user ID
    const existingResponse = await Exam.findOne({ examId: examId, 'responses.userId': userId });

    // Update the existing response if it exists, otherwise create a new one
    if (existingResponse) {
      res.status(200).json(existingResponse.responses.find((x)=>x.userId==userId));
    } else{
      res.status(400).json({existingResponse: false})
    }
    
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    res.status(500).json({ error: 'Could not fetch exam questions', message: error.message });
  }
});






app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
