import React from "react";


function Section3() {
    return (
      <div>
        <div
          id="sec3"
          style={{
            margin: "14px 20px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "rgb(245, 245, 245)",
          }}
        >
          <div style={{ marginRight: "10px" }}>
            <div
              style={{
                textAlign: "center",
                padding: "4px",
                backgroundColor: "green",
                color: "white",
                borderRadius: "5px",
              }}
            >
              Marks for Right Answer: 1
            </div>
          </div>
          <div>|</div>
          <div style={{ marginLeft: "10px" }}>
            <div
              style={{
                textAlign: "center",
                padding: "4px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "5px",
              }}
            >
              Negative Marks: 0
            </div>
          </div>
        </div>
      </div>
    );
  }
export default Section3