import React from "react";
import "react-sweet-progress/lib/style.css";
import { Progress } from "react-sweet-progress";
import "../styles/Dashboard.css";
import proposalImage from "../assets/proposalImage.svg";


const ProposalBlock = ({percentage, pStatus = "success", pAnswer, pAnswerStyle, daysLeft = 1, noOfVotes = 0, pCreator, pId, pName}) => {
        return (
            <div className={"proposalBlock"}>
                <div className={"proposalVotes"}>{daysLeft} day left / {noOfVotes} votes</div>
                <div className={"proposalCreatedBy"}>made by:&nbsp;&nbsp;{pCreator}&nbsp;&nbsp;&nbsp;&nbsp;ID:&nbsp;&nbsp;{pId}</div>
                <div className={"proposalName"}>
                    <img src={proposalImage} style={{}} id={"proposalImage"}/>
                    {pName}
                </div>
                <Progress percent={percentage} status={pStatus}/>
                <div className={"proposalVotingAns"} style={pAnswerStyle}>
                    { pAnswer + " " + percentage + "%"}
                </div>
            </div>
        );
};

export default ProposalBlock;