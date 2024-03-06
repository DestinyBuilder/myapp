import React from "react";

function Foot({ handlePreviousButtonClick, handleSaveButtonClick, handleSubmitButtonClick, examSubmitted }) {
  return (
    <div className="footer">
      <div className="left-section">
        {/* Disable buttons if exam is submitted */}
        <button disabled={examSubmitted}>Mark for Review and Next</button>
        <button disabled={examSubmitted}>Clear Response</button>
      </div>
      <div className="right-section">
        {/* Call handlePreviousButtonClick function when the Previous button is clicked */}
        <button onClick={handlePreviousButtonClick}>Previous</button>
        {/* Disable buttons if exam is submitted */}
        <button onClick={handleSaveButtonClick} disabled={examSubmitted}>Save and Next </button>
        {/* Submit button should remain enabled until exam is submitted */}
        <button onClick={handleSubmitButtonClick} disabled={examSubmitted}>Submit</button>
      </div>
    </div>
  );
}

export default Foot;
