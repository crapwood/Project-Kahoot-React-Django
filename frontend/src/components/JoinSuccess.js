import React, {useState} from 'react';
import {withRouter, useLocation} from "react-router-dom";
import "./css/join.css";
import {Store,useInterval} from "./Utils";


export default withRouter(function JoinSuccess(props) {
    const {history} = props;
    const location = useLocation();

    async function canPlay() {
            const response = await fetch('/games/');
            const data = await response.json();
        if(data.games.includes(location.state.pincode)){
            history.push({
           pathname: '/play',
           state: { pincode: location.state.pincode, playername:location.state.playername }
       });
        }
    }

    useInterval(canPlay,50);

    return(<div className="joinsuccess-wrapper">
            <h1>{location.state.playername} you are IN!!!!</h1>

    </div>)
})