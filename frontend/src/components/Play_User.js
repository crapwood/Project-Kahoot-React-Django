import React, {useState, useEffect} from 'react';
import {withRouter, useLocation} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import "./css/onplay.css";


export default withRouter(function PlayUser(props){
    const { history } = props;
    const location = useLocation();

    const [timer,setTimer] = useState(0);
    const [timerAfterQ,setTimerAfterQ] = useState(25);
    const [score,setScore] = useState(0);
    const[show,setShow] = useState(false);


    useEffect(()=>{
       if(timer === 0) return;
       const currentTimer = timer;
       setTimeout(()=>{
           if(timer !== currentTimer) return;
           setTimer(currentTimer - 1);
       },1000)
    },[timer]);
    useEffect(()=>{
        setTimer(5);
    },[]);
    return(<>
        <div className="onplaypage-wrapper">
                {timer > 0 &&(<h1 className="timer-before-question">{timer}</h1>)}
                {timer === 0 &&(<span>GAME ID: {location.state.pincode}</span>)}
            <Row>
                {timer === 0 &&(<Button className="btn-answer" variant="danger"></Button>)}
                {timer === 0 &&(<Button className="btn-answer" variant="success"></Button>)}
            </Row>
            <Row>
                {timer === 0 &&(<Button className="btn-answer" variant="primary"></Button>)}
                {timer === 0 &&(<Button className="btn-answer" variant="warning"></Button>)}
            </Row>
                {timer === 0 &&(<span className="nickname">{location.state.playername}</span>)}
                {timer === 0 &&(<span>SCORE: {score}</span>)}
       </div>

        </>
    )
});

