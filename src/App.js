import './App.css';
import './Modal.css';
import React, { Component }  from "react";
import { connectWallet } from "./utils/wallet.js";
// import { WEB3AUTH_NETWORK_TYPE } from "./config/web3AuthNetwork";
// import { CHAIN_CONFIG_TYPE } from "./config/chainConfig";
// import styles from "./styles/Home.module.css";
// import { Web3AuthProvider } from "./services/web3auth";
// import Setting from "./components/Setting";
// import Main from "./components/Main";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userLogo from "./assets/userLogo.svg";
import lomadsLogo from "./assets/lomadsLogo.svg";
import loginSuccess from "./assets/Group 178.svg";
import metamask from "./assets/Metamask.svg";
import close from "./assets/Group 183.svg";
import daoImage from "./assets/Pulsing-DAO.svg";

import { Web3Auth } from "@web3auth/web3auth";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import Web3 from "web3";
import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isUserLoggedIn: false,
      accountAddress: '',
      status: '',
      openLoginModal: false,
      showStatus: false,
      web3auth: null,
      provider: null,
      userData: null,
      isLoading: true
    }
  }

  async componentWillMount() {
    console.log("componentWillMount");

    const polygonMumbaiConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      rpcTarget: "https://rpc-mumbai.maticvigil.com",
      blockExplorer: "https://mumbai-explorer.matic.today",
      chainId: "0x13881",
      displayName: "Polygon Mumbai Testnet",
      ticker: "matic",
      tickerName: "matic",
    };
    const web3auth = new Web3Auth({
      chainConfig:  polygonMumbaiConfig,
      // clientId: "BKPxkCtfC9gZ5dj-eg-W6yb5Xfr3XkxHuGZl2o2Bn8gKQ7UYike9Dh6c-_LaXlUN77x0cBoPwcSx-IVm0llVsLA",
      clientId: "BJywQytxS6QAqZSwyDUmNQT490GiyjZNbCHOIggKPEHJXBkIQb2HS3RbV8pQsEcsJ9WySXFVi9MFwMG7T9v7Ux8",
      uiConfig: {
        appLogo: {lomadsLogo},
        loginMethodsOrder: ["discord"],
        theme: "light"
      }
    });

    const web3AuthInstance = new Web3AuthCore({
      chainConfig: { chainNamespace: CHAIN_NAMESPACES.EIP155 },
    });

    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        clientId: "BJywQytxS6QAqZSwyDUmNQT490GiyjZNbCHOIggKPEHJXBkIQb2HS3RbV8pQsEcsJ9WySXFVi9MFwMG7T9v7Ux8",
        network: "testnet",
        uxMode: "redirect",
      },
    });

    const subscribeAuthEvents = (web3auth) => {
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
        console.log("Yeah!, you are successfully logged in", data);
        this.setState({provider: this.state.web3auth.provider})
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
        web3auth.logout();
        this.setState({userData: null});
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.log("some error or user have cancelled login request", error);
      });

      web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
        console.log("modal visibility", isVisible);
      });
    };

    this.setState({web3auth: web3auth});

    // ⭐️ initialize modal on page mount.
    const initializeModal = async () => {
      console.log("initializeModal");
      subscribeAuthEvents(web3auth);

      // try {
      //   web3AuthInstance.configureAdapter(openloginAdapter);
      //   this.setState({web3auth: web3AuthInstance});
      //   await web3AuthInstance.initModal();
      // } catch (error) {
      //   console.log(error);
      // }

      await web3auth.initModal();
      this.setState({isLoading: false});
    };
    initializeModal();
  }

  loginWeb3auth = async () => {
    console.log("loginWeb3auth: ", this.state.web3auth);


    const provider = await this.getProvider();

    console.log(provider);
    this.setState({provider: provider});
    // TODO: add this provider to web3/ethers
    const user = await this.getUserInfo();
    console.log(user);
    const accounts = await this.onGetAccounts();
    console.log(accounts);
    this.setState({
      accountAddress: accounts[0],
      isUserLoggedIn: true,
      openLoginModal: false,
      userData: user,
      isLoading: false
    });
  };

  getProvider = async () => {
    console.log(this.state.web3auth);
    return this.state.web3auth.connect();
  }

  getUserInfo = async () => {
    return this.state.web3auth.getUserInfo();
  }

  onGetAccounts = async () => {
    if (this.state.provider === null) {
      console.log("provider not initialized yet");
      return;
    }
    try {
      const web3 = new Web3(this.state.provider);
      const accounts = await web3.eth.getAccounts();
      console.log("acc:: ", accounts);
      return accounts;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  logoutWeb3auth = async () => {
    console.log("logoutWeb3auth");
    //if (!this.state.web3auth) return;
    await this.state.web3auth.logout();
    this.setState({provider: null});
  };

  logoutUser = () => {
    this.logoutWeb3auth();
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

  web3onClick = () => {
    return (
        <div></div>
    );
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
                  <a onClick={this.loginWeb3auth} style={{textDecorationLine:"underline"}}>login without crypto wallet </a>
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
