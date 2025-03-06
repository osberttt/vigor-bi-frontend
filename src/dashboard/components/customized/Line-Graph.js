import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default function LineGraph({id, title, value, description, interval, series, chipValue = null, handleClickOpen}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  const chipColors = {
    up: "success",
    down: "error",
    neutral: "default"
  }

  let chipColor;
  if (chipValue != null){
    if (chipValue > 0) chipColor = chipColors.up;
    else if (chipValue < 0) chipColor = chipColors.down;
    else chipColor = chipColors.neutral;
  }

  const sx = series.reduce((acc, s) => {
    acc[`& .MuiAreaElement-series-${s.id}`] = {
      fill: `url('#${s.id}')`,
    };
    return acc;
  }, {});

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {value}
            </Typography>
            {chipValue && <Chip size="small" color={chipColor} label={`${chipValue} %`} />}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
          
        </Stack>
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
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: interval,
              tickInterval: true,
            },
          ]}
          series={series}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={sx}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          {series.map((s, index) => (<AreaGradient key={s.id} color={index === 0 ? theme.palette.primary.dark : theme.palette.primary.main} id={s.id} />))}
        </LineChart>
        
      </CardContent>
    </Card>
  );
}
