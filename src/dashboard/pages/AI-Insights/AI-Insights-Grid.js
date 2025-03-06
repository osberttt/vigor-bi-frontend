import React, { useState, useEffect, use } from 'react';
import Box from '@mui/material/Box';
import Copyright from '../../internals/components/Copyright';
import { Card, CardContent, Typography } from '@mui/material';

export default function AIGrid() {

  const [insight, setInsight] = useState("AI Insight hasn't been implemented yet.");
    useEffect(() => {
      // Fetch the API data
      fetch(`http://localhost:5000/api/ai-insight/insight`)
        .then((response) => response.json())
        .then((data) => {
          setInsight(data.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        AI Insights
      </Typography>
      <Card variant="outlined" sx={{ maxWidth: 300 }}>
      <CardContent>
        <Typography variant="body1">
          {insight}
        </Typography>
      </CardContent>
    </Card>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
