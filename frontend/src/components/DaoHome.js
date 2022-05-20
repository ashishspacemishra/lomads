import React from "react";
import "../styles/Dashboard.css";
import ProposalBlock from "./ProposalBlock";
import Events from "./Events";
import TopDaoMembers from "./TopDaoMembers";
import DaoPriceInfo from "./DaoPriceInfo";

const DaoHome = ({isSidebarCollapsed, openLoginModal}) => {

    return (
        <div>
            {/* Proposals + Events */}
            <div>
                <div style={{paddingTop:150}}>
                    <ProposalBlock percentage={60} pStatus={"success"} pAnswer={"YES"} daysLeft={1} noOfVotes={100}
                                   pCreator={"0xCSv...MHg"} pId={"0xSDj...OY9"}
                                   pName={"Balancer Liquidity Mining Program"}
                    />
                    <ProposalBlock percentage={80} pStatus={"success"} pAnswer={"YES"} daysLeft={4} noOfVotes={60}
                                   pCreator={"0xPZk...HDl"} pId={"0xJFo...PKq"}
                                   pName={"Feedback for FDD Budget Proposal"}
                    />
                    <ProposalBlock percentage={40} pStatus={"error"} pAnswer={"NO"} pAnswerStyle={{color:"#d6482c"}}
                                   daysLeft={2} noOfVotes={120} pCreator={"0xCSv...MHg"} pId={"0xSBz...ICd"}
                                   pName={"Partnership & Mutual Grant with Wonder"}
                    />
                </div>
                <Events isSidebarCollapsed={isSidebarCollapsed} />
            </div>

            {/* Price Block + Top Members */}
            <div>
                { !openLoginModal &&
                <div>
                    <DaoPriceInfo />
                    <TopDaoMembers />
                </div>
                }
            </div>
        </div>
    );
};

export default DaoHome;