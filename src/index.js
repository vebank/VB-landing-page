import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import store from "./_helpers/store";

import "./assets/styles/index.scss";

import App from "./App";
import Wallet from "./Wallet";
import AlertMessages from "./components/partials/AlertMessages";

//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <AlertComingSoon />
        <FireflyContainer /> */}
      <Wallet />
      
      <App />
      <AlertMessages />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
