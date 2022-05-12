import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Proposal from "./components/Proposal";
import Treasury from "./components/Treasury";
import { Provider } from "react-redux";
import {createStore, combineReducers, applyMiddleware} from "redux";

ReactDOM.render(
  <React.StrictMode>
      {/*<Provider store={store}>*/}
      <Router>
          <div>
              <Routes>
                  <Route exact path="/" element={<App page={"HOME"} />} />
                  <Route path="/proposals" element={<App page={"PROPOSAL"} />} />
                  <Route path="/treasury" element={<App page={"TREASURY"}  />} />
                  <Route path="/updates" element={<App page={"UPDATES"}  />} />
                  <Route path="/members" element={<App page={"MEMBERS"}  />} />
                  <Route path="/chat" element={<App page={"CHAT"}  />} />
              </Routes>
          </div>
      </Router>
      {/*</Provider>*/}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
