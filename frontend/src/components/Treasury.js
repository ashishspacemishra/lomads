import React from "react";
import "react-sweet-progress/lib/style.css";
import "../styles/Dashboard.css";
import review from "../assets/review.svg";
import recentTxn from "../assets/recentTxn.svg";
import assets from "../assets/assets.svg";
import priceDivider from "../assets/priceDivider.svg";

const Treasury = ({isUserLoggedIn, isSidebarCollapsed, onBuyTokenButtonClick}) => {

    const getLeftMargin = (leftMargin) => {
        return isSidebarCollapsed ? (leftMargin - 100) : leftMargin;
    }

    const TreasuryInfo = () => {
        return (
            <div className={"priceDao"} style={{marginTop: 160, height:340}}>
                <div id={"top"} style={{paddingTop: 25, paddingBottom: 25}}>
                    <div className={"priceDaoTop"} >$8.34</div>
                    <div className={"priceDaoBottom"} >token price</div>
                </div>
                <div id={"margin"}>
                    <img src={priceDivider} style={{alignContent: "center", maxWidth: 150}}></img>
                </div>
                <div id={"bottom"} style={{paddingTop: 20, paddingBottom: 25}}>
                    <div className={"priceDaoTop"} >$734</div>
                    <div className={"priceDaoBottom"} >total balance</div>
                </div>
                <div id={"margin"}>
                    <img src={priceDivider} style={{alignContent: "center", maxWidth: 150}}></img>
                </div>
                <div id={"moreInfo"} style={{paddingTop: 20, paddingBottom: 25}}>
                    <div className={"priceDaoTop"} style={{color:"#188C7C"}}>+ $734</div>
                    <div className={"priceDaoBottom"} >Last 30 days</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{paddingTop:120, paddingBottom:50}}>
            <TreasuryInfo />
            <div style={{marginLeft: getLeftMargin(530), display:"flex"}}>
                <div className={"page-header-text"}>
                    Treasury
                </div>
                { isUserLoggedIn &&
                <button id="buyToken" className={"page-button"} onClick={onBuyTokenButtonClick}
                        style={{width:140, marginLeft:250}}>
                    BUY TOKEN
                </button>
                }
            </div>
            <div style={{marginLeft: getLeftMargin(470)}}>
                <div>
                    <div className={"treasury-text"} style={{marginLeft:-20}}>Review</div>
                    <div style={{display:"flex", alignContent:"flex-start", marginLeft:60}}>
                        <img src={review}/>
                    </div>
                </div>
                <div style={{paddingTop:30, display:"flex"}}>
                    <div>
                    <div className={"treasury-text"} style={{marginLeft:-30}}>Assets</div>
                    <div style={{display:"flex", alignContent:"flex-start", marginLeft:60}}>
                        <img src={assets}/>
                    </div>
                    </div>

                    <div>
                        <div className={"treasury-text"} style={{marginLeft:40}}>Recent transactions</div>
                        <div style={{display:"flex", alignContent:"flex-start", marginLeft:40}}>
                            <img src={recentTxn}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Treasury;