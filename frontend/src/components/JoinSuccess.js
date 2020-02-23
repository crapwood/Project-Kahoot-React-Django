import React, {useState} from 'react';
import {withRouter, useLocation} from "react-router-dom";
import "./css/join.css";
import {Store,useInterval} from "./Utils";


export default withRouter(function JoinSuccess(props) {
    const {history} = props;
    const location = useLocation();

    async function canPlay() {
            const response = await fetch('http://127.0.0.1:8000/games');
            const data = await response.json();
        if(data.games.includes(location.state.pincode)){
            history.push('/play');
        }
    }

    useInterval(canPlay,1000);

    return(<div className="joinsuccess-wrapper">
            <h1>{location.state.playername} you are IN!!!!</h1>

    </div>)
})