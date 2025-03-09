import React from "react";
import "/src/css/home.css";
import { useNavigate } from "react-router-dom";
import { isAdmin, isAuthenticated, logout } from "../Service/service";
import Avatar from "@mui/joy/Avatar";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MoreVert from "@mui/icons-material/MoreVert";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LoginIcon from '@mui/icons-material/Login';
import Tooltip from '@mui/material/Tooltip';

export const Main = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "USER";
  const getInitial = (username) => {
    const data = username.split(" ");
    return data.length > 1
      ? (username.data[0].charAt(0) + data[1].charAt(0)).toUpperCase()
      : data[0].charAt(0).toUpperCase();
  };

  const initials = getInitial(username);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () =>{
    logout();
   console.log( localStorage.getItem('username'))
    alert('logout success')
  }

  const handleDashBoard = ()=>{
    navigate("/admin")
  }

  return (
    <>
      <div className="main">
        <div>
          <header>
            <nav className="navbar">
              <h3 className="title"><DirectionsBusIcon/> Online Local Bus Booking System</h3>
              {isAuthenticated() ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginLeft: "20px",
                    }}
                  >
                    <Tooltip title={username} arrow>
                      <Avatar>{initials}</Avatar>
                    </Tooltip>
                    
                    <Dropdown>
                      <Tooltip title="More" arrow>
                      <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{
                          root: { variant: "outlined", color: "neutral" },
                        }}
                      >
                        <MoreVert />
                      </MenuButton>
                        </Tooltip>
                      <Menu>
                        {
                          isAdmin() && <MenuItem style={{color:"blue"}} onClick={handleDashBoard}>Dashboard</MenuItem>
                        }
                        <MenuItem>History</MenuItem>
                        <MenuItem style={{color:"red"}} onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </Dropdown>
                  </div>
                </>
              ) : (
                <>
                  <a onClick={handleLogin} style={{cursor:'pointer'}}>
                    <LoginIcon color="primary"/>
                  </a>
                </>
              )}
            </nav>
          </header>
        </div>
      </div>
    </>
  );
};
