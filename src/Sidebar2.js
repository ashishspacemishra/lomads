import React, { useState } from "react";

import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./Sidebar2.css";
import daoImageShaped from "./assets/daoImageShaped.svg";
import collapseIcon from "./assets/collapseIcon.svg";
import expandIcon from "./assets/expandIcon.svg";
import proposalIcon from "./assets/proposalIcon.svg";
import updateIcon from "./assets/updateIcon.svg";
import treasuryIcon from "./assets/treasuryIcon.svg";
import membersIcon from "./assets/membersIcon.svg";
import chatIcon from "./assets/chatIcon.svg";
import lomadsLogo from "./assets/lomadsLogo.svg";
import lomadsLogoExpand from "./assets/lomadsLogoExpand.svg";
import polyMainnet from "./assets/polyMainnet.svg";
import linkedIn from "./assets/linkedIn.svg";
import twitter from "./assets/twitter.svg";
import instagram from "./assets/instagram.svg";

const Sidebar2 = () => {

    const [menuCollapse, setMenuCollapse] = useState(false)
    const menuIconClick = () => {
        menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    };

    const getNavigationItem = (icon, text) => {
        return (
            <div className={"daoNavItem"}>
                <img src={icon} style={{paddingRight:20, width:25}}/>
                {text}
            </div>
        );
    }

    const getNavigationIcon = (icon) => {
        return (
            <div>
                <img src={icon} />
            </div>
        );
    }

    const logoOnClick = (url) => {
        return (window.open(url, "_blank"));
    }

    return (
        <div id="sidebar">
            <ProSidebar collapsed={menuCollapse} width={434} collapsedWidth={134}> {/* width={434} collapsedWidth={134}*/}
                <SidebarHeader>
                    <div className="closemenu" onClick={menuIconClick} style={{padding:5}}>
                        { menuCollapse ?
                            (
                                <div>
                                    <img src={expandIcon}/>
                                </div>
                            ) :
                            (
                                <div>
                                    <img src={collapseIcon} />
                                </div>
                            )
                        }
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <div>
                        { menuCollapse ?
                            (<div>
                                <div>
                                    <img src={daoImageShaped} style={{maxHeight:100, maxWidth:100, paddingLeft:20, paddingTop:50, paddingBottom:150}}/>
                                </div>
                                <div  style={{paddingBottom:120}}>
                                    <Menu>
                                        <MenuItem>{getNavigationIcon(proposalIcon)}</MenuItem>
                                        <MenuItem>{getNavigationIcon(updateIcon)}</MenuItem>
                                        <MenuItem>{getNavigationIcon(treasuryIcon)}</MenuItem>
                                        <MenuItem>{getNavigationIcon(membersIcon)}</MenuItem>
                                        <MenuItem>{getNavigationIcon(chatIcon)}</MenuItem>
                                    </Menu>
                                </div>

                            </div>) :
                            (<div>
                                <div>
                                    <img src={daoImageShaped} style={{maxHeight:200, maxWidth:200, paddingLeft:100, paddingTop:30}}/>
                                </div>
                                <div className={"daoNameSidebar"}>
                                    Ethic comfort fashion group
                                </div>
                                <div style={{paddingLeft:100, paddingBottom:100}}>
                                    <Menu>
                                        <MenuItem>{getNavigationItem(proposalIcon,"PROPOSALS")}</MenuItem>
                                        <MenuItem>{getNavigationItem(updateIcon,"TREASURY")}</MenuItem>
                                        <MenuItem>{getNavigationItem(treasuryIcon,"UPDATES")}</MenuItem>
                                        <MenuItem>{getNavigationItem(membersIcon,"MEMBERS")}</MenuItem>
                                        <MenuItem>{getNavigationItem(chatIcon,"CHAT")}</MenuItem>
                                    </Menu>
                                </div>
                            </div>)
                        }
                    </div>
                </SidebarContent>
                <SidebarFooter>
                    { menuCollapse ?
                        (
                            <div style={{padding:"10px 10px 5px 45px"}}>
                                <img src={lomadsLogo} onClick={() => logoOnClick("https://lomads.xyz/")} />
                            </div>
                        ) :
                        (
                            <div>
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
                        )
                    }
                </SidebarFooter>
            </ProSidebar>
        </div>
    );
};

export default Sidebar2;