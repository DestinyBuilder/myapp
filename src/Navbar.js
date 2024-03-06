import React from 'react';

function Navbar() {
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  return (
    <div className="navbar">
      <div
        className="test-name"
        style={{
          textAlign: "center",
          padding: "14px 20px",
          textDecoration: "none"
        }}
      >
        Test Name
      </div>
      <div className="actions">
        <a href="#">View Instructions</a>
        <a href="#" onClick={enterFullscreen}>Enter Fullscreen</a>
      </div>
    </div>
  );
}

export default Navbar;
