import React, {useEffect, useState, useRef} from 'react';
import Button from 'react-bootstrap/Button';
import {withRouter} from "react-router-dom";
import './css/create.css';
import {useInterval, Store} from "./Utils";


export default withRouter(function Create(props){
    const {history} = props;
    const [btn,setBtn] = useState("success");
    const [bg,setBg] = useState("#282c34");
    const [pin_code,setPin_Code] = useState("");
    const [participants, setParticipants] = useState([]);

    useEffect( () => {
        async function fetchData() {
            const response = await fetch('http://127.0.0.1:8000/create');
            const data = await response.json();
            setPin_Code(data.pincode);
            // console.log(Store);
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


    // const shuffle = (array) => {
    //   for (let i = array.length - 1; i > 0; i--) {
    //     let j = Math.floor(Math.random() * (i + 1));
    //     [array[i], array[j]] = [array[j], array[i]];
    //   }
    // };
    // const changeBtnColor = () => {
    //     const colors = ["success", "danger", "primary", "secondary", "warning", "info", "light"];
    //     shuffle(colors);
    //     setBtn(colors[0]);
    // };
    // const changeBgColor = () => {
    //   const colors = ["#ed8b06", "#2212ab", "#2bce79", "#9d15a9"];
    //   shuffle(colors);
    //   setBg(colors[0]);
    // };


    // useInterval(getParticipants, 2000);
    // useInterval(changeBtnColor, 1000);
    // useInterval(changeBgColor, 3000);

    const start = async () =>{
        // Store.id = pin_code;
        // Store.creator = true;
        const response = await fetch('http://127.0.0.1:8000/games/', {
                method: "POST",
                body: JSON.stringify({'pin_code': pin_code}),
                headers: {
                    'content-type': 'application/json'
                }
         });
        history.push('/play');
    };

    return(
    <div className="createpage-wrapper" style={{background: bg}}>
        <h2>Enter pincode to Join Game</h2>
        <h3>{pin_code}</h3>
        <Button className="start-btn" onClick={start} variant={btn}>START</Button>
        <div className="temp-wrapper">
            <ul>
                {participants.map(person =>{
                    return <li>{person}</li>
                })}
            </ul>
        </div>
    </div>)
});



