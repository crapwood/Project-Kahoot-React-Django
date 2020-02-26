import React, {useState, useEffect} from 'react';
import {withRouter, useLocation} from "react-router-dom";
import {shuffle} from "./Utils";
import './css/play.css';
import Button from 'react-bootstrap/Button';
import Row from "react-bootstrap/Row";

import joey from "./img/joey.gif";
import teacher from "./img/teacher.gif";
import minions from "./img/minions.gif";
import jeremy from "./img/jeremy.gif";


const Play = (props) =>{
    const location = useLocation();
    const [timerBeforeQ,setTimerBeforeQ] = useState(0);
    const [timerAfterQ,setTimerAfterQ] = useState(25);
    const [local_data,setLocalData] = useState([]);
    const [count,setCount] = useState(0);
    const[show,setShow] = useState(false);
    const [Q,setQ] = useState("");
    const [didAnswer,setDidAnswer] = useState(false);
    // const [ans,setAns] = useState("");
    let [score,setScore] = useState(0);
    const [choice1,setChoice1] = useState("");
    const [choice2,setChoice2] = useState("");
    const [choice3,setChoice3] = useState("");
    const [choice4,setChoice4] = useState("");

    const thumbs_up = [joey, jeremy, minions, teacher];
    shuffle(thumbs_up);

    // STARTING TIMER 5 SECONDS
    useEffect(()=>{
        setDidAnswer(false);
       if(timerBeforeQ === 0) return;
       const currentTimer = timerBeforeQ;

       setTimeout(()=>{
           if(timerBeforeQ !== currentTimer) return;
           setTimerBeforeQ(currentTimer - 1);
       },1000)
    },[timerBeforeQ]);

    // TIMER FOR ANSWERING WINDOW
    useEffect(() => {
            if (timerAfterQ === 0) return;
            const timer = timerAfterQ;
            setTimeout(() => {
                if (timerAfterQ !== timer) return;
                setTimerAfterQ(timer - 1);
            }, 1000)
        }, [timerAfterQ]);

    // GET QUIZ FROM DB
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
            nextQuestion();
        }
        fetchData();
    }, []);

    // SHOW QUESTIONS
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
        setTimerBeforeQ(5);
        setTimerAfterQ(25);
    };

    // GET WHO ANSWERED AND WHAT
    // const onAnswer = question => async () =>{
    //     if(didAnswer) return;
    //     setDidAnswer(true);
    //     console.log(question);
    //     const response = await fetch('http://127.0.0.1:8000/onanswer/', {
    //     method: "POST",
    //     body: JSON.stringify({answer:question, playername: location.state.playername, q_num:count - 1, pin_code: location.state.pincode}),
    //     headers: {
    //         'content-type': 'application/json'
    //     }
    //   });
    // };

    const onAnswer = async (ans) =>{
      //   const response = await fetch('http://127.0.0.1:8000/onanswer/', {
      //   method: "POST",
      //   body: JSON.stringify({answer:ans, playername: location.state.playername, q_num:count - 1, pin_code: location.state.pincode}),
      //   headers: {
      //       'content-type': 'application/json'
      //   }
      // });
        if(ans === local_data[count - 1].entry.right_ans) {
            setScore(score += (timerAfterQ * 10));
        }
        setDidAnswer(true);
        setShow(false);
    };

    return(
        <div className="playpage-wrapper">
            {!didAnswer && (<h2>{Q}</h2>)}
            {didAnswer && (<img src={thumbs_up[0]} alt="thumbs up"/>)}
            {timerBeforeQ > 0 && (<h1 className="timer-before-question-bigscr">{timerBeforeQ}</h1>)}
            <Row>
                {show && (<Button onClick={() => {onAnswer(choice1)}} style={{color:"white", fontSize:40 +"px"}} className="answer-btn" variant="danger">{choice1}</Button>)}
                {show && (<Button onClick={() => {onAnswer(choice2)}} style={{color:"white", fontSize:40 +"px"}} className="answer-btn" variant="success">{choice2}</Button>)}
            </Row>
            <Row>
                {show && (<Button onClick={() => {onAnswer(choice3)}} style={{color:"white", fontSize:40 +"px"}} className="answer-btn" variant="primary">{choice3}</Button>)}
                {show && (<Button onClick={() => {onAnswer(choice4)}} style={{color:"white", fontSize:40 +"px"}} className="answer-btn" variant="warning">{choice4}</Button>)}
            </Row>
                {timerAfterQ === 0 && count < local_data.length &&(nextQuestion())}
                {(show || didAnswer) && (<p className="timer-after-question-bigscr">{timerAfterQ}</p>)}
                <p className="playername">{location.state.playername}</p>
                <p className="score">{score}</p>
        </div>
    )
};

export default Play;