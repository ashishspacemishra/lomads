import React from "react";
import "../styles/Modal.css";
import "../styles/App.css";
import userLogo from "../assets/userLogo.svg";
import proposalImage from "../assets/proposalImage.svg";
import {useMoralis} from "react-moralis";

const LoginBar = ({ isUserLoggedIn, onLoginButtonClick, onLogoutButtonClick, showStatus, status, displayAddress}) => {

    const Bar = () => {
        return !isUserLoggedIn ? (<LoginBar />) : (<LogoutBar />);
    }

    const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
    const moralisLogout = async () => {
        await logout();
        onLogoutButtonClick();
        console.log("logged out");
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
                    <img src={proposalImage} style={{}} id={"proposalImage"}/>
                    {displayAddress}
                </div>
                <button id="logout" className="App-logout" onClick={moralisLogout}>
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