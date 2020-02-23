import React from 'react';
import { Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Home";
import Create from "./Create";
import Join from "./Join";
import Play from "./Play";
import JoinSuccess from "./JoinSuccess";

const Main = () =>{
return(<Router>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/create">
            <Create/>
          </Route>
          <Route path="/join">
            <Join/>
          </Route>
          <Route path="/play">
            <Play/>
          </Route>
          <Route path="/success">
            <JoinSuccess/>
          </Route>
        </Router>)};

export default Main