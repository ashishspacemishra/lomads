import React from "react";
import "../styles/Modal.css";
import "../styles/App.css";
import userLogo from "../assets/userLogo.svg";
import proposalImage from "../assets/proposalImage.svg";

const LoginBar = ({ isUserLoggedIn, onLoginButtonClick, onLogoutButtonClick, showStatus, status, onBuyTokenButtonClick, displayAddress}) => {

    const Bar = () => {
        return !isUserLoggedIn ? (<LoginBar />) : (<LogoutBar />);
    }

    const LoginBar = () => {
        return (
            <div>
                <button id="login" className="App-login" onClick={onLoginButtonClick}>
                    <img src={userLogo} alt="Logo" />
                </button>
                { showStatus &&
                  <div style={{paddingTop: 30, paddingLeft: 550}}>{status}</div>
                }
            </div>
        );
    }

    const LogoutBar = () => {
        return (
            <div>
                <div className={"accountInfo"}>
                    <img src={proposalImage} style={{}} id={"proposalImage"} onClick={onBuyTokenButtonClick}/>
                    {displayAddress}
                </div>
                <button id="logout" className="App-logout" onClick={onLogoutButtonClick}>
                    LOGOUT
                </button>
            </div>
        );
    }

    return (
        <div>
            <Bar />
        </div>
    );
};

export default LoginBar;