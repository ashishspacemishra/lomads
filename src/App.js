import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";
import "./styles/Modal.css";
import "./styles/style.scss";
import React, { Component }  from "react";
import { ToastContainer, toast } from "react-toastify";
import Sidebar2 from "./components/Sidebar2";
import Proposal from "./components/Proposal";
import DaoPriceInfo from "./components/DaoPriceInfo";
import TopDaoMembers from "./components/TopDaoMembers";
import Events from "./components/Events";
import LoginModal from "./components/LoginModal";
import userLogo from "./assets/userLogo.svg";
import proposalImage from "./assets/proposalImage.svg";

import { connectWallet } from "./utils/wallet.js";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import Web3 from "web3";
import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter }from "@web3auth/openlogin-adapter";
import { MetamaskAdapter } from '@web3auth/metamask-adapter';

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
      isLoading: true,
      isMenuCollapsed: false
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

    // const polygonMumbaiConfig = {
    //   chainNamespace: CHAIN_NAMESPACES.EIP155,
    //   rpcTarget: "https://rpc-mumbai.maticvigil.com",
    //   blockExplorer: "https://mumbai-explorer.matic.today",
    //   chainId: "0x13881",
    //   displayName: "Polygon Mumbai Testnet",
    //   ticker: "matic",
    //   tickerName: "matic",
    // };

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
        // try {
        //   web3authOL.logout();
        // } catch (e) {
        //   console.log(e);
        // }
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

  LoginViaEmail = async (e, emailValue2) => {
    e.preventDefault();
    const emailValue = this.state.emailValue;
    console.log(emailValue);
    if (emailValue !== null || emailValue !== "") {
      await this.loginWeb3auth("email_passwordless", emailValue);
    }
  }

  loginWeb3auth = async (loginProvider, loginHint="") => {
    console.log("loginWeb3authOL: ", this.state.web3authOL);
    let provider = null;
    if (loginProvider === "metamask") {
      if (this.state.providerMM === null) {
        try {
          await this.state.web3authOL.logout();
        } catch (e) {
          console.log(e);
        } finally {
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
    }
    else {
      if (this.state.providerOL === null || loginProvider === "email_passwordless") {
        try {
          await this.state.web3authOL.logout();
        } catch (e) {
          console.log(e);
        } finally {
          provider = await this.state.web3authOL.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider,
            login_hint: loginHint
          });
          this.setState({
            providerOL: provider
          });
        }
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
    try {
      return await this.state.web3authOL?.getUserInfo();
    } catch (e) {
      console.log(e);
      return null;
    }
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

  loginWithoutWalletOnClick = () => {
    this.setState({
      showMetamaskLoginOption: false
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

  onMenuCollapse = (value) => {
    console.log(value);
    this.setState({isMenuCollapsed: value})
  }

  render() {
    return (
      // <Container maxWidth={'xl'}>
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
            { this.state.openLoginModal &&
              <LoginModal isUserLoggedIn={this.state.isUserLoggedIn} showMetamaskLoginOption={this.state.showMetamaskLoginOption}
                          onModalCloseClick={this.onModalCloseClick} loginWeb3auth={this.loginWeb3auth}
                          loginWithoutWalletOnClick={this.loginWithoutWalletOnClick} LoginViaEmailOnClick={this.LoginViaEmail} />
            }
          </div>

          {/* Sidebar */}
          <div disabled={this.state.openLoginModal}>
              <Sidebar2 onMenuIconClick={this.onMenuCollapse} isMenuCollapsed={this.state.isMenuCollapsed}/>
          </div>

          {/* Proposals + Events */}
          <div>
            <div style={{paddingTop:150}}>
              <Proposal />
            </div>
            <Events isSidebarCollapsed={this.state.isMenuCollapsed} />
          </div>

          {/* Price Block + Top Members */}
          <div>
            { !this.state.openLoginModal &&
              <div>
                <DaoPriceInfo />
                <TopDaoMembers />
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
      // </Container>
    );
  }
}

export default App;
