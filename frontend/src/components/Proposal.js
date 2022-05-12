import React from "react";
import ProposalBlock from "./ProposalBlock";

const Proposal = ({isUserLoggedIn, onMenuCollapse, isMenuCollapsed}) => {

    return (
        <div>
            { isUserLoggedIn &&
                <button id="proposalCreate" className="Proposal-create" onClick={console.log("abc")}>
                    CREATE
                </button>
            }
            <div style={{paddingTop:150, paddingBottom:50}}>
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
                <ProposalBlock percentage={80} pStatus={"success"} pAnswer={"YES"} daysLeft={1} noOfVotes={12}
                           pCreator={"0xABC...MHg"} pId={"0xABC...MHg"}
                           pName={"Project name iam nonummy nibh euismod?"}
                />
                <ProposalBlock percentage={40} pStatus={"error"} pAnswer={"NO"} pAnswerStyle={{color:"#d6482c"}}
                           daysLeft={1} noOfVotes={12} pCreator={"0xABC...MHg"} pId={"0xABC...MHg"}
                           pName={"Project name iam nonummy nibh euismod?"}
                />
            </div>
        </div>
    );
};

export default Proposal;