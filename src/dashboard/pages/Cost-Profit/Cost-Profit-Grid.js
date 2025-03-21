import React, { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';
import Grid2 from '@mui/material/Grid2';
import LineGraph from '../../components/customized/Line-Graph';
import { humanizeDate, humanizeNumber} from '../../utils/utils';
import CustomDatePicker from '../../components/CustomDatePicker';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import { generateMockRevenuePeriod, generateMockCostPeriod, generateMockCostProfitInsights } from '../../data/cost-profit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import axios from 'axios';

export default function CostProfitGrid({useDatabase}) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // dialog
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState("");
    const [dialogDescription, setDialogDescription] = React.useState("");
    const handleClickOpen = async (id) => {
      try {
        if (useDatabase) {
        const start = startDate.format('YYYY-M-D');  // Format as yyyy-mm-dd
        const end = endDate.format('YYYY-M-D');      // Format as yyyy-mm-dd
        const response = await axios.get(`http://localhost:5000/api/ai-insights/cost-profit?start=${start}&end=${end}`);
        setDialogDescription(response.data.data);
        } else {
          setDialogDescription(generateMockCostProfitInsights(profitValue, profitInterval, profitSeries));
        }
        setDialogTitle("Gemini AI Insights for Total Cost, Profit and Revenue during the selected period");
        setDialogOpen(true);
      } catch (error) {
        console.error("API call failed:", error);
      }
  
    };
    const handleClose = () => {
      setDialogOpen(false);
    };

    const [profitInterval, setProfitInterval] = useState([]);
    const [profitSeries, setProfitSeries] = useState([]);
    const [profitValue, setProfitValue] = useState(0);

    const [startDate, setStartDate] = React.useState(dayjs().subtract(30, "day"));
    const [endDate, setEndDate] = React.useState(dayjs());

    // Fetch profit data when startDate & endDate change
    useEffect(() => {
      if (!startDate || !endDate) return; // Ensure both dates are selected

      const fetchProfitData = async () => {
          try {
              const start = startDate.format('YYYY-M-D');  // Format as yyyy-mm-dd
              const end = endDate.format('YYYY-M-D');      // Format as yyyy-mm-dd
              
              let revenueData;
              let costData;
              if (useDatabase) {
              const [revenueResponse, costResponse] = await Promise.all([
                  fetch(`http://localhost:5000/api/cost-profit/revenue-period?start=${start}&end=${end}`),
                  fetch(`http://localhost:5000/api/cost-profit/cost-period?start=${start}&end=${end}`)
              ]);    
              revenueData = await revenueResponse.json();
              costData = await costResponse.json();
              revenueData = revenueData.data;
              costData = costData.data;
              } else {
                revenueData = generateMockRevenuePeriod(start, end);
                costData = generateMockCostPeriod(start, end);
              }
              
              let interval = [];
              let totalProfit = 0;
              
              let revenueArray = [];
              let costArray = [];
              let profitArray = [];
              
              for (let i = 0; i < revenueData.length; i++) {
                  interval.push(humanizeDate(revenueData[i].date));
                  
                  const revenue = revenueData[i].totalRevenue;
                  const cost = costData[i].totalCost;
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
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchProfitData();
    }, [startDate, endDate]); // Dependencies: useEffect runs when startDate or endDate change


    const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
    };

    const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
    };
      return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {dialogTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogDescription}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
              <LineGraph id = "cost-profit" title = "Total Profit" value = {humanizeNumber(profitValue)} description = "Data for period between start date and end date" interval = {profitInterval} series = {profitSeries} handleClickOpen={handleClickOpen}/>
            </Grid2>
          </Grid2>
          <Copyright sx={{ my: 4 }} />
        </Box>
      );
}
