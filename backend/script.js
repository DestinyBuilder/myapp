// script.js

document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const examId = document.getElementById('examId').value;
    const question = document.getElementById('question').value;
    const options = document.getElementById('options').value.split(',').map(option => option.trim());
    const correctAnswer = document.getElementById('correctAnswer').value;
  
    try {
      const response = await fetch('http://localhost:5000/admin/exam/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          examId,
          question,
          options,
          correctAnswer
        })
      });
  
      const data = await response.json();
      if (response.ok) {
        document.getElementById('message').innerHTML = '<span style="color: green;">Question uploaded successfully!</span>';
        // Clear form fields
        document.getElementById('uploadForm').reset();
      } else {
        document.getElementById('message').innerHTML = '<span style="color: red;">Error uploading question!</span>';
      }
    } catch (error) {
      console.error('Error uploading question:', error);
      document.getElementById('message').innerHTML = '<span style="color: red;">Error uploading question!</span>';
    }
  });
  