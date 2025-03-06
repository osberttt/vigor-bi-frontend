import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

export default function BarGraph({id, title, value, description, interval, series,chipValue = null, handleClickOpen}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
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
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: interval,
            },
          ]}
          series={series}
          height={250}
          margin={{ left: 70, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
        
      </CardContent>
    </Card>
  );
}
