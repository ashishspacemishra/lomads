import React, { useState } from "react";

import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "../styles/Sidebar.css";
import daoImageShaped from "../assets/daoImageShaped.svg";
import collapseIcon from "../assets/collapseIcon.svg";
import expandIcon from "../assets/expandIcon.svg";
import proposalIcon from "../assets/proposalIcon.svg";
import updateIcon from "../assets/updateIcon.svg";
import treasuryIcon from "../assets/treasuryIcon.svg";
import membersIcon from "../assets/membersIcon.svg";
import chatIcon from "../assets/chatIcon.svg";
import lomadsLogo from "../assets/lomadsLogo.svg";
import lomadsLogoExpand from "../assets/lomadsLogoExpand.svg";
import polyMainnet from "../assets/polyMainnet.svg";
import linkedIn from "../assets/linkedIn.svg";
import twitter from "../assets/twitter.svg";
import instagram from "../assets/instagram.svg";
import  { useNavigate } from "react-router-dom";

const Sidebar = ({isMenuCollapsed, onMenuIconClick}) => {

    const [menuCollapse, setMenuCollapse] = useState(isMenuCollapsed);

    const menuIconClick = () => {
        setMenuCollapse(!menuCollapse);
        onMenuIconClick(!menuCollapse);
    };

    let navigate = useNavigate();

    const navigateFunc = (e, pageUrl) => {
        if (pageUrl !== undefined) {
            const abc = (window.location.href + pageUrl);
            console.log(abc);
            navigate(pageUrl);
        }
    }

    const Header = () => {
        return (
            <div className="closemenu" onClick={menuIconClick} style={{padding:5}}>
                {
                    menuCollapse ?
                        (
                            <div>
                                <img src={expandIcon} />
                            </div>
                        ) :
                        (
                            <div>
                                <img src={collapseIcon} />
                            </div>
                        )
                }
            </div>
        )
    }

    const Body = () => {
        return menuCollapse ? (<BodyCollapse />) : (<BodyExpand />);
    }

    const BodyCollapse = () => {
        return (
            <div>
                <div>
                    <img src={daoImageShaped} style={{maxHeight:100, maxWidth:100, paddingLeft:20, paddingTop:50, paddingBottom:150}}
                         onClick={(e) => navigateFunc(e, "/")}/>
                </div>
                <div  style={{paddingBottom:120}}>
                    <Menu>
                        <MenuItem>{getNavigationIcon(proposalIcon, "/proposals")}</MenuItem>
                        {/*<MenuItem>{getNavigationIcon(updateIcon, "/updates")}</MenuItem>*/}
                        <MenuItem>{getNavigationIcon(treasuryIcon, "/treasury")}</MenuItem>
                        <MenuItem>{getNavigationIcon(membersIcon, "/members")}</MenuItem>
                        <MenuItem>{getNavigationIcon(chatIcon, "/chat")}</MenuItem>
                    </Menu>
                </div>
            </div>
        );
    }

    const BodyExpand = () => {
        return (
            <div>
                <div>
                    <img src={daoImageShaped} style={{maxHeight:200, maxWidth:200, paddingLeft:100, paddingTop:30}}
                         onClick={(e) => navigateFunc(e, "/")}/>
                </div>
                <div className={"daoNameSidebar"}>
                    Ethic comfort fashion group
                </div>
                <div style={{paddingLeft:100, paddingBottom:100}}>
                    <Menu>
                        <MenuItem>{getNavigationItem(proposalIcon,"PROPOSALS", "/proposals")}</MenuItem>
                        <MenuItem>{getNavigationItem(treasuryIcon,"TREASURY", "/treasury")}</MenuItem>
                        {/*<MenuItem>{getNavigationItem(updateIcon,"UPDATES", "/updates")}</MenuItem>*/}
                        <MenuItem>{getNavigationItem(membersIcon,"MEMBERS", "/members")}</MenuItem>
                        <MenuItem>{getNavigationItem(chatIcon,"CHAT", "/chat")}</MenuItem>
                    </Menu>
                </div>
            </div>
        );
    }

    const getNavigationItem = (icon, text, pageUrl) => {
        return (
            <div className={"daoNavItem"} onClick={(e) => navigateFunc(e, pageUrl)}>
                <img src={icon} style={{paddingRight:20, width:25}} />
                {text}
            </div>
        );
    }

    const getNavigationIcon = (icon, pageUrl) => {
        return (
            <div style={{paddingBottom:10}} >
                <img src={icon} onClick={(e) => navigateFunc(e, pageUrl)} />
            </div>
        );
    }

    const Footer = () => {
        return menuCollapse ? (<FooterCollapse />) : (<FooterExpand />);
    }

    const FooterCollapse = () => {
        return (
            <div style={{padding:"20px 10px 305px 45px"}}>
                <img src={lomadsLogo} onClick={() => logoOnClick("https://lomads.xyz/")} />
            </div>
        );
    }

    const FooterExpand = () => {
        return (
            <div style={{paddingBottom:300}}>
                <div style={{display:"flex", paddingTop:15}}>
                    <div style={{display:"flex", paddingLeft:40}}>
                        <img src={polyMainnet}/>
                        <div className={"polyMainnet"}>
                            Polygon Mainnet
                        </div>
                    </div>
                    <div style={{display:"flex", paddingLeft:40}}>
                        <img src={linkedIn} onClick={() => logoOnClick("https://www.linkedin.com/company/lomads")} style={{paddingRight:10}}/>
                        <img src={twitter}  onClick={() => logoOnClick("https://mobile.twitter.com/lomads_co")} style={{paddingRight:10}}/>
                        <img src={instagram} onClick={() => logoOnClick("https://discord.gg/grbm7nk5")} style={{paddingRight:10}}/>
                    </div>
                </div>
                <div  style={{padding:"15px 10px 10px 60px"}}>
                    <img src={lomadsLogoExpand} onClick={() => logoOnClick("https://lomads.xyz/")} />
                </div>
            </div>
        );
    }

    const logoOnClick = (url) => {
        return (window.open(url, "_blank"));
    }

    return (
        <div id="sidebar">
            <ProSidebar collapsed={menuCollapse} width={520} collapsedWidth={134}>
                <SidebarHeader>
                    <Header />
                </SidebarHeader>
                <SidebarContent>
                    <Body />
                </SidebarContent>
                <SidebarFooter>
                    <Footer />
                </SidebarFooter>
            </ProSidebar>
        </div>
    );
};

export default Sidebar;