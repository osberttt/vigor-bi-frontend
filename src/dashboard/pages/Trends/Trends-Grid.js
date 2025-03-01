import React, { useState, useEffect, use } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

import MoMTrends from './MoM-Trends';
import YoYTrends from './YoY-Trends';
import TimeToggle from '../../components/TimeToggle';

export default function TrendsGrid() {

  const [timeFrame, setTimeFrame] = useState('months');

  const handleTimeFrameChange = (newTimeFrame) => {
    if (newTimeFrame === 'months' || newTimeFrame === 'years'){
      setTimeFrame(newTimeFrame);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Trends
      </Typography>
      <TimeToggle onChange={handleTimeFrameChange} />
      {timeFrame === 'months' ? <MoMTrends /> : <YoYTrends />}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
