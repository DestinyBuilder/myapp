import React, { useState, useEffect } from 'react';

function Result({ examId, userId }) {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  examId="1" 
  userId="hiino"
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!resultData) {
    return <div>No result data available</div>;
  }

  const { totalMarks, scores, response } = resultData;

  // Filter the response array to include only data for the provided examId and userId
  const filteredResponse = response.filter(res => res.examId === examId && res.userId === userId);
console.log(resultData)
  return (
    <div>
      <h2>Exam Result</h2>
      <p>Total Marks: {totalMarks}</p>
      <div>
        {scores && Object.entries(scores).map(([section, score]) => (
          <p key={section}>Section: {section} - Score: {score}</p>
        ))}
      </div>
      <h3>User Responses</h3>
      <div>
        {filteredResponse.map((res, index) => (
          <div key={index}>
            <p>User ID: {res.userId}</p>
            <p>Answers:</p>
            <div>
              {res.answers && Object.entries(res.answers).map(([section, answers]) => (
                <div key={section}>
                  <p>Section: {section}</p>
                  <ul>
                    {answers.map((answer, index) => (
                      <li key={index}>{answer}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Result;
