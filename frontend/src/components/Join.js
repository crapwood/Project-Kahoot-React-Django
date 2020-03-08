import React, {useState} from 'react';
import {Link, withRouter} from "react-router-dom";
import './css/join.css';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

export default withRouter(function Join(props){
    const {history} = props;
    const [pinCode,setPinCode] = useState(null);
    const [playername, setPlayername] = useState("");
    const [invalidPin,setInvalidPin] = useState("");

    const onSubmit = async () => {
      setInvalidPin("");
      const response = await fetch('/join/', {
        method: "POST",
        body: JSON.stringify({'pin_code': pinCode, "name": playername}),
        headers: {
            'content-type': 'application/json'
        }
      });
      const data = await response.json();
      if(data.result){
        history.push({
           pathname: '/success',
           state: { pincode: pinCode, playername:playername, }
       });
      }
      else{
          setInvalidPin("Invalid pincode try again...")
      }
    };

    return(
        <div className="joinpage-wrapper">
            <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>PINCODE</Form.Label>
                    <Form.Control onChange={(e) =>{setPinCode(e.target.value)}} type="text" placeholder="ex. 12Df5J" />
                    <Form.Label>NICKNAME</Form.Label>
                    <Form.Control onChange={(e) =>{setPlayername(e.target.value)}} type="text" placeholder="Joe" />
                    <Button className="joinbtn" onClick={onSubmit}>JOIN</Button>
                    <p>{invalidPin}</p>
                </Form.Group>
            </Form>
        </div>
    )
});

