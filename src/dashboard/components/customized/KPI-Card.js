import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import { Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function KPICard({ id, title, value, changeAmount, interval, data, handleClickOpen }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const trendColors = {
    up:
      theme.palette.mode === 'light'
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === 'light'
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === 'light'
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: 'success',
    down: 'error',
    neutral: 'default',
  };

  let trend;
  if (changeAmount != null){
    if (changeAmount > 0) trend = "up";
    else if (changeAmount < 0) trend = "down";
    else trend = "neutral";
  }

  const color = labelColors[trend];
  const chartColor = trendColors[trend];
  const changeAmountSign = {up: '+', down: '-', neutral: ''};

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h4" component="p">
                {value}
              </Typography>
              <Chip size="small" color={color} label={changeAmountSign[trend] + ' ' + Math.abs(changeAmount) + '%'} />
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Last 30 days
              </Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                endIcon={<ChevronRightRoundedIcon />}
                fullWidth={isSmallScreen}
                onClick={() => handleClickOpen(id)}
              >
                Get insights
              </Button>
            </Stack>
          </Stack>
          
          <Box sx={{ width: '100%', height: 50 }}>
          
          <SparkLineChart
              colors={[chartColor]}
              data={data} // Use the correct property 'data' for
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: 'band',
                data: interval, // Use the correct property 'data' for xAxis
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box>
          
        </Stack>
      </CardContent>
    </Card>
  );
}

KPICard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  changeAmount: PropTypes.string.isRequired,
  interval: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['down', 'neutral', 'up']).isRequired,
  value: PropTypes.string.isRequired,
};

export default KPICard;
