import React, { useState, useEffect, use } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';
import Grid2 from '@mui/material/Grid2';
import LineGraph from '../../components/customized/Line-Graph';
import { humanizeNumber, renderSparklineCell } from '../../utils/utils';
import CustomDatePicker from '../../components/CustomDatePicker';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';

export default function CostProfitGrid() {

    const [profitInterval, setProfitInterval] = useState([]);
    const [profitSeries, setProfitSeries] = useState([]);
    const [profitValue, setProfitValue] = useState(0);

    const [startDate, setStartDate] = React.useState(dayjs().subtract(30, "day"));
    const [endDate, setEndDate] = React.useState(dayjs());

    // Fetch profit data when startDate & endDate change
    useEffect(() => {
    if (!startDate || !endDate) return; // Ensure both dates are selected

    // Construct query parameters (optional: send the date range to the API)
    const start = startDate.format('YYYY-M-D');  // Format as yyyy-mm-dd
    const end = endDate.format('YYYY-M-D');      // Format as yyyy-mm-dd

    console.log(start);
    console.log(end);
    Promise.all([
        fetch(`http://localhost:5000/api/cost-profit/revenue-period?start=${start}&end=${end}`),
        fetch(`http://localhost:5000/api/cost-profit/cost-period?start=${start}&end=${end}`),
    ])
        .then(async ([revenueResponse, costResponse]) => {
        const revenueData = await revenueResponse.json();
        const costData = await costResponse.json();

        let interval = [];
        let totalProfit = 0;

        let revenueArray = [];
        let costArray = [];
        let profitArray = [];

        for (let i = 0; i < revenueData.data.length; i++) {
            interval.push(revenueData.data[i].date);

            const revenue = revenueData.data[i].totalRevenue;
            const cost = costData.data[i].totalCost;
            const profit = revenue - cost;

            revenueArray.push(revenue);
            costArray.push(cost);
            profitArray.push(profit);
            totalProfit += profit;
        }

        const series = [
            {
            id: 'cost',
            label: 'Total Cost',
            showMark: false,
            curve: 'linear',
            stack: 'total',
            area: true,
            stackOrder: 'ascending',
            data: costArray,
            },
            {
            id: 'revenue',
            label: 'Revenue',
            showMark: false,
            curve: 'linear',
            stack: 'total',
            area: true,
            stackOrder: 'ascending',
            data: revenueArray,
            },
            {
            id: 'profit',
            label: 'Profit',
            showMark: false,
            curve: 'linear',
            stack: 'total',
            area: true,
            stackOrder: 'ascending',
            data: profitArray,
            },
        ];

        setProfitInterval(interval);
        setProfitValue(totalProfit);
        setProfitSeries(series);
        })
        .catch((error) => {
        console.error('Error fetching data:', error);
        });
    }, [startDate, endDate]); // Dependencies: useEffect runs when startDate or endDate change

    const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
    console.log('Selected Start Date:', newDate.format('YYYY-MM-DD'));
    };

    const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
    console.log('Selected End Date:', newDate.format('YYYY-MM-DD'));
    };


      return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
          {/* cards */}
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Cost and Profit Calculator
          </Typography>
          <Grid2 xs={12} sm={6} lg={3} sx={{ width: 300 }}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="column" spacing={2}>
                    {/* Start Date */}
                    <Stack direction="column" spacing={1}>
                    <Typography variant="caption" component="p" mb = {30}>
                        Select Start Date and End Date to calculate profit during a time period
                    </Typography>
                    <Typography variant="caption" component="p" mb = {30}>
                        Start Date
                    </Typography>
                    <CustomDatePicker value={startDate} setValue={setStartDate} onDateChange={handleStartDateChange} />
                    </Stack>

                    {/* End Date */}
                    <Stack direction="column" spacing={1}>
                    <Typography variant="caption" component="p" mb = {30}>
                        End Date
                    </Typography>
                    <CustomDatePicker value={endDate} setValue={setEndDate} onDateChange={handleEndDateChange} />
                    </Stack>
                </Stack>
                </CardContent>
            </Card>
            </Grid2>
          <Grid2
            container
            spacing={2}
            columns={12}
            sx={{ mb: (theme) => theme.spacing(2) }}
          >
            

            <Grid2 size={{ xs: 12, md: 6 }}>
              <LineGraph title = "Total Profit" value = {humanizeNumber(profitValue)} description = "Last 30 days" interval = {profitInterval} series = {profitSeries}/>
            </Grid2>
          </Grid2>
          <Copyright sx={{ my: 4 }} />
        </Box>
      );
}
