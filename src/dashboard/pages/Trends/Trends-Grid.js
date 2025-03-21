import React, { useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';
import MoMTrends from './MoM-Trends';
import YoYTrends from './YoY-Trends';
import TimeToggle from '../../components/TimeToggle';

export default function TrendsGrid({useDatabase}) {
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
      {timeFrame === 'months' ? <MoMTrends useDatabase={useDatabase} /> : <YoYTrends useDatabase={useDatabase} />}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
