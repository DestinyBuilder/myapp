import React, { useEffect, useState } from 'react';
// import './App.css';
import Navbar from './Navbar';
import Section1 from './section1';
import Section2 from './section2';
import Section3 from './section3';
import QuestionPan from './Quep';
import Foot from './Footer';
import Side from './Sidebar';
import Start from './Start';
import Result from './Result';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Signup from './Signup';
import Signin from './Signin';
import Home from './Home';
import ForgetPassword from './ForgetPassword';
import NewSubmit from './Newsubmit';



const USER_ID = "hiino";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Home />} />
          <Route path="/forget-pass" element={<ForgetPassword />} />
          <Route path="/otp" element={<NewSubmit />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;





