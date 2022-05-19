import React from "react";
import "../styles/Dashboard.css";
import eventImageIcon from "../assets/eventImage.svg";
import eventDateIcon from "../assets/eventDate.svg";
import eventNameIcon from "../assets/eventName.svg";
import eventLocationIcon from "../assets/eventLocation.svg";
import eventTimeIcon from "../assets/eventTime.svg";

const Events = ({isSidebarCollapsed}) => {

    const getLeftMargin = (leftMargin) => {
        return isSidebarCollapsed ? (leftMargin - 100) : leftMargin;
    }

    const EventBlock = ({leftMargin, eventDate, eventName, eventLocation, eventTime}) => {
        return (
            <div className={"eventBlock"}  style={{marginLeft:leftMargin}}>
                <div className={"eventImage"}>
                    <img src={eventImageIcon} style={{borderRadius:5, background: "#C4C4C4"}}/>
                </div>
                <div className={"eventDate"} >
                    <img src={eventDateIcon} style={{paddingRight:8}}/>
                    {eventDate}
                </div>
                <div className={"eventName"} >
                    <img src={eventNameIcon} style={{paddingRight:8, alignSelf:"flex-start"}} />
                    <div>{eventName} </div>
                </div>
                <div className={"eventDate"}>
                    <div className={"eventLocation"} style={{width:"50%", float:"left", display:"flex"}}>
                        <img src={eventLocationIcon} style={{paddingRight:8}} />
                        {eventLocation}
                    </div>
                    <div className={"eventTime"} style={{width:"50%", float:"left", textAlign:"end"}}>
                        <img src={eventTimeIcon} style={{paddingRight:8}} />
                        {eventTime}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <EventBlock leftMargin={getLeftMargin(550)} eventDate={"20 May 2022"} eventLocation={"Online"}
                        eventTime={"11h30 - 12h30"} eventName={"Community call - Future of DAOs"} />
            <EventBlock leftMargin={getLeftMargin(870)} eventDate={"30 May 2022"} eventLocation={"Online"}
                        eventTime={"10h - 12h"} eventName={"Discussion on decentralized economy"} />
            <EventBlock leftMargin={getLeftMargin(1190)} eventDate={"10 June 2022"} eventLocation={"Online"}
                        eventTime={"18h30 - 20h30"} eventName={"DAO Tools - Intro to DAO building resources"} />
        </div>
    );
};

export default Events;