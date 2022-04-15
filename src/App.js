import "react-toastify/dist/ReactToastify.css";
import "react-sweet-progress/lib/style.css";
import "./App.css";
import "./Modal.css";
import "./Dashboard.css";
import React, { Component }  from "react";
import Sidebar2 from "./Sidebar2";
import { ToastContainer, toast } from "react-toastify";
import { Progress } from "react-sweet-progress";
import userLogo from "./assets/userLogo.svg";
import priceDivider from "./assets/priceDivider.svg";
import proposalImage from "./assets/proposalImage.svg";
import loginSuccess from "./assets/Group 178.svg";
import metamask2 from "./assets/metamask2.svg";
import daoMember1 from "./assets/daoMember1.svg";
import daoMember2 from "./assets/daoMember2.svg";
import daoMember3 from "./assets/daoMember3.svg";
import close from "./assets/Group 183.svg";
import daoImage from "./assets/Pulsing-DAO.svg";
import discordLogoLarge from "./assets/discordLogoLarge.svg";
import eventImage from "./assets/eventImage.svg";
import eventDate from "./assets/eventDate.svg";
import eventName from "./assets/eventName.svg";
import eventLocation from "./assets/eventLocation.svg";
import eventTime from "./assets/eventTime.svg";

import { connectWallet } from "./utils/wallet.js";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import Web3 from "web3";
import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter }from "@web3auth/openlogin-adapter";
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import { Container, Box, Tab } from '@mui/material';

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
      web3authOL: null,
      providerMM: null,
      providerOL: null,
      loginMethod: '',
      showMetamaskLoginOption: true,
      emailValue: '',
      validEmail: true,
      userData: null,
      isLoading: true
    }
  }

  async componentWillMount() {

    const polygonMainnet = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      rpcTarget: "https://polygon-rpc.com",
      blockExplorer: "https://polygonscan.com/",
      chainId: "0x89",
      displayName: "Polygon Mainnet",
      ticker: "matic",
      tickerName: "Matic",
    };

    const polygonMumbaiConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      rpcTarget: "https://rpc-mumbai.maticvigil.com",
      blockExplorer: "https://mumbai-explorer.matic.today",
      chainId: "0x13881",
      displayName: "Polygon Mumbai Testnet",
      ticker: "matic",
      tickerName: "matic",
    };

    const web3authOL = new Web3AuthCore({
      chainConfig:  polygonMainnet,
      clientId: "BJywQytxS6QAqZSwyDUmNQT490GiyjZNbCHOIggKPEHJXBkIQb2HS3RbV8pQsEcsJ9WySXFVi9MFwMG7T9v7Ux8",
    });

    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        clientId: "BJywQytxS6QAqZSwyDUmNQT490GiyjZNbCHOIggKPEHJXBkIQb2HS3RbV8pQsEcsJ9WySXFVi9MFwMG7T9v7Ux8",
        network: "mainnet",
        uxMode: "popup", //"redirect",
      },
    });

    const metamaskAdapter = new MetamaskAdapter(polygonMainnet);

    const subscribeAuthEventsOL = (web3authOL) => {
      web3authOL.on(ADAPTER_EVENTS.CONNECTED, (data) => {
        console.log("Yeah!, you are successfully logged in", data);
        // const provider = web3authOL.provider;
        // this.setState({providerOL: provider})
      });

      web3authOL.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });

      web3authOL.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
        this.setState({userData: null});
        this.state.web3authOL.logout();
      });

      web3authOL.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.log("some error or user have cancelled login request", error);
      });

      web3authOL.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
        console.log("modal visibility", isVisible);
      });
    };

    this.setState({
      web3authOL: web3authOL
    });

    // ⭐️ initialize modal on page mount.
    const initializeModal = async () => {
      console.log("initializeModal");
      subscribeAuthEventsOL(web3authOL);
      try {
        web3authOL.configureAdapter(metamaskAdapter);
        web3authOL.configureAdapter(openloginAdapter);
        await web3authOL.init();
        this.setState({
          web3authOL: web3authOL
        });
      } catch (error) {
        console.log(error);
      }
    };
    initializeModal();
  }

  handleEmailChange = (e) => {
    const email = e.target.value;
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    this.setState({emailValue: email});

    if (this.state.validEmail !== emailValid) {
      this.setState({validEmail: emailValid});
    }
  };

  LoginViaEmail = async (e) => {
    e.preventDefault();
    const email = this.state.emailValue;
    console.log(email);
    if (email !== null || email !== "") {
      await this.loginWeb3auth("email_passwordless", email);
    }
  }

  loginWeb3auth = async (loginProvider, loginHint="") => {
    console.log("loginWeb3authOL: ", this.state.web3authOL);
    let provider = null;
    if (loginProvider === "metamask") {
      if (this.state.providerMM === null) {
        // await this.state.web3authOL.logout();
        provider = await this.state.web3authOL.connectTo(WALLET_ADAPTERS.METAMASK, {
          loginProvider,
          login_hint: ""
        });
        this.addMetamaskEventListener();
        this.setState({
          providerMM: provider
        });
      }
    }
    else {
      if (this.state.providerOL === null || loginProvider === "email_passwordless") {
        // await this.state.web3authOL.logout();
        provider = await this.state.web3authOL.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider,
          login_hint: loginHint
        });
        this.setState({
          providerOL: provider
        });
      }
    }
    const user = await this.getUserInfo();
    console.log("userData:: ", user);
    const accounts = await this.onGetAccounts(loginProvider);
    console.log("accountData:: ", accounts);
    if (accounts !== null) {
      this.setState({
        accountAddress: accounts[0],
        displayAddress: this.getDisplayAddress(accounts[0]),
        isUserLoggedIn: true,
        loginMethod: loginProvider,
        openLoginModal: false,
        showMetamaskLoginOption: true,
        userData: user,
        isLoading: false
      });
    } else {
      this.setState({
        openLoginModal: false,
        showMetamaskLoginOption: true
      });
    }
  };

  getUserInfo = async () => {
    return await this.state.web3authOL?.getUserInfo();
  }

  onGetAccounts = async (loginProvider) => {
    let provider = null;
    if (loginProvider === "metamask") {
      provider = this.state.providerMM;
    } else {
      provider = this.state.providerOL;
    }
    if (provider === null) {
      console.log("provider not initialized yet");
      return null;
    }
    try {
      const web3 = new Web3(provider);
      return await web3.eth.getAccounts();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  logoutWeb3auth = async () => {
    this.setState({
      // providerMM: null,
      // providerOL: null,
      userData: null,
      loginMethod: ''
    });
    // await this.state.web3authOL.logout();
  };

  logoutUser = async () => {
    this.setState({
      isUserLoggedIn: false,
      accountAddress: '',
      displayAddress: '',
      status: '',
      showStatus: false
    });
    await this.logoutWeb3auth();
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
      openLoginModal: false,
      showMetamaskLoginOption: true
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
    this.addMetamaskEventListener();
    console.log(this.state);
  };

  addMetamaskEventListener = () => {
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


  render() {
    return (
      <Container maxWidth={'xl'}>
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
                  { this.state.showMetamaskLoginOption &&
                    <div className={"body"}>
                      {/*onClick={this.connectMetamaskWallet}*/}
                      <button className="modalLoginButton" onClick={() => this.loginWeb3auth("metamask")}>
                        <img src={metamask2} style={{padding:20}}/>
                      </button>
                      <div className={"loginWithoutWallet"}>
                      <a onClick={() => this.setState({showMetamaskLoginOption: false})}
                         style={{textDecorationLine: "underline"}}>login without crypto wallet </a>
                      </div>
                    </div>
                  }
                  { !this.state.showMetamaskLoginOption &&
                    <div className={"body"} style={{paddingTop:15}}>
                      {/*<img src={discordLogo} onClick={() => this.loginWeb3auth("discord")}/>*/}
                      <button className="modalLoginButton" onClick={() => this.loginWeb3auth("discord")}>
                        <img src={discordLogoLarge}  style={{padding:"0px 20px 0px 20px"}}/>
                      </button>
                      <div id={"margin"}>
                        <img src={priceDivider} style={{alignContent: "center", maxWidth: 200}} />
                      </div>
                      {/*<div id={"bottom"} style={{paddingTop: 15, paddingBottom: 20}}>*/}
                      {/*  <div className={"priceDaoBottom"} >Enter email address</div>*/}
                      {/*  <input type="text" name="name"/>*/}
                      {/*  <button onClick={() => this.loginWeb3auth("email_passwordless")} name={"Submit"}/>*/}
                      {/*</div>*/}
                      <div>
                        <div>
                          <input className="modalLoginButton" type="email" name="email" value={this.state.emailValue} style={{padding:"10px 20px 10px 20px"}}
                                 required placeholder="Email" onChange={(e) => this.handleEmailChange(e)} />
                        </div>
                        <div>
                          <button disabled={!this.state.validEmail} className="modalLoginButton" style={{padding:"20px 30px 20px 30px", color:"#C94B32"}}
                                  onClick={(e) => this.LoginViaEmail(e)} >
                            Continue with Email
                          </button>
                        </div>
                      </div>
                      {/*<form>*/}
                      {/*  <label>*/}
                      {/*    Name:*/}
                      {/*    */}
                      {/*  </label>*/}
                      {/*  <input type="submit" value="Submit" />*/}
                      {/*</form>*/}
                      {/*<button className="metamaskLogin" onClick={() => this.loginWeb3auth("email_passwordless")}>*/}
                      {/*  <img src={mailLogo} style={{maxWidth: 100, maxHeight: 55}}/>*/}
                      {/*</button>*/}
                    </div>
                  }
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

          {/* Sidebar */}
          <div disabled={this.state.openLoginModal}>
              <Sidebar2 />
          </div>

          {/* Proposals + Events */}
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
            {
              <div>
                <div className={"eventBlock"}>
                  <div className={"eventImage"}>
                    <img src={eventImage} style={{borderRadius:5, background: "#C4C4C4"}}/>
                  </div>
                  <div className={"eventDate"} >
                    <img src={eventDate} style={{paddingRight:8}}/>
                    02 March 2022
                  </div>
                  <div className={"eventName"} >
                    <img src={eventName} style={{paddingRight:8, alignSelf:"flex-start"}} />
                    <div >Update name onummy nibh euism </div>
                  </div>
                  <div className={"eventDate"}>
                    <div className={"eventLocation"} style={{width:"50%", float:"left", display:"flex"}}>
                      <img src={eventLocation} style={{paddingRight:8}} />
                       Online
                    </div>
                    <div className={"eventTime"} style={{width:"50%", float:"left", textAlign:"end"}}>
                      <img src={eventTime} style={{paddingRight:8}} />
                       11h30 - 12h30
                    </div>
                  </div>
                </div>

                <div className={"eventBlock"} style={{marginLeft:870}}>
                  <div className={"eventImage"}>
                    <img src={eventImage} style={{borderRadius:5, background: "#C4C4C4"}}/>
                  </div>
                  <div className={"eventDate"} >
                    <img src={eventDate} style={{paddingRight:8}}/>
                    02 March 2022
                  </div>
                  <div className={"eventName"} >
                    <img src={eventName} style={{paddingRight:8, alignSelf:"flex-start"}} />
                    <div >Update name onummy nibh euism </div>
                  </div>
                  <div className={"eventDate"}>
                    <div className={"eventLocation"} style={{width:"50%", float:"left", display:"flex"}}>
                      <img src={eventLocation} style={{paddingRight:8}} />
                      Online
                    </div>
                    <div className={"eventTime"} style={{width:"50%", float:"left", textAlign:"end"}}>
                      <img src={eventTime} style={{paddingRight:8}} />
                      11h30 - 12h30
                    </div>
                  </div>
                </div>

                <div className={"eventBlock"}  style={{marginLeft:1190}}>
                  <div className={"eventImage"}>
                    <img src={eventImage} style={{borderRadius:5, background: "#C4C4C4"}}/>
                  </div>
                  <div className={"eventDate"} >
                    <img src={eventDate} style={{paddingRight:8}}/>
                    02 March 2022
                  </div>
                  <div className={"eventName"} >
                    <img src={eventName} style={{paddingRight:8, alignSelf:"flex-start"}} />
                    <div >Update name onummy nibh euism </div>
                  </div>
                  <div className={"eventDate"}>
                    <div className={"eventLocation"} style={{width:"50%", float:"left", display:"flex"}}>
                      <img src={eventLocation} style={{paddingRight:8}} />
                      Online
                    </div>
                    <div className={"eventTime"} style={{width:"50%", float:"left", textAlign:"end"}}>
                      <img src={eventTime} style={{paddingRight:8}} />
                      11h30 - 12h30
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          {/* Price Block + Top Members */}
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
      </Container>
    );
  }
}

export default App;
