import React from 'react';

function Start({onClick} ) {
  return (
    <div className="start-page">
      <h2>Welcome to the Test</h2>
      <button onClick={onClick}>Start Test</button>
    </div>
  );
}

export default Start;
