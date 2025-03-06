import React from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";

import {Icons} from "./Icons"; // Import the icons file

const mainListItems = [
  { text: "Overview", icon: <Icons.Overview />, path: "/overview" },
  { text: "Trends", icon: <Icons.Trends />, path: "/trends" },
  { text: "Cost & Profit", icon: <Icons.CostAndProfit />, path: "/cost-profit" },
  { text: "Stock Management", icon: <Icons.StockManagement />, path: "/stock-management" },
];


const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, path: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "/feedback" },
];

export default function MenuContent() {
  const location = useLocation(); // Get current route

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path} // Highlight active page
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
