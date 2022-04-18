import React from "react";
import "../styles/Dashboard.css";
import eventImage from "../assets/eventImage.svg";
import eventDate from "../assets/eventDate.svg";
import eventName from "../assets/eventName.svg";
import eventLocation from "../assets/eventLocation.svg";
import eventTime from "../assets/eventTime.svg";

const Events = ({isSidebarCollapsed}) => {

    const getLeftMargin = (leftMargin) => {
        return isSidebarCollapsed ? (leftMargin - 100) : leftMargin;
    }

    const EventBlock = ({leftMargin}) => {
        return (
            <div className={"eventBlock"}  style={{marginLeft:leftMargin}}>
                <div className={"eventImage"}>
                    <img src={eventImage} style={{borderRadius:5, background: "#C4C4C4"}}/>
                </div>
                <div className={"eventDate"} >
                    <img src={eventDate} style={{paddingRight:8}}/>
                    02 March 2022
                </div>
                <div className={"eventName"} >
                    <img src={eventName} style={{paddingRight:8, alignSelf:"flex-start"}} />
                    <div >Update name onummy nibh euism </div>
                </div>
                <div className={"eventDate"}>
                    <div className={"eventLocation"} style={{width:"50%", float:"left", display:"flex"}}>
                        <img src={eventLocation} style={{paddingRight:8}} />
                        Online
                    </div>
                    <div className={"eventTime"} style={{width:"50%", float:"left", textAlign:"end"}}>
                        <img src={eventTime} style={{paddingRight:8}} />
                        11h30 - 12h30
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <EventBlock leftMargin={getLeftMargin(550)}/>
            <EventBlock leftMargin={getLeftMargin(870)}/>
            <EventBlock leftMargin={getLeftMargin(1190)}/>
        </div>
    );
};

export default Events;