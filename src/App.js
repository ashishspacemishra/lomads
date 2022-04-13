import 'react-toastify/dist/ReactToastify.css';
import "react-sweet-progress/lib/style.css";
import './App.css';
import './Modal.css';
import './Dashboard.css';
import React, { Component }  from "react";
import { connectWallet } from "./utils/wallet.js";
// import { WEB3AUTH_NETWORK_TYPE } from "./config/web3AuthNetwork";
// import { CHAIN_CONFIG_TYPE } from "./config/chainConfig";
// import styles from "./styles/Home.module.css";
// import { Web3AuthProvider } from "./services/web3auth";
// import Setting from "./components/Setting";
// import Main from "./components/Main";
import Sidebar from "./Sidebar";
import Sidebar2 from "./Sidebar2";
import { ToastContainer, toast } from 'react-toastify';
import userLogo from "./assets/userLogo.svg";
import lomadsLogo from "./assets/lomadsLogo.svg";
import priceDivider from "./assets/priceDivider.svg";
import proposalImage from "./assets/proposalImage.svg";
import loginSuccess from "./assets/Group 178.svg";
import metamask from "./assets/Metamask.svg";
import daoMember1 from "./assets/daoMember1.svg";
import daoMember2 from "./assets/daoMember2.svg";
import daoMember3 from "./assets/daoMember3.svg";
import close from "./assets/Group 183.svg";
import daoImage from "./assets/Pulsing-DAO.svg";

import { Web3Auth } from "@web3auth/web3auth";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import Web3 from "web3";
import { Progress } from 'react-sweet-progress';
// import { Web3AuthCore } from "@web3auth/core";
// import { OpenloginAdapter }from "@web3auth/openlogin-adapter";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isUserLoggedIn: false,
      accountAddress: '',
      displayAddress: '',
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

    // const web3auth = new Web3AuthCore({
    //   chainConfig: { chainNamespace: CHAIN_NAMESPACES.EIP155 },
    // });
    //
    // const openloginAdapter = new OpenloginAdapter({
    //   adapterSettings: {
    //     clientId: "BJywQytxS6QAqZSwyDUmNQT490GiyjZNbCHOIggKPEHJXBkIQb2HS3RbV8pQsEcsJ9WySXFVi9MFwMG7T9v7Ux8",
    //     network: "testnet",
    //     uxMode: "redirect",
    //   },
    // });

    const subscribeAuthEvents = (web3auth) => {
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
        console.log("Yeah!, you are successfully logged in", data);
        // const provider = this.state.web3auth.provider;
        // this.setState({provider: provider})
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
      //   web3auth.configureAdapter(openloginAdapter);
      //   this.setState({web3auth: web3auth});
      //   await web3auth.initModal();
      // } catch (error) {
      //   console.log(error);
      // }

      await web3auth.initModal();
      this.setState({isLoading: false});
    };
    initializeModal();
  }

  loginWeb3auth = async (loginProvider) => {
    console.log("loginWeb3auth: ", this.state.web3auth);
    const provider = await this.getProvider();
    //const provider = await this.state.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, { loginProvider, login_hint: "" });

    console.log(provider);
    this.setState({provider: provider});
    // TODO: add this provider to web3/ethers
    const user = await this.getUserInfo();
    console.log(user);
    const accounts = await this.onGetAccounts();
    console.log(accounts);
    this.setState({
      accountAddress: accounts[0],
      displayAddress: this.getDisplayAddress(accounts[0]),
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
    if (this.state.web3auth === null) return;
    await this.state.web3auth.logout();
    this.setState({provider: null});
  };

  logoutUser = () => {
    this.setState({
      isUserLoggedIn: false,
      accountAddress: ''
    });
    this.logoutWeb3auth();
    console.log(this.state);
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

  getDisplayAddress = (address) => {
    if (address === null || address === "") {return "";}
    return (address.substring(0, 5) + "..." +
        address.substr(address.length - 3, 3)).toUpperCase();
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
      displayAddress: this.getDisplayAddress(walletResponse.address),
      status: walletResponse.status
    });
    this.addWalletListener();
    console.log(this.state);
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
            accountAddress: '',
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

  LoginModal = () => {
    return (
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
            <div className={"loginWithoutWallet"}>
              <a onClick={() => this.loginWeb3auth("google")}>login without crypto wallet </a>
            </div>
          </div>
        </div>
    );
  }

  LoginSuccessModal = () => {
    return (
        <div className="modalBackground">
          <div className="modalContainer">
            <div className="titleCloseBtn">
              <button onClick={this.onModalCloseClick}>
                <img src={close}/>
              </button>
            </div>
            <div className="title">
              <img src={loginSuccess}/>
              {/*<div className="welcome" style={{top:"70%", right:"5%"}}>*/}
              {/*  {this.state.accountAddress}*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
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

          {/* Login Modal */}
          <div>
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
                  </div>
                  <div className="welcomeText">
                    Welcome to
                  </div>
                  <div className="daoName">
                    Ethic comfort fashion group
                  </div>
                  <div className={"body"}>
                    <button className="metamaskLogin" onClick={this.connectMetamaskWallet} >
                      <img src={metamask}/>
                    </button>
                  </div>
                  <div className={"loginWithoutWallet"}>
                    <a onClick={() => this.loginWeb3auth("google")} style={{textDecorationLine:"underline"}}>login without crypto wallet </a>
                  </div>
                </div>
              </div>
            }
            { this.state.openLoginModal && this.state.isUserLoggedIn &&
              <div className="modalBackground">
                <div className="modalContainer">
                  <div className="titleCloseBtn">
                    <button onClick={this.onModalCloseClick}>
                      <img src={close}/>
                    </button>
                  </div>
                  <div className="title">
                    <img src={loginSuccess}/>
                  </div>
                </div>
              </div>
            }
          </div>

          <div disabled={this.state.openLoginModal}>
              <Sidebar2 />
          </div>

          {/* Proposals */}
          <div>
            {
              <div style={{paddingTop:150}}>
                <div className={"proposalBlock"}>
                  <div className={"proposalVotes"}>1 day left / 12 votes</div>
                  <div className={"proposalCreatedBy"}>made by:&nbsp;&nbsp;0xABC...MHg&nbsp;&nbsp;&nbsp;&nbsp;ID:&nbsp;&nbsp;0xABC...MHg</div>
                  <div className={"proposalName"}>
                    <img src={proposalImage} style={{}} id={"proposalImage"}/>
                    Project name iam nonummy nibh euismod?
                  </div>
                  <Progress percent={60} status="success" />
                  <div className={"proposalVotingAns"}>
                    YES 60%
                  </div>
                </div>

                <div className={"proposalBlock"}>
                  <div className={"proposalVotes"}>1 day left / 12 votes</div>
                  <div className={"proposalCreatedBy"}>made by:&nbsp;&nbsp;0xABC...MHg&nbsp;&nbsp;&nbsp;&nbsp;ID:&nbsp;&nbsp;0xABC...MHg</div>
                  <div className={"proposalName"}>
                    <img src={proposalImage} style={{}} id={"proposalImage"}/>
                    Project name iam nonummy nibh euismod?
                  </div>
                  <Progress percent={80} status={"success"} />
                  <div className={"proposalVotingAns"}>
                    YES 80%
                  </div>
                </div>

                <div className={"proposalBlock"}>
                  <div className={"proposalVotes"}>1 day left / 12 votes</div>
                  <div className={"proposalCreatedBy"}>made by:&nbsp;&nbsp;0xABC...MHg&nbsp;&nbsp;&nbsp;&nbsp;ID:&nbsp;&nbsp;0xABC...MHg</div>
                  <div className={"proposalName"}>
                    <img src={proposalImage} style={{}} id={"proposalImage"}/>
                    Project name iam nonummy nibh euismod?
                  </div>
                  <Progress percent={40} status={"error"}/>
                  <div className={"proposalVotingAns"} style={{color:"#d6482c"}}>
                    NO 40%
                  </div>
                </div>
              </div>
            }
          </div>

          {/* Price Block */}
          <div>
            { !this.state.openLoginModal &&
              <div>
                <div className={"priceDao"} style={{marginTop: 90}}>
                  <div id={"top"} style={{paddingTop: 20, paddingBottom: 20}}>
                    <div className={"priceDaoTop"} >$ 8.34</div>
                    <div className={"priceDaoBottom"} >token price</div>
                  </div>
                  <div id={"margin"}>
                    <img src={priceDivider} style={{alignContent: "center", maxWidth: 150}}></img>
                  </div>
                  <div id={"bottom"} style={{paddingTop: 15, paddingBottom: 20}}>
                    <div className={"priceDaoTop"} >$ 734</div>
                    <div className={"priceDaoBottom"} >total balance</div>
                  </div>
                </div>

                <div className={"topDaoMembers"} style={{marginTop: 90}}>
                  <div id={"top"} style={{paddingTop: 10}}>
                    <div className={"priceDaoBottom"} >Top Members</div>
                  </div>
                  <div style={{paddingTop: 5}}>
                    <div style={{paddingTop: 10, paddingLeft: 10, display:"flex"}}><img src={daoMember1}/><div style={{alignSelf:"center", paddingTop:10}}>0XABC...XYZ</div></div>
                    <div style={{paddingTop: 10, paddingLeft: 15, display:"flex"}}><img src={daoMember2}/><div style={{alignSelf:"center", paddingTop:10, paddingLeft:6}}>0XABC...XYZ</div></div>
                    <div style={{paddingTop: 10, paddingLeft: 15, display:"flex"}}><img src={daoMember3}/><div style={{alignSelf:"center", paddingTop:10, paddingLeft:6}}>0XABC...XYZ</div></div>
                    <div style={{paddingTop: 10, paddingLeft: 15, display:"flex"}}><img src={daoMember2}/><div style={{alignSelf:"center", paddingTop:10, paddingLeft:6}}>0XABC...XYZ</div></div>
                    <div style={{paddingTop: 10, paddingLeft: 15, display:"flex"}}><img src={daoMember3}/><div style={{alignSelf:"center", paddingTop:10, paddingLeft:6}}>0XABC...XYZ</div></div>
                  </div>
                </div>
              </div>
            }
          </div>

          {/* Login/Logout Bar */}
          <div>
            {/*<div className={"daoTagline"}>*/}
            {/*  Designing the future of clothing*/}
            {/*</div>*/}
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
                <div className={"accountInfo"}>
                  <img src={proposalImage} style={{}} id={"proposalImage"}/>
                  {this.state.displayAddress}
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
