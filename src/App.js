import logo from './logo.svg';
import './App.css';
import Dashboard from './dashboard/Dashboard';
import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './dashboard/components/AppNavbar';
import Header from './dashboard/components/Header';
import MainGrid from './dashboard/components/MainGrid';
import SideMenu from './dashboard/components/SideMenu';
import AppTheme from './shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './dashboard/theme/customizations';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AnalyticsBoard from './dashboard/AnalyticsBoard';
import OverviewBoard from './dashboard/pages/Overview/Overview-Board';
import TrendsBoard from './dashboard/pages/Trends/Trends-Board';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};
function App(props) {
  return (
  <AppTheme {...props} themeComponents={xThemeComponents}>
  <CssBaseline enableColorScheme />
  <Box sx={{ display: 'flex' }}>
    <SideMenu />
    <AppNavbar />
    {/* Main content */}
      <Routes>
        <Route path="/" element={<OverviewBoard />} />
        <Route path="/overview" element={<OverviewBoard />} />
        <Route path="/trends" element={<TrendsBoard />} />
        <Route path="/cost-profit" element={<AnalyticsBoard />} />
        <Route path="/stock-management" element={<AnalyticsBoard />} />
        <Route path="/ai-insight" element={<AnalyticsBoard />} />
      </Routes>
  </Box>
</AppTheme>
  )
}

export default App;
