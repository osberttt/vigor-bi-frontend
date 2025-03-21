import './App.css';
import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppNavbar from './dashboard/components/AppNavbar';
import SideMenu from './dashboard/components/SideMenu';
import AppTheme from './shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './dashboard/theme/customizations';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OverviewBoard from './dashboard/pages/Overview/Overview-Board';
import TrendsBoard from './dashboard/pages/Trends/Trends-Board';
import CostProfitBoard from './dashboard/pages/Cost-Profit/Cost-Profit-Board';
import StockBoard from './dashboard/pages/Stock-Management/Stock-Management-Board';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const useDatabase = false;
function App(props) {
  return (
  <AppTheme {...props} themeComponents={xThemeComponents}>
  <CssBaseline enableColorScheme />
  <Box sx={{ display: 'flex' }}>
    <SideMenu />
    <AppNavbar />
    {/* Main content */}
      <Routes>
        <Route path="/" element={<OverviewBoard useDatabase={useDatabase}/>} />
        <Route path="/overview" element={<OverviewBoard useDatabase={useDatabase}/>} />
        <Route path="/trends" element={<TrendsBoard useDatabase={useDatabase}/>} />
        <Route path="/cost-profit" element={<CostProfitBoard useDatabase={useDatabase}/>} />
        <Route path="/stock-management" element={<StockBoard useDatabase={useDatabase}/>} />
      </Routes>
  </Box>
</AppTheme>
  )
}

export default App;
