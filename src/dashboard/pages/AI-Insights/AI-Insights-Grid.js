import React, { useState, useEffect, use } from 'react';
import Box from '@mui/material/Box';
import Copyright from '../../internals/components/Copyright';
import { Card, CardContent, Typography } from '@mui/material';

export default function AIGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        AI Insights
      </Typography>
      <Card variant="outlined" sx={{ maxWidth: 300 }}>
      <CardContent>
        <Typography variant="body1">
          You need an api key to get AI insights over your project data from Gemini API.
        </Typography>
      </CardContent>
    </Card>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
