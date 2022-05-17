import React from "react";
import ProposalBlock from "./ProposalBlock";
import proposalData from "../data/proposal.json";

const Proposal = ({isUserLoggedIn, onMenuCollapse, isSidebarCollapsed}) => {

    const getLeftMargin = (leftMargin) => {
        console.log(isSidebarCollapsed);
        return isSidebarCollapsed ? (leftMargin - 80) : leftMargin;
    }

    // const getProposals = () => {
    //     console.log(proposalData[0]);
    //     let blocks = <ProposalBlock />;
    //     return (
    //         <div>
    //             {blocks}
    //         </div>
    //     );
    // }

    return (
        <div style={{paddingTop:120, paddingBottom:50}}>
            <div>
                <div style={{marginLeft: getLeftMargin(530), display:"flex"}}>
                    <div className={"page-header-text"}>
                        Proposals
                    </div>
                    { isUserLoggedIn &&
                    <button id="proposalCreate" className={"page-button"} onClick={console.log("create proposal")}
                            style={{width:120, marginLeft:200}}>
                        CREATE
                    </button>
                    }
                </div>
            </div>
            <div style={{paddingTop:80, paddingBottom:50}}>
                <ProposalBlock percentage={60} pStatus={"success"} pAnswer={"YES"} daysLeft={1} noOfVotes={100}
                           pCreator={"0xABC...MHg"} pId={"0xABC...MHg"}
                           pName={proposalData[0].proposalName}
                />
                <ProposalBlock percentage={80} pStatus={"success"} pAnswer={"YES"} daysLeft={4} noOfVotes={60}
                           pCreator={"0xABC...MHg"} pId={"0xABC...MHg"}
                           pName={proposalData[1].proposalName}
                />
                <ProposalBlock percentage={40} pStatus={"error"} pAnswer={"NO"} pAnswerStyle={{color:"#d6482c"}}
                           daysLeft={2} noOfVotes={120} pCreator={"0xABC...MHg"} pId={"0xABC...MHg"}
                           pName={proposalData[2].proposalName}
                />
                <ProposalBlock percentage={80} pStatus={"success"} pAnswer={"YES"} daysLeft={5} noOfVotes={150}
                           pCreator={"0xABC...MHg"} pId={"0xABC...MHg"}
                           pName={proposalData[3].proposalName}
                />
            </div>
        </div>
    );
};

export default Proposal;