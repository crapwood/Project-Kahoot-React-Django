import React, {useState, useEffect} from 'react';
import {withRouter, useLocation} from "react-router-dom";
import {shuffle, useInterval} from "./Utils";
import './css/play.css';
import Button from 'react-bootstrap/Button';
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import joey from "./img/joey.gif";
import teacher from "./img/teacher.gif";
import minions from "./img/minions.gif";
import jeremy from "./img/jeremy.gif";

const End = (props) =>{


    return <h1>END</h1>
};
const Result = (props) => {
    const {pinCode, next_question, isCreator} = props;
    const [scoreboard,setScoreboard] = useState([]);
    const [timerScoreboard, setTimerScoreBoard] = useState(8);

    useEffect(()=>{
        getParticipants();
        setTimerScoreBoard(10);
    },[]);

    useEffect(() => {
        if (timerScoreboard === 0) return;
        const timer = timerScoreboard;
        setTimeout(() => {
            if (timerScoreboard !== timer) return;
            setTimerScoreBoard(timer - 1);
        }, 1000)
    }, [timerScoreboard]);


    const getParticipants = async () => {
        const response = await fetch('/participants/', {
            method: "POST",
            body: JSON.stringify({'pin_code': pinCode}),
            headers: {
                'content-type': 'application/json'
            }
        });
        const data = await response.json();
        let temp = [];
        for (const x of data.participants) {
            temp.push(x);
        }
        temp.sort((a, b) => a.score > b.score ? -1 : 1);
        setScoreboard(temp);
    };

    const showScores = () =>{
        return scoreboard.map(x =>
            <tr>
                <td>{x.name}</td>
                <td>{x.score}</td>
            </tr>
        )
    };

    const showTable = () =>{
      return <>
        <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                  {isCreator && showScores()}
                  </tbody>
                </Table>
          </>

    };

    return (<>
                {!isCreator && (<h1>LOOK AT THE BIG SCREEN!!!</h1>)}
                {isCreator && showTable()}
                {timerScoreboard === 0 && next_question()}
            </>)
};


const Play = (props) => {
    const location = useLocation();
    const [timerBeforeQ, setTimerBeforeQ] = useState(0);
    const [timerAfterQ, setTimerAfterQ] = useState(25);
    const [local_data, setLocalData] = useState([]);
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);
    const [Q, setQ] = useState("");
    const [didAnswer, setDidAnswer] = useState(false);
    let [score, setScore] = useState(0);
    const [choice1, setChoice1] = useState("");
    const [choice2, setChoice2] = useState("");
    const [choice3, setChoice3] = useState("");
    const [choice4, setChoice4] = useState("");
    const [isRight,setIsRight] = useState(false);

    const thumbs_up = [joey, jeremy, minions, teacher];
    shuffle(thumbs_up);

    // STARTING TIMER 5 SECONDS
    useEffect(() => {
        setDidAnswer(false);
        if (timerBeforeQ === 0) return;
        const currentTimer = timerBeforeQ;
        setTimeout(() => {
            if (timerBeforeQ !== currentTimer) return;
            setTimerBeforeQ(currentTimer - 1);
        }, 1000)
    }, [timerBeforeQ]);

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
            const response = await fetch('/quiz/');
            const data = await response.json();
            for (const item in data) {
                local_data.push({
                    entry: {
                        "qnum": item,
                        "question": data[item].question,
                        "answers": data[item].answers,
                        "right_ans": data[item].correct_ans,
                    }
                });
            }
            setLocalData([...local_data]);
            nextQuestion();
        }

        fetchData();
    }, []);

    // SHOW QUESTIONS
    const nextQuestion = () => {
        setShow(() => {
            setTimeout(() => {
                setShow(true);
            }, 5000);
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
    const onAnswer = async (ans) => {
        setIsRight(false);
        if (ans === local_data[count - 1].entry.right_ans) {
            setScore((oldScore) => {
                const newScore = oldScore + (timerAfterQ * 10);
                fetch('/onanswer/', {
                    method: "POST",
                    body: JSON.stringify({
                        playername: location.state.playername,
                        pin_code: location.state.pincode,
                        score: newScore,
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                return newScore;
            });
            setIsRight(true)
        }
        console.log("this is from create "+location.state.pin_code);
        console.log("this is from joinsucces"+location.state.pincode);
        setDidAnswer(true);
        setShow(false);
    };


    return (
        <div className="playpage-wrapper">
            {!didAnswer && timerAfterQ > 0 && (<h2>{Q}</h2>)}
            {didAnswer && timerAfterQ > 0 && isRight&&(<img src={thumbs_up[0]} alt="thumbs up"/>)}
            {didAnswer && timerAfterQ > 0 && !isRight&&(<h1>SORRY WRONG ANSWER....</h1>)}
            {timerBeforeQ > 0 && (<h1 className="timer-before-question-bigscr">{timerBeforeQ}</h1>)}
            <Row>
                {show && timerAfterQ > 0 && (<Button onClick={() => {
                    onAnswer(choice1)
                }} style={{color: "white", fontSize: 40 + "px"}} className="answer-btn"
                                                     variant="danger">{choice1}</Button>)}
                {show && timerAfterQ > 0 && (<Button onClick={() => {
                    onAnswer(choice2)
                }} style={{color: "white", fontSize: 40 + "px"}} className="answer-btn"
                                                     variant="success">{choice2}</Button>)}
            </Row>
            <Row>
                {show && timerAfterQ > 0 && (<Button onClick={() => {
                    onAnswer(choice3)
                }} style={{color: "white", fontSize: 40 + "px"}} className="answer-btn"
                                                     variant="primary">{choice3}</Button>)}
                {show && timerAfterQ > 0 && (<Button onClick={() => {
                    onAnswer(choice4)
                }} style={{color: "white", fontSize: 40 + "px"}} className="answer-btn"
                                                     variant="warning">{choice4}</Button>)}
            </Row>
            {timerAfterQ === 0 && count < local_data.length && (
                <Result isCreator={location.state.isCreator} pinCode={location.state.pin_code} next_question={nextQuestion}/>)}
            {(show || didAnswer) && timerAfterQ > 0 && (<p className="timer-after-question-bigscr">{timerAfterQ}</p>)}
            {timerAfterQ > 0 && (<p className="playername">{location.state.playername}</p>)}
            {count === local_data.length && <End/>}
        </div>
    )
};

export default Play;