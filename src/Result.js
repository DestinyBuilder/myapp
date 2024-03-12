import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, XAxis, YAxis, Bar, Pie } from 'recharts';
import Start from './Start';
import './Result.css';


function Result({ examId, userId , onBackToStart}) {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("Physics");


  


  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/exam/getResult', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ examId, userId })
        });

        if (response.ok) {
          const data = await response.json();
          setResultData(data);
        } else {
          throw new Error('Failed to fetch result');
        }
      } catch (error) {
        console.error('Error fetching result:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examId, userId]);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!resultData) {
    return <div>No result data available</div>;
  }

  const { scores, response } = resultData;
  const totalmarks = scores["Physics"] + scores["Chemistry"] + 2 * scores["Maths"];
  const sectionCorrectAnswers = response.map((sectionData) => {
    const sectionName = sectionData[0];
    const correctCount = sectionData[1].reduce((acc, question) => (acc + (question.correctAnswer === question.selectedAnswer)), 0);
    const questionCount = sectionData[1].length;
    return { name: sectionName, correct: correctCount, total: questionCount };
  });




  const handleGoBackToStart = () => {
    onBackToStart();
    
  };


  return (
    <div className="result-container">
      <h2>Exam Result</h2>
      <div>Total Marks: {totalmarks}</div>
      <div>
        {Object.entries(scores).map(([section, score]) => (
          <p key={section}>{section} - Score: {score}</p>
        ))}
      </div>
      <div>
        {Object.entries(scores).map(([section, score]) => (
          <button key={section} onClick={() => handleSectionClick(section)}>{section}</button>
        ))}
      </div>
      <h3>User Responses</h3>
      <div>
        {response.map((sectionData, index) => (
          <div key={index} style={{ display: sectionData[0] === selectedSection ? 'block' : 'none' }}>
            <p>Section: {sectionData[0]}</p>
            <ul>
              {sectionData[1].map((questionData, qIndex) => (
                <li key={qIndex}>
                  <p>Question Number: {questionData.questionNumber}</p>
                  <p>Question Text: {questionData.questionText}</p>
                  <p>Correct Answer: {questionData.correctAnswer}</p>
                  <p>Selected Answer: {questionData.selectedAnswer}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <div>
          <h3>Number of Correct Answers per Section (Bar Chart)</h3>
          {sectionCorrectAnswers.length > 0 && (
            <BarChart width={500} height={300} data={sectionCorrectAnswers}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="correct" fill="#8884d8" />
              <Bar dataKey="total" fill="#ccc" />
            </BarChart>
          )}
        </div>
        <div>
          <h3>Total Marks Distribution (Pie Chart)</h3>
          {scores && (
            <PieChart width={400} height={300} >
              <Pie
                dataKey="value"
                data={[
                  { name: 'Physics', value: scores['Physics'] },
                  { name: 'Chemistry', value: scores['Chemistry'] },
                  { name: 'Maths', value: 2 * scores['Maths'] },
                ]}
                fill="#8884d8"
                label
              />
            </PieChart>
          )}
        </div>
      </div>

      <div className="back-to-start" >
      <button onClick={handleGoBackToStart}>Go Back to Start</button>
      </div>

    </div>
  );
}

export default Result;
