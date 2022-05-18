import React, { useState }  from "react";
import priceDivider from "../assets/priceDivider.svg";
import loginSuccess from "../assets/loginSuccess.svg";
import metamask2 from "../assets/metamask2.svg";
import close from "../assets/closeModal.svg";
import daoImage from "../assets/daoImage.svg";
import discordLogoLarge from "../assets/discordLogoLarge.svg";
import "../styles/Modal.css";

const LoginModal = ({ isUserLoggedIn, showMetamaskLoginOption, onModalCloseClick, loginWeb3auth, LoginViaEmailOnClick, loginWithoutWalletOnClick}) => {

    const [validEmail, setValidEmail] = useState(false);
    const [emailValue, setEmailValue] = useState("");

    const handleEmailValueChange = (e) => {
        const email = e.target.value;
        // const emailFormat = "/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\\.)+[A-Za-z]+$/";
        const regex =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const validateEmail = regex.test(email);
        setEmailValue(email);
        if (validateEmail !== validEmail) {
            setValidEmail(!validEmail);
        }
    };

    const LoginViaEmail = (e) => {
        e.preventDefault();
        console.log(validEmail, emailValue);
        if (validEmail && (emailValue !== "")) {
            LoginViaEmailOnClick(emailValue);
        }
    };

    const Login = () => {
        return !isUserLoggedIn ? (<LoginPage />) : (<LoginSuccessPage />);
    }

    const LoginPage = () => {
        return (
            <div className="modalBackground">
                <div className="modalContainer">
                    <div className="titleCloseBtn">
                        <button onClick={onModalCloseClick}>
                            <img src={close}/>
                        </button>
                    </div>
                    <div className="title">
                        <img src={daoImage}/>
                    </div>
                    <div className="welcomeText">
                        Welcome to
                    </div>
                    <div className="daoName">
                        Ethic comfort fashion group
                    </div>
                    {
                        showMetamaskLoginOption ? (<ShowMetamaskLoginOption />) : (<ShowOtherLoginOption />)
                    }
                </div>
            </div>
        );
    }

    const LoginSuccessPage = () => {
        return (
            <div className="modalBackground">
                <div className="modalContainer">
                    <div className="titleCloseBtn">
                        <button onClick={onModalCloseClick}>
                            <img src={close}/>
                        </button>
                    </div>
                    <div className="title">
                        <img src={loginSuccess}/>
                    </div>
                </div>
            </div>
        );
    }

    const ShowMetamaskLoginOption = () => {
        return (
            <div className={"body"}>
                {/*onClick={this.connectMetamaskWallet}*/}
                <button className="modalLoginButton" onClick={() => loginWeb3auth("metamask")}>
                    <img src={metamask2} style={{padding:20}}/>
                </button>
                <div className={"loginWithoutWallet"}>
                    <a onClick={loginWithoutWalletOnClick}
                       style={{textDecorationLine: "underline"}}>login without crypto wallet </a>
                </div>
            </div>
        );
    }

    const ShowOtherLoginOption = () => {
        return (
            <div className={"body"} style={{paddingTop:15}}>
                {/*<img src={discordLogo} onClick={() => this.loginWeb3auth("discord")}/>*/}
                <button className="modalLoginButton" onClick={() => loginWeb3auth("discord")}>
                    <img src={discordLogoLarge}  style={{padding:"0px 20px 0px 20px"}}/>
                </button>
                <div id={"margin"}>
                    <img src={priceDivider} style={{alignContent: "center", maxWidth: 200}} />
                </div>
                <div>
                    <div>
                        <input className="modalLoginButton" type="email" name="email" value={emailValue} style={{padding:"10px 20px 10px 20px"}}
                               autoFocus  required placeholder="Email" onChange={handleEmailValueChange} />
                    </div>
                    <div>
                        <button disabled={!validEmail} className="modalLoginButton" style={{padding:"20px 30px 20px 30px", color:"#C94B32"}}
                                onClick={(e) => LoginViaEmail(e)} >
                            Continue with Email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Login />
        </div>
    );
};

export default LoginModal;