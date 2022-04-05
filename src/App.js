import './App.css';
import React, { Component }  from "react";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { connectWallet } from "./utils/wallet.js";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isUserLoggedIn: false,
      accountAddress: '0x0',
      status: '',
      isLoading: true
    }
  }

  async componentWillMount() {
  }

  logoutUser = () => {
    this.setState({
      isUserLoggedIn: false,
      accountAddress: '0x0',
      status: '',
      isLoading: false
    });
  }

  connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    console.log(walletResponse);
    this.setState({
      isUserLoggedIn: walletResponse.isUserLoggedIn,
      accountAddress: walletResponse.address,
      status: walletResponse.status,
      isLoading: false
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
    } else {
      this.setState({
        accountAddress: '0x0',
        isUserLoggedIn: false,
        status:
            (<p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>)
        });
    }
  }

  render() {
    return (

        <div className="App">
          <SideNav  //className="SideNav-style"
              onSelect={
                (
                    selected
                ) => {
                  // Add your code here
                }
              }
              //expanded={true}
          >
            <SideNav.Toggle/>
            <SideNav.Nav defaultSelected="home">
              <NavItem eventKey="home">
                <NavIcon>
                  <i className="fa fa-fw fa-home" style={{fontSize: '1.75em'}}/>
                </NavIcon>
                <NavText>
                  Home
                </NavText>
              </NavItem>
              <NavItem eventKey="charts">
                <NavIcon>
                  <i className="fa fa-fw fa-line-chart" style={{fontSize: '1.75em'}}/>
                </NavIcon>
                <NavText>
                  Charts
                </NavText>
                <NavItem eventKey="charts/linechart">
                  <NavText>
                    Line Chart
                  </NavText>
                </NavItem>
                <NavItem eventKey="charts/barchart">
                  <NavText>
                    Bar Chart
                  </NavText>
                </NavItem>
              </NavItem>
            </SideNav.Nav>
          </SideNav>
          {this.state.accountAddress}
          { this.state.isUserLoggedIn &&
            <Button id="logout" className="App-login" onClick={this.logoutUser}>LOGOUT</Button>
          }
          { !this.state.isUserLoggedIn &&
            <button id="login" className="App-login" onClick={this.connectWalletPressed}>LOGIN</button>
          }
          {this.state.status}
        </div>
    );
  }
}

export default App;
