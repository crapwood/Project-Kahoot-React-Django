import React, {useState, useEffect} from 'react';
import {withRouter, useLocation} from "react-router-dom";
import './css/play.css';
import Button from 'react-bootstrap/Button';
import Row from "react-bootstrap/Row";
import {useInterval,Store} from "./Utils";


const Play = (props) =>{
    const location = useLocation();
    const [timerBeforeQ,setTimerBeforeQ] = useState(0);
    const [timerAfterQ,setTimerAfterQ] = useState(25);
    const [local_data,setLocalData] = useState([]);
    const [count,setCount] = useState(0);
    const[show,setShow] = useState(false);
    const [Q,setQ] = useState("");
    const [didAnswer,setDidAnswer] = useState(false);
    const [ans,setAns] = useState("");
    const [score,setScore] = useState(0);
    const [choice1,setChoice1] = useState("");
    const [choice2,setChoice2] = useState("");
    const [choice3,setChoice3] = useState("");
    const [choice4,setChoice4] = useState("");

    useEffect(()=>{
       if(timerBeforeQ === 0) return;
       const currentTimer = timerBeforeQ;

       setTimeout(()=>{
           if(timerBeforeQ !== currentTimer) return;
           setTimerBeforeQ(currentTimer - 1);
       },1000)

    },[timerBeforeQ]);

        useEffect(() => {
            if (timerAfterQ === 0) return;
            const timer = timerAfterQ;
            setTimeout(() => {
                if (timerAfterQ !== timer) return;
                setTimerAfterQ(timer - 1);
            }, 1000)
        }, [timerAfterQ]);

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
            console.log(Store);
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
        setTimerBeforeQ(5);
        setTimerAfterQ(25);
    };

    const onAnswer = question => async () =>{
        if(didAnswer) return;
        setDidAnswer(true);
        const response = await fetch('http://127.0.0.1:8000/join/', {
        method: "POST",
        body: JSON.stringify({'pin_code': pinCode, 'answer':question}),
        headers: {
            'content-type': 'application/json'
        }
      });

    };

    return(
        <div className="playpage-wrapper">
            <h2>{Q}</h2>
            {timerBeforeQ > 0 && (<h1 className="timer-before-question-bigscr">{timerBeforeQ}</h1>)}
            <Row>
                {show && (<Button onClick={onAnswer(1)} style={{color:"white", fontSize:40 +"px"}} className="answer-btn" variant="danger">{choice1}</Button>)}
                {show && (<Button onClick={onAnswer(2)} style={{color:"white", fontSize:40 +"px"}} className="answer-btn" variant="success">{choice2}</Button>)}
            </Row>
            <Row>
                {show && (<Button onClick={onAnswer(3)} style={{color:"white", fontSize:40 +"px"}} className="answer-btn" variant="primary">{choice3}</Button>)}
                {show && (<Button onClick={onAnswer(4)} style={{color:"white", fontSize:40 +"px"}} className="answer-btn" variant="warning">{choice4}</Button>)}
            </Row>
            {/*<Row>*/}
            {/*    {show && count < local_data.length &&(<Button onClick={nextQuestion}>Next</Button>)}*/}
            {/*</Row>*/}
            {timerAfterQ === 0 && count < local_data.length &&(nextQuestion())}
            {show && (<p style={{position:"fixed", bottom:0, fontSize:70+"px"}} className="timer-after-question-bigscr">{timerAfterQ}</p>)}
            <p style={{position:"fixed",right:0, fontSize:70+"px"}} className="timer-after-question-bigscr">{location.state.playername}</p>
        </div>
    )
};

export default Play;