import React from "react";

function Side({ onSelectQuestion, selectedSubject, data }) {


  if (!data) {
    return <div>Loading...</div>; // Or any other fallback UI
  }
  const physicsLength = data.map(item => item.questions.Physics.length);
  const chemistryLength = data.map(item => item.questions.Chemistry.length);
  const mathsLength = data.map(item => item.questions.Maths.length);

  let length = 0;
  if (selectedSubject === "Physics") {
    length = physicsLength;
  } else if (selectedSubject === "Chemistry") {
    length = chemistryLength;
  } else if (selectedSubject === "Maths") {
    length = mathsLength;
  }

  const renderButtons = () => {
    const buttons = [];
    for (let i = 1; i <= length; i++) {
      buttons.push(
        <button
          className="circle1"
          key={i}
          onClick={() => onSelectQuestion({ i })}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div>
      <div className="container">
        <div>
          <div className="row">
            <div className="container1">
              <div className="circle green">10</div>
              <div className="label">Answered</div>
            </div>
            <div style={{ width: "30px" }}></div>
            <div className="container1">
              <div className="circle red">10</div>
              <div className="label">Not Answered</div>
            </div>
          </div>
          <div className="row">
            <div className="container1">
              <div className="circle white">10</div>
              <div className="label">Not Visited</div>
            </div>
            <div className="container1">
              <div className="circle violet">10</div>
              <div className="label">Marked For Review</div>
            </div>
          </div>
        </div>
      </div>

      {selectedSubject && (
        <div
          style={{
            width: "39.3vh",
            marginTop: "10px",
            marginBottom: "10px",
            height: "5vh",
            backgroundColor: "rgb(74, 52, 209)",
            paddingLeft: "5px",
            paddingTop: "15px",
            color: "white",
            borderRadius: "5px",
          }}
        >
          <b>{selectedSubject}</b>
        </div>
      )}

      <div
        className="qp"
        style={{
          width: "40vh",
          backgroundColor: "rgb(226, 236, 255)",
        }}
      >
        <div style={{ paddingTop: "10px", marginBottom: "10px" }}>
          Choose a Question
        </div>
        <div className="container2" id="klo">
          {renderButtons()}
        </div>
      </div>
    </div>
  );
}

export default Side;
