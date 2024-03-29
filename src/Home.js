
import React, { useEffect, useState } from 'react';
import './App.css';
import './Home.css';
import Navbar from './Navbar';
import Section1 from './section1';
import Section2 from './section2';
import Section3 from './section3';
import QuestionPan from './Quep';
import Foot from './Footer';
import Side from './Sidebar';
import Start from './Start';
import Result from './Result';




const USER_ID = "hiino";


function Home() {
    

    const [selectedQuestion, setSelectedQuestion] = useState({ i: 1 });
    const [data, setData] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState("Physics");
    const [selectedOptionText, setSelectedOptionText] = useState("");
    const [timeFromStart, setRemTime] = useState({ hours: 3, minutes: 0, seconds: 0 });
    const [examStarted, setExamStarted] = useState(false);
    const [examSubmitted, setExamSubmitted] = useState(false);
    const [dataOBJ, setDataOBJ] = useState({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            examId: null,
            userId: USER_ID // Assuming a fixed user ID for now
        })
    });


    const createNewResponse = async () => {
        if (!data) return;
        const response = await fetch('http://localhost:5000/admin/exam/createNewResponse', dataOBJ);
        const res = await response.json();
        return res;
    };



    useEffect(() => {
        const fetchExamQuestions = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin/exam/questions');
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching exam questions:', error);
            }
        };

        fetchExamQuestions();

    }, []);

    const handleExamSubmit = () => {
        setExamSubmitted(true);
        setExamStarted(false);
        localStorage.setItem("examSubmitted", true);
        localStorage.setItem("examStarted", false);
        // localStorage.setItem("timeLeft", 0);
        // Assuming you have access to examId and userId here
        const existingExamId = localStorage.getItem("examId");
        const existingUserId = localStorage.getItem("userId");
        if (existingExamId && existingUserId) {
            // Save the examId and userId in local storage
            localStorage.setItem("examId", existingExamId);
            localStorage.setItem("userId", existingUserId);
        }
    };

    // console.log(examStarted);

    const startExam = async () => {
        // localStorage.clear();
        let res = await createNewResponse();
        const { startTime } = res;
        const diff = new Date((Date.now() + 60 * 1000) - new Date(startTime));
        setRemTime({ hours: diff.getUTCHours(), minutes: diff.getUTCMinutes(), seconds: diff.getSeconds() });
        setExamStarted(true);
        return res;
    };

    // console.log(timeFromStart);

    useEffect(() => {
        if (!data) return;
        const { examId } = data[0];
        const t = { ...dataOBJ };
        t.body = JSON.stringify({
            examId: examId,
            userId: USER_ID
        });
        setDataOBJ(t);

        const getExamData = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin/exam/getSavedResponse', dataOBJ);
                let res = await response.json();
                if (res["existingResponse"] === false) {
                    console.log(">>>>>");
                } else {
                    setExamStarted(true);
                    const { startTime } = res;
                    const diff = new Date((Date.now()) - new Date(startTime));
                    setRemTime({ hours: diff.getUTCHours(), minutes: diff.getUTCMinutes(), seconds: diff.getSeconds() });
                }
            } catch (error) {
                console.error('Error fetching exam questions:', error);
            }
        };

        getExamData();

    }, [data]);

    const handleQuestionSelect = (questionId) => {
        setSelectedQuestion(questionId);
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
    };

    const handleOptionSelect = (selectedOptionText) => {
        setSelectedOptionText(selectedOptionText);
    };

    const handlePreviousButtonClick = () => {
        if (selectedQuestion["i"] >= 2) {
            setSelectedQuestion(prevState => ({ ...prevState, i: prevState.i - 1 }));
        } else {

            setSelectedQuestion(selectedQuestion);
        }
    };

    // console.log(selectedQuestion["i"]);
    // console.log(selectedSubject);
    // console.log(typeof(selectedSubject));

    const handleSaveButtonClick = async () => {
        if (selectedQuestion && data) {
            try {

                // console.log(data[0]);

                const examId = data[0].examId;
                const subject = selectedSubject;
                const questionNumber = selectedQuestion["i"];
                let questionText = "";
                const subjectData = data[0].questions[selectedSubject];
                // console.log(subjectData.length);

                if (subjectData) {
                    const question = subjectData[questionNumber - 1];
                    if (question) {
                        questionText = question.questionText;
                    }
                }
                const selectedAnswer = selectedOptionText;

                const response = await fetch('http://localhost:5000/admin/exam/saveResponse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        examId,
                        subject,
                        questionNumber,
                        questionText,
                        selectedAnswer,
                        userId: USER_ID
                    })
                });

                if (response.ok) {
                    console.log('Response saved successfully');
                } else {
                    console.log('Failed to save response');
                }




                if (selectedQuestion["i"] < subjectData.length) {
                    setSelectedQuestion(prevState => ({ ...prevState, i: prevState.i + 1 }));
                } else {
                    // console.log(selectedQuestion);
                    setSelectedQuestion(selectedQuestion);
                }
            } catch (error) {
                console.error('Error saving response:', error);
            }
        }



    };




    const getInitialQuestion = () => {
        if (data && selectedSubject) {
            const questions = data[0].questions[selectedSubject];
            if (questions) {
                return questions[0];
            }
        }
        return null;
    };

    const initialQuestion = getInitialQuestion();

    useEffect(() => {
        const isExamSubmitted = localStorage.getItem("examSubmitted");
        if (isExamSubmitted === "true") {
            setExamSubmitted(true);
        }
    }, []);



    const handleBackToStart = () => {
        setExamStarted(false);
        setExamSubmitted(false);

        localStorage.setItem("examSubmitted", false);

    };




    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);





    return (
        examSubmitted ? (
            <Result onBackToStart={handleBackToStart} />
        ) : examStarted ? (
            <div className="App">
                <Navbar />
                <div className="hum">
                    <div className="mainbody">
                        <Section1 rem_time={timeFromStart} auto_submit={handleExamSubmit} />
                        <Section2 onSelectSubject={handleSubjectSelect} />
                        <Section3 />
                        <QuestionPan questionid={selectedQuestion || initialQuestion?.id} data={data} selectedSubject={selectedSubject} onOptionSelect={handleOptionSelect} />
                    </div>
                    <div className="seco">
                        <Side onSelectQuestion={handleQuestionSelect} selectedQuestion={selectedQuestion} selectedSubject={selectedSubject} data={data} />
                    </div>
                    <Foot
                        handlePreviousButtonClick={handlePreviousButtonClick}
                        handleSaveButtonClick={handleSaveButtonClick}
                        handleSubmitButtonClick={handleExamSubmit}
                        examSubmitted={examSubmitted}
                    />
                </div>
            </div>
        ) : (
            <Start onClick={() => {
                startExam();
                setExamStarted(true);
            }} />
        )
    );
}



export default Home
