// Backend - index.js

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const userController = require('./controller/user')


const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())





const uri = "mongodb+srv://Ok945:(Onlyf0rme!@cluster0.xixq3wq.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log("Connected to MongoDB successfully");
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
  console.log("helo")
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
// examId="1"
// userId="hinno"
app.post("/admin/exam/getResult", async (req, res) => {
  try {
    // Set examId and userId temporarily
    req.body.examId = "1";
    req.body.userId = "hiino";

    const { examId, userId } = req.body;
    
    
    // Find if there is an existing response for the given user ID
    const existingResponse = await Exam.findOne({ examId: examId, 'responses.userId': userId });
    const correctAnswers = await Exam.findOne({ examId: examId });

    // Check if correctAnswers is null
    if (!correctAnswers) {
      return res.status(400).json({ error: 'No exam data found for the provided examId' });
    }

    // Update the existing response if it exists, otherwise return a 400 error
    if (existingResponse) {
      // Filter the response for the given userId
      const userResponse = existingResponse.responses.find(response => response.userId === userId);
      
      // Calculate scores for each section
      const scores = {};
      const response = Object.entries(correctAnswers.questions).map(([section, questions]) => {
        let sectionScore = 0;
        const updatedQuestions = questions.map(question => {
          

       const userAnswer = userResponse.answers[section].find(answer => answer.questionNumber === question.questionNumber);



          const selectedAnswer = userAnswer ? userAnswer.selectedAnswer : null;
          if (question.correctAnswer === selectedAnswer) {
            sectionScore++;
            

             // Increment section score if the answer is correct
          }
          return {
            questionNumber: question.questionNumber,
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            selectedAnswer: selectedAnswer
          };
        });
        scores[section] = sectionScore;
        return [section, updatedQuestions];
      });

      res.status(200).json({ scores, response, userId });
    } else {
      res.status(400).json({ error: 'No response found for the provided userId and examId' });
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




app.post('/signup', userController.signup)
app.post('/signin', userController.signin)
app.post('/submit-otp', userController.submitotp)
app.post('/send-otp', userController.sendotp)




app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
