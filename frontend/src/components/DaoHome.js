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
                    <ProposalBlock percentage={60} pStatus={"success"} pAnswer={"YES"} daysLeft={1} noOfVotes={12}
                                   pCreator={"0xABC...MHg"} pId={"0xABC...MHg"}
                                   pName={"Project name iam nonummy nibh euismod?"}
                    />
                    <ProposalBlock percentage={80} pStatus={"success"} pAnswer={"YES"} daysLeft={1} noOfVotes={12}
                                   pCreator={"0xABC...MHg"} pId={"0xABC...MHg"}
                                   pName={"Project name iam nonummy nibh euismod?"}
                    />
                    <ProposalBlock percentage={40} pStatus={"error"} pAnswer={"NO"} pAnswerStyle={{color:"#d6482c"}}
                                   daysLeft={1} noOfVotes={12} pCreator={"0xABC...MHg"} pId={"0xABC...MHg"}
                                   pName={"Project name iam nonummy nibh euismod?"}
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