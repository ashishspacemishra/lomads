import './App.css';
import React, { Component }  from "react";
import { connectWallet } from "./utils/wallet.js";

import Sidebar from "./Sidebar";
//import Modal from "react-modal";
//import Modal from 'react-bootstrap/Modal';
import {Button} from "react-bootstrap";
import Popup from 'reactjs-popup';
import ReactModal from 'react-modal';
import Modal from "./Modal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userLogo from "./assets/userLogo.svg";
import loginSuccess from "./assets/Group 178.svg";
import metamask from "./assets/Metamask.svg";
import close from "./assets/Group 183.svg";
import daoImage from "./assets/Pulsing-DAO.svg";


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isUserLoggedIn: false,
      accountAddress: '',
      status: '',
      openLoginModal: false,
      showStatus: false
    }
  }

  async componentWillMount() {
  }

  logoutUser = () => {
    this.setState({
      isUserLoggedIn: false,
      accountAddress: ''
    });
  }

  notifyUser = (msg) => toast.error(msg);

  onLoginButtonClick = () => {
    this.setState({
      openLoginModal: true
    });
  }

  onModalCloseClick = () => {
    this.setState({
      openLoginModal: false
    });
  }

  connectMetamaskWallet = async () => {
    const walletResponse = await connectWallet();
    console.log(walletResponse);
    if (!walletResponse.isUserLoggedIn) {
      this.notifyUser(walletResponse.status);
    }
    this.setState({
      isUserLoggedIn: walletResponse.isUserLoggedIn,
      accountAddress: walletResponse.address,
      status: walletResponse.status
    });
    this.addWalletListener();
  };

  addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          this.setState({
            accountAddress: accounts[0],
            status: "👆🏽 Logged into Metamask account.",
            isUserLoggedIn: true
          });
        } else {
          this.setState({
            accountAddress: '0x0',
            status: "🦊 Connect to Metamask using the top right button.",
            isUserLoggedIn: false
          });
        }
      });
      window.ethereum.on('chainChanged', (chainId) => {
        //window.location.reload();
        console.log(chainId);
        this.setState({
          showStatus: true,
          status: "User logged out as selected Network is not Polygon."
        });
        this.logoutUser();
      });
    }
  }


  render() {
    return (

        <div className="App">
          <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
          </div>
          { this.state.openLoginModal && !this.state.isUserLoggedIn &&
            <div className="modalBackground">
              <div className="modalContainer">
                <div className="titleCloseBtn">
                  <button onClick={this.onModalCloseClick}>
                    <img src={close}/>
                  </button>
                </div>
                <div className="title">
                  <img src={daoImage}/>
                  <div className="welcome">
                    Welcome to
                  </div>
                  <div className="daoName">
                    Ethic comfort fashion group
                  </div>
                </div>
                <div className="body">
                  <button className="metamaskLogin" onClick={this.connectMetamaskWallet} >
                    <img src={metamask}/>
                  </button>
                </div>

                <div>
                  <a onClick={this.connectMetamaskWallet} style={{textDecorationLine:"underline"}}>login without crypto wallet </a>
                </div>
              </div>
            </div>
          }
          {
            this.state.openLoginModal && this.state.isUserLoggedIn &&
            <div className="modalBackground">
              <div className="modalContainer">
                <div className="titleCloseBtn">
                  <button onClick={this.onModalCloseClick}>
                    <img src={close}/>
                  </button>
                </div>
                <div className="title">
                  <img src={loginSuccess}/>
                  <div className="welcome" style={{top:"70%", right:"5%"}}>
                    {this.state.accountAddress}
                  </div>
                </div>
              </div>
            </div>
          }
          <div>
          {/*<Sidebar/>*/}

          { !this.state.isUserLoggedIn && !this.state.openLoginModal &&
            <div>
              <button id="login" className="App-login" onClick={this.onLoginButtonClick}>
                <img src={userLogo} alt="Logo" />
              </button>
              { this.state.showStatus &&
                <div style={{paddingTop: 30, paddingLeft: 550}}>{this.state.status}</div>
              }
            </div>
          }
          { this.state.isUserLoggedIn && !this.state.openLoginModal &&
            <div>
              <div style={{paddingTop:28, paddingLeft:550}}>
                {this.state.accountAddress}
              </div>
              <button id="logout" className="App-logout" onClick={this.logoutUser}>
                LOGOUT
              </button>
            </div>
          }
          </div>
        </div>
    );
  }
}

export default App;
