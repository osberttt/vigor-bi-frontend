import * as React from 'react';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';
import ChartUserByCountry from '../../components/ChartUserByCountry';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import HighlightedCard from '../../components/HighlightedCard';
import PageViewsBarChart from '../../components/PageViewsBarChart';
import SessionsChart from '../../components/SessionsChart';
import KPICard from '../../components/customized/KPI-Card';

import {data} from '../../data/Overview/KPI-Data';
import {rows as bestRows, columns as bestColumns} from '../../data/Overview/Best-Selling-Data';
import {rows as worstRows, columns as worstColumns} from '../../data/Overview/Worst-Selling-Data';
import {series as salesSeries} from '../../data/Overview/Total-Sales-Amount';
import {series as quantitySeries} from '../../data/Overview/Total-Quantity';

import Table from '../../components/customized/Table';
import LineGraph from '../../components/customized/Line-Graph';
import BarGraph from '../../components/customized/Bar-Graph';

export default function OverviewGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid2
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid2 key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <KPICard {...card} />
          </Grid2>
        ))}
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <LineGraph title = "Total Sales Amounts of Stock and Menu Items" value = "530k" description = "Data for last 12 months" series = {salesSeries}/>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Sales Quantities of Stock and Menu Items" value = "30k" description = "Data for last 6 months" series = {quantitySeries}/>
        </Grid2>
      </Grid2>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Best Selling Items (Last 30 days)
      </Typography>
      <Grid2 container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, lg: 9 }}>
          <Table rows={bestRows} columns={bestColumns} />
        </Grid2>
      </Grid2>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Worst Selling Items (Last 30 days)
      </Typography>
      <Grid2 container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, lg: 9 }}>
          <Table rows={worstRows} columns={worstColumns} />
        </Grid2>
      </Grid2>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
