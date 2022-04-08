import React, { useState } from "react";

import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from "react-pro-sidebar";
import { FaList } from "react-icons/fa";
import { FiCreditCard, FiArrowLeftCircle, FiArrowRightCircle, FiUser, FiUsers, FiLinkedin } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiMessage } from "react-icons/bi";
import "react-pro-sidebar/dist/css/styles.css";
import "./Sidebar.css";

const Sidebar = () => {

  const [menuCollapse, setMenuCollapse] = useState(false)
  const menuIconClick = () => {
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  const userDetails = () => {
    return (<FiUser/>);
  }

  return (
        <div id="sidebar">
          <ProSidebar collapsed={menuCollapse}> {/* width={434} collapsedWidth={134}*/}
            <SidebarHeader>
              <div className="logotext">
                <p>{menuCollapse ? (<FiUser/>) : (<FiUser/>)}</p>
              </div>
              <div className="closemenu" onClick={menuIconClick}>
                {menuCollapse ? (<FiArrowRightCircle/>) : (<FiArrowLeftCircle/>)}
              </div>
            </SidebarHeader>
            <SidebarContent>
              <Menu iconShape="square">
                <MenuItem active={true} icon={<FaList />}>PROPOSALS</MenuItem>
                <MenuItem icon={<FiCreditCard />}>TREASURY</MenuItem>
                <MenuItem icon={<RiPencilLine />}>UPDATES</MenuItem>
                <MenuItem icon={<FiUsers />}>MEMBERS</MenuItem>
                <MenuItem icon={<BiMessage />}>CHAT</MenuItem>
              </Menu>
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

export default Sidebar;