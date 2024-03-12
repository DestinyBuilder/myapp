import React, { useState } from "react";

function RadioButtonGroup({ options, onOptionSelect }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleRadioChange = (event) => {
    const selectedOptionText = event.target.value.trim(); // Retrieve the selected option text
    setSelectedOption(selectedOptionText);
    onOptionSelect(selectedOptionText);
     
  };

  return (
    <ul className="options" style={{ fontSize: '22px', marginTop: '30px' }}>
      {options && options.length > 0 ? (
        options.map((option, index) => (
          <li className="option" key={index}>
            <input
              type="radio"
              id={`option-${index + 1}`}
              name="answer"
              value={option.trim().toLowerCase()} // Lowercase and trim option
              checked={selectedOption === option.trim().toLowerCase()} // Check for selected
              onChange={handleRadioChange}
            />
            <label htmlFor={`option-${index + 1}`} style={{ marginLeft: '5px', marginTop: '15px' }}>
              {option}
            </label>
          </li>
        ))
      ) : (
        <li>No options available</li>
      )}
    </ul>
  );
}


function QuestionPan({ questionid, data, selectedSubject ,onOptionSelect}) {
  
  if (!questionid || !data || !selectedSubject) {
    return <div>No question selected</div>;
  }

  // Extracting question text and options using the provided function
  let questionText = "";
  let options = [];
  const id=questionid["i"]
  const subjectData = data[0].questions[selectedSubject];

  if (subjectData) {
    const question = subjectData[id - 1];
    if (question) {
      questionText = question.questionText;
      options = question.options;
      
    }
  }

  return (
    <div id="sec4" style={{ margin: "14px 20px" }}>
      <div className="container3" style={{ height: "500px" }}>
        <div className="question" style={{ fontSize: "20px" }}>
          Question No: {id} - Single Choice
        </div>

        <div className="question-text" style={{ fontSize: "25px" }}>
          {questionText}
        </div>

        {/* Render the RadioButtonGroup component */}
        <RadioButtonGroup options={options} onOptionSelect={onOptionSelect} />
      </div>
    </div>
  );
}

export default QuestionPan;
