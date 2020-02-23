import React, {useState} from 'react';
import { withRouter } from "react-router-dom";
import './css/home.css';
import Button from 'react-bootstrap/Button';


export default withRouter(function Home(props){
  const {history} = props;

    return(
      <div className="homepage-wrapper">
          <Button className="btn-home" variant="success" onClick={() => {history.push('/create')}} >Create Game</Button>
          <Button className="btn-home" onClick={() => {history.push('/join')}}>Join Game</Button>
      </div>
        )
});

