import React, {useEffect, useState, useRef} from 'react';
import Button from 'react-bootstrap/Button';
import {withRouter} from "react-router-dom";
import './css/create.css';
import {useInterval, shuffle} from "./Utils";

export default withRouter(function Create(props){
    const {history} = props;
    const [bg,setBg] = useState("#282c34");
    const [pin_code,setPin_Code] = useState("");
    const [participants, setParticipants] = useState([]);

    useEffect( () => {
        async function fetchData() {
            const response = await fetch('http://127.0.0.1:8000/create');
            const data = await response.json();
            setPin_Code(data.pincode);
        }
        fetchData();
        }, []);

    const getParticipants = async () =>{
         if(pin_code.length === 0) return;
         const response = await fetch('http://127.0.0.1:8000/participants/', {
                method: "POST",
                body: JSON.stringify({'pin_code': pin_code}),
                headers: {
                    'content-type': 'application/json'
                }
         });
          const data = await response.json();
          setParticipants([...data.participants]);
    };

    const start = async () =>{
        const response = await fetch('http://127.0.0.1:8000/games/', {
                method: "POST",
                body: JSON.stringify({'pin_code': pin_code}),
                headers: {
                    'content-type': 'application/json'
                }
         });
        history.push({
           pathname: '/play',
           state: { participants: participants}
       });
    };

    const changeBgColor = () => {
      const colors = ["#ed8b06", "#2212ab", "#2bce79", "#9d15a9"];
      shuffle(colors);
      setBg(colors[0]);
    };
    useInterval(getParticipants, 2000);
    useInterval(changeBgColor, 3000);
    
    return(
    <div className="createpage-wrapper" style={{background: bg}}>
        <h2>Enter pincode to Join Game</h2>
        <h3>{pin_code}</h3>
        <Button className="start-btn" onClick={start} variant="dark">START</Button>
        <div className="temp-wrapper">
            <ul>
                {participants.map(person =>{
                    return <li>{person}</li>
                })}
            </ul>
        </div>
    </div>)
});



