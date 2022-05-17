import React from "react";
import priceDivider from "../assets/priceDivider.svg";
import "../styles/Dashboard.css";

const DaoPriceInfo = () => {

    return (
        <div className={"priceDao"} style={{marginTop: 90}}>
            <div id={"top"} style={{paddingTop: 20, paddingBottom: 20}}>
                <div className={"priceDaoTop"} >$8.34</div>
                <div className={"priceDaoBottom"} >token price</div>
            </div>
            <div id={"margin"}>
                <img src={priceDivider} style={{alignContent: "center", maxWidth: 150}}></img>
            </div>
            <div id={"bottom"} style={{paddingTop: 15, paddingBottom: 20}}>
                <div className={"priceDaoTop"} >$734</div>
                <div className={"priceDaoBottom"} >total balance</div>
            </div>
        </div>
    );
};

export default DaoPriceInfo;