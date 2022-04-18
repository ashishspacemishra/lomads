import React from "react";
import daoMember1 from "../assets/daoMember1.svg";
import daoMember2 from "../assets/daoMember2.svg";
import daoMember3 from "../assets/daoMember3.svg";
import "../styles/Dashboard.css";

const TopDaoMembers = () => {
    return (
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
    );
};

export default TopDaoMembers;