import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import edu from '../assets/logedu.png';
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase_set/firebase';
const Header = ({ onEditProfileClick, onProfileClick, onSearchChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    

    
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleEditProfile = () => {
    handleMenuClose();
    setDrawerOpen(false);
    onEditProfileClick(); 
  };

  const handleProfile = () => {
    handleMenuClose();
    setDrawerOpen(false);
    onProfileClick();
  };

  const handleSearch = (event) => {
    onSearchChange(event.target.value);
  };

  return (
    <AppBar position="fixed" color="default" elevation={2}
      sx={{ px: { xs: 1, sm: 3 }, py: 1, width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ width: 48, height: 48, flexShrink: 0 }}>
            <img src={edu} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
        </Box>

        {isMobile && (
          <IconButton onClick={toggleDrawer} sx={{ ml: 'auto' }}>
            <MenuIcon />
          </IconButton>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#e0e0e0",
            borderRadius: 3,
            px: 2,
            py: 0.5,
            width: "100%",
            maxWidth: 500,
            flexGrow: 1,
            mx: isMobile ? "auto" : 0,
          }}
        >
          <InputBase 
            placeholder="Search alumni..." 
            sx={{ flex: 1, fontSize: { xs: "0.85rem", sm: "1rem" } }} 
            onChange={handleSearch}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Box>

        {!isMobile && (
          <IconButton onClick={handleMenuClick}>
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        )}
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }}>
          <MenuItem onClick={toggleDrawer}>Alumni Directory</MenuItem>
          <MenuItem onClick={toggleDrawer}>Community Feed</MenuItem>
          <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
        </Box>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        <MenuItem onClick={handleMenuClose}>Alumni Directory</MenuItem>
        <MenuItem onClick={handleMenuClose}>Community Feed</MenuItem>
        <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
