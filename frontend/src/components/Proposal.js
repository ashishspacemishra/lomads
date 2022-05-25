import React from "react";
import ProposalBlock from "./ProposalBlock";
import { useNewMoralisObject, useMoralisQuery } from "react-moralis";

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

    const { save } = useNewMoralisObject("Proposal");

    const saveProposal = async () => {
        const data = {
            daoId: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            proposalId: "0x82cf33235537cdcedc3bfeac64e0210a2bb1df185784f79af67c689328dbeb27",
            proposalName: "MintKudos Workstream S14 Budget Request",
            snapshotUrl: "https://snapshot.org/#/gitcoindao.eth/proposal/0x82cf33235537cdcedc3bfeac64e0210a2bb1df185784f79af67c689328dbeb27",
            active: true,
            createdBy: "0x72dd3451D585FB7B6f1Ea821b207a684E4190e79"
        };

        await save(data, {
            onSuccess: (proposal) => {
                console.log("New proposal created with objectId: " + proposal.id);
            },
            onError: (error) => {
                console.log("Failed to create new proposal, with error code: " + error.message);
            },
        });
    }

    const { fetch } = useMoralisQuery(
        "Proposal",
        (query) => query.equalTo("daoId", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"),
        [],
        { autoFetch: false }
    );

    const getProposal = async () => {
         await fetch({
            onSuccess: (result) => {
                console.log(result[0].attributes);
            },
            onError: (error) => {
                console.log("Failed to fetch proposal, with error code: " + error.message);
            },
        });
    };

    return (
        <div style={{paddingTop:120, paddingBottom:50}}>
            <div>
                <div style={{marginLeft: getLeftMargin(530), display:"flex"}}>
                    <div className={"page-header-text"}>
                        Proposals
                    </div>
                    { isUserLoggedIn &&
                    <button id="proposalCreate" className={"page-button"} onClick={getProposal}
                            style={{width:120, marginLeft:200}}>
                        CREATE
                    </button>
                    }
                </div>
            </div>
            <div style={{paddingTop:80, paddingBottom:50}}>
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
                <ProposalBlock percentage={80} pStatus={"success"} pAnswer={"YES"} daysLeft={5} noOfVotes={150}
                           pCreator={"0xTR7...ACm"} pId={"0xUYc...FTn"}
                           pName={"MintKudos Workstream S14 Budget Request"}
                />
            </div>
        </div>
    );
};

export default Proposal;