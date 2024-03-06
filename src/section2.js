import React from "react";
import Button from '@mui/material/Button';

function Section2({ onSelectSubject }) {
  return (
    <div>
      <div
        id="sec2"
        style={{
          margin: "14px 20px",
          height: "28px",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div style={{marginRight:"5px"}}>
          
          
            <Button variant="contained" onClick={() => onSelectSubject('Physics')}><b>Physics</b></Button>
          
        </div>
        <div style={{marginRight:"5px"}}>
        <Button variant="contained" onClick={() => onSelectSubject('Chemistry')}><b>Chemistry</b></Button>
        </div>
        <div style={{marginRight:"5px"}}>
          <Button variant="contained" onClick={() => onSelectSubject('Maths')}><b>Maths</b></Button>
        </div>
      </div>
    </div>
  );
}

export default Section2;
