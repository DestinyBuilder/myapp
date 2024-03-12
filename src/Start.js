import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function Start({ onClick }) {



  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('TOKEN')
    if (!token) {
      navigate('/signin')
    }
  }, [])



  return (
    <div className="start-page">
      <h2>Welcome to the Test</h2>
      <button onClick={onClick}>Start Test</button>

      <div className="card">
        <div>HOME</div>
        <div>
          <span> {localStorage.getItem('EMAIL')} </span>
          <button
            onClick={() => {
              localStorage.clear()
              navigate('/signin')
            }}
          > LOGOUT </button>
        </div>



      </div>
    </div>
  );
}

export default Start;
