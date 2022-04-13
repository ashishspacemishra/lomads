import React, { useState } from "react";

import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from "react-pro-sidebar";
import { FaList } from "react-icons/fa";
import { FiCreditCard, FiArrowLeftCircle, FiArrowRightCircle, FiUser, FiUsers, FiLinkedin } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiMessage } from "react-icons/bi";
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

    const getNavItemIcon = (icon) => {
        return (
            <div>
                <img src={icon} />
            </div>
        );
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
                                    <img src={daoImageShaped} style={{maxHeight:100, maxWidth:100, paddingLeft:20, paddingTop:30}}/>
                                </div>
                                <div>
                                    <Menu>
                                        <MenuItem>{getNavigationItem(proposalIcon,"PROPOSALS")}</MenuItem>
                                        <MenuItem>{getNavigationItem(updateIcon,"TREASURY")}</MenuItem>
                                        <MenuItem>{getNavigationItem(treasuryIcon,"UPDATES")}</MenuItem>
                                        <MenuItem>{getNavigationItem(membersIcon,"MEMBERS")}</MenuItem>
                                        <MenuItem>{getNavigationItem(chatIcon,"CHAT")}</MenuItem>
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
                                <div>
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
                    <Menu iconShape="square">
                        <MenuItem icon={<FiLinkedin />}>Lomads</MenuItem>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
        </div>
    );
};

export default Sidebar2;