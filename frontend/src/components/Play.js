import React, {useState, useEffect} from 'react';
import './css/play.css';
import Button from 'react-bootstrap/Button';
import Row from "react-bootstrap/Row";
import {useInterval,Store} from "./Utils";


const Play = (props) =>{
    const [timer,setTimer] = useState(0);
    const [local_data,setLocalData] = useState([]);
    const [count,setCount] = useState(0);
    const[show,setShow] = useState(false);
    const [Q,setQ] = useState("");
    const [ans,setAns] = useState("");
    const [score,setScore] = useState(0);
    const [choice1,setChoice1] = useState("");
    const [choice2,setChoice2] = useState("");
    const [choice3,setChoice3] = useState("");
    const [choice4,setChoice4] = useState("");

    useEffect(()=>{
       if(timer === 0) return;
       const currentTimer = timer;
       setTimeout(()=>{
           if(timer !== currentTimer) return;
           setTimer(currentTimer - 1);
       },1000)
    },[timer]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('http://127.0.0.1:8000/quiz');
            const data = await response.json();

            for(const item in data){
                local_data.push({
                    entry:{
                        "qnum":item,
                        "question": data[item].question,
                        "answers": data[item].answers,
                        "right_ans":data[item].correct_ans,
                    }
                });
            }
            setLocalData([...local_data]);
            // console.log(Store);
            nextQuestion();
        }
        fetchData();
    }, []);

    const nextQuestion = () =>{
        setShow(()=>{
            setTimeout(() =>{
                setShow(true);
                },5000);
            return false;
        });
        setCount(oldv => oldv + 1);
        setQ(local_data[count].entry.question);
        setChoice1(local_data[count].entry.answers[0]);
        setChoice2(local_data[count].entry.answers[1]);
        setChoice3(local_data[count].entry.answers[2]);
        setChoice4(local_data[count].entry.answers[3]);
        setTimer(5);
    };

    const getAnswers = (choice) => {
        if(choice === local_data[count - 1].entry.right_ans){
            setScore( oldScore => oldScore + 100);
        }
        setShow(false);

    };

    return(
        <div className="playpage-wrapper">
            <h2>{Q}</h2>
            <p>{timer}</p>
            <Row>
                {show && (<Button onClick={() => {getAnswers(choice1)}} style={{color:"red"}} className="answer-btn" variant="dark">{choice1}</Button>)}
                {show && (<Button onClick={() => {getAnswers(choice2)}} style={{color:"green"}} className="answer-btn" variant="dark">{choice2}</Button>)}
            </Row>
            <Row>
                {show && (<Button onClick={() => {getAnswers(choice3)}} style={{color:"blue"}} className="answer-btn" variant="dark">{choice3}</Button>)}
                {show && (<Button onClick={() => {getAnswers(choice4)}} style={{color:"yellow"}} className="answer-btn" variant="dark">{choice4}</Button>)}
            </Row>
            <Row>
                {count < local_data.length &&(<Button onClick={nextQuestion}>Next</Button>)}
            </Row>
            <h3>SCORE: {score}</h3>
        </div>
    )
};

export default Play;