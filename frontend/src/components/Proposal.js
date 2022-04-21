import React from "react";
import "react-sweet-progress/lib/style.css";
import { Progress } from "react-sweet-progress";
import "../styles/Dashboard.css";
import proposalImage from "../assets/proposalImage.svg";

const Proposal = () => {

    const ProposalBlock = ({percentage, pStatus, pAnswer, pAnswerStyle}) => {
        return (
            <div className={"proposalBlock"}>
                <div className={"proposalVotes"}>1 day left / 12 votes</div>
                <div className={"proposalCreatedBy"}>made by:&nbsp;&nbsp;0xABC...MHg&nbsp;&nbsp;&nbsp;&nbsp;ID:&nbsp;&nbsp;0xABC...MHg</div>
                <div className={"proposalName"}>
                    <img src={proposalImage} style={{}} id={"proposalImage"}/>
                    Project name iam nonummy nibh euismod?
                </div>
                <Progress percent={percentage} status={pStatus}/>
                <div className={"proposalVotingAns"} style={pAnswerStyle}>
                    {pAnswer}
                </div>
            </div>
        );
    }

    return (
        <div>
            <ProposalBlock percentage={60} pStatus={"success"} pAnswer={"YES 60%"}/>
            <ProposalBlock percentage={80} pStatus={"success"} pAnswer={"YES 80%"}/>
            <ProposalBlock percentage={40} pStatus={"error"} pAnswer={"NO 40%"} pAnswerStyle={{color:"#d6482c"}}/>
        </div>
    );
};

export default Proposal;