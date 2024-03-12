import React, { useState, useEffect } from "react";

function Section1({rem_time , auto_submit}) {
  const [timeLeft, setTimeLeft] = useState(rem_time);
  const [examStarted, setExamStarted] = useState(false);
  let timer;

  useEffect(() => {
    const storedExamStarted = localStorage.getItem("examStarted");
    const storedTimeLeft = JSON.parse(localStorage.getItem("timeLeft"));

    if (storedExamStarted === "true") {
      setExamStarted(true);
    }

    if (storedTimeLeft) {
      setTimeLeft(storedTimeLeft);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("examStarted", examStarted.toString());
    localStorage.setItem("timeLeft", JSON.stringify(timeLeft));

    if (examStarted) {
      const now = new Date();
      const startTime = new Date(now.getTime() + ( 60 * 1000)); // Add 3 hours to current time
      const timeDifference = startTime - now;
      
      timer = setInterval(() => {
        updateTimeLeft();
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        setExamStarted(false);
        auto_submit();
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });

      }, timeDifference);
    }

    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const updateTimeLeft = () => {
    setTimeLeft(prevTimeLeft => {
      if (prevTimeLeft.hours === 0 && prevTimeLeft.minutes === 0 && prevTimeLeft.seconds === 0) {
        clearInterval(timer);
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      let newSeconds = prevTimeLeft.seconds - 1;
      let newMinutes = prevTimeLeft.minutes;
      let newHours = prevTimeLeft.hours;

      if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes -= 1;
      }

      if (newMinutes < 0) {
        newMinutes = 59;
        newHours -= 1;
      }

      return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
    });
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const formatTime = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <div>
      <div
        id="sec1"
        style={{
          margin: "14px 20px",
          height: "28px",
          borderRadius: "5px",
          backgroundColor: "rgb(94, 150, 254)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div>
          <div style={{ textAlign: "center", paddingLeft: "5px" }}>
            Sections
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {!examStarted && (
            <button onClick={handleStartExam}>Start Exam</button>
          )}
          <div style={{ marginRight: "10px" }}>Time Left : </div>
          <div id="timel" style={{ marginRight: "10px" }}>
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section1;