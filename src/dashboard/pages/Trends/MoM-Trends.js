import React, { useState, useEffect} from 'react';
import Grid2 from '@mui/material/Grid2';
import BarGraph from '../../components/customized/Bar-Graph';
import { getShortMonthNames, humanizeNumber} from '../../utils/utils';
import { quantityMOM, costMOM, revenueMOM, generateMockMOMCostInsights, generateMockMOMProfitInsights, generateMockMOMRevenueInsights, generateMockMOMQuantityInsights } from '../../data/trends';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import axios from 'axios';

export default function MoMTrends({useDatabase}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("");
  const [dialogDescription, setDialogDescription] = React.useState("");
  const handleClickOpen = async (id) => {
    try {
      if (useDatabase) {
      const response = await axios.get(`http://localhost:5000/api/ai-insights/mom?id=${id}`);
      setDialogDescription(response.data.data);
      } else {
        switch (id){
          case "cost":
            setDialogDescription(generateMockMOMCostInsights(costValue, costSeries));
            break;
          case "profit":
            setDialogDescription(generateMockMOMProfitInsights(profitValue, profitSeries));
            break;
          case "quantity":
            setDialogDescription(generateMockMOMQuantityInsights(quantityValue, quantitySeries));
            break;
          case "revenue":
            setDialogDescription(generateMockMOMRevenueInsights(revenueValue, revenueSeries));
            break;
          default:
            break
        }
      }
      switch (id) {
        case "cost":
          setDialogTitle("Gemini AI Insight for Total Cost: Month-over-Month");
          break;
        case "profit":
          setDialogTitle("Gemini AI Insight for Total Profit: Month-over-Month");
          break;
        case "quantity":
          setDialogTitle("Gemini AI Insight for Total Sold Quantities of All Stock and Menu Items: Month-over-Month");
          break;
        case "revenue":
          setDialogTitle("Gemini AI Insight for Total Revenue of all Stock and Menu Items: Month-over-Month");
          break;
        default:
          break;
      }
      setDialogOpen(true);
    } catch (error) {
      console.error("API call failed:", error);
    }
 
  };
  const handleClose = () => {
    setDialogOpen(false);
  };
  // Quantity Bar Graph
const [quantityValue, setQuantityValue] = useState(0);
const [quantitySeries, setQuantitySeries] = useState([]);

useEffect(() => {
  const fetchQuantityData = async () => {
    try {
      let data;
      if (useDatabase) {
      // Fetch the API data
      const response = await fetch('http://localhost:5000/api/trends/quantity-mom');
      data = await response.json();
      } else {
        data = quantityMOM;
      }

      const series = [
        {
          id: 'stock_revenue',
          label: 'Stock Revenue',
          data: data.data.stock_quantities_mom,
          stack: 'A',
        },
        {
          id: 'menu_revenue',
          label: 'Menu Revenue',
          data: data.data.menu_quantities_mom,
          stack: 'A',
        }
      ];

      const stock_value = data.data.stock_quantities_mom.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const menu_value = data.data.menu_quantities_mom.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const total_value = stock_value + menu_value;

      setQuantityValue(total_value);
      setQuantitySeries(series);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchQuantityData();
}, []);

// Cost Bar Graph
const [costValue, setCostValue] = useState(0);
const [costSeries, setCostSeries] = useState([]);

useEffect(() => {
  const fetchCostData = async () => {
    try {
      let data;
      if (useDatabase) {
      // Fetch the API data
      const response = await fetch('http://localhost:5000/api/trends/cost-mom');
      const data = await response.json();
      } else {
        data = costMOM;
      }

      const series = [
        {
          id: 'total_cost',
          label: 'Total Cost',
          data: data.data,
          stack: 'A',
        },
      ];

      const total_value = data.data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      setCostValue(total_value);
      setCostSeries(series);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchCostData();
}, []);

// Profit Bar Graph
const [profitValue, setProfitValue] = useState(0);
const [profitSeries, setProfitSeries] = useState([]);
useEffect(() => {
  const fetchProfitData = async () => {
    try {
      let revenueData;
      let costData;
      if (useDatabase) {
      // Fetch revenue and cost data concurrently
      const [revenueResponse, costResponse] = await Promise.all([
        fetch('http://localhost:5000/api/trends/revenue-mom'),
        fetch('http://localhost:5000/api/trends/cost-mom')
      ]);
      revenueData = await revenueResponse.json();
      costData = await costResponse.json();
      } else {
        revenueData = revenueMOM;
        costData = costMOM;
      }

      const stockRevenue = revenueData.data.stock_revenues_mom;
      const menuRevenue = revenueData.data.menu_revenues_mom;
      const totalCost = costData.data;

      // Calculate profit for each month
      const profitData = stockRevenue.map((stock, index) => {
        const menu = menuRevenue[index] || 0;
        const cost = totalCost[index] || 0;
        return stock + menu - cost;
      });

      // Calculate total profit
      const totalProfit = profitData.reduce((acc, val) => acc + val, 0);

      setProfitValue(totalProfit);
      setProfitSeries([
        {
          id: 'profit',
          label: 'Profit',
          data: profitData,
          stack: 'A',
        }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchProfitData();
}, []);

// Revenue Bar Graph
const [revenueValue, setRevenueValue] = useState(0);
const [revenueSeries, setRevenueSeries] = useState([]);

useEffect(() => {
  const fetchRevenueData = async () => {
    try {
      let data;
      if (useDatabase) {
      // Fetch the API data
      const response = await fetch('http://localhost:5000/api/trends/revenue-mom');
      const data = await response.json();
      } else {
        data = revenueMOM;
      }

      const series = [
        {
          id: 'stock_revenue',
          label: 'Stock Revenue',
          data: data.data.stock_revenues_mom,
          stack: 'A',
        },
        {
          id: 'menu_revenue',
          label: 'Menu Revenue',
          data: data.data.menu_revenues_mom,
          stack: 'A',
        }
      ];

      const stock_value = data.data.stock_revenues_mom.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const menu_value = data.data.menu_revenues_mom.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const total_value = stock_value + menu_value;

      setRevenueValue(total_value);
      setRevenueSeries(series);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchRevenueData();
}, []);


  return (
      <Grid2
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
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
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph id = "cost" title = "Total Cost: Month-over-Month" value={humanizeNumber(costValue)} interval={getShortMonthNames()} description = "Data for Last Year" series= {costSeries} handleClickOpen={handleClickOpen}/>
        </Grid2>   
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph id = "revenue" title = "Total Revenue: Month-over-Month" value={humanizeNumber(revenueValue)} interval={getShortMonthNames()} description = "Data for Last Year" series= {revenueSeries} handleClickOpen={handleClickOpen}/>
        </Grid2> 
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph id = "profit" title = "Total Profit: Month-over-Month" value={humanizeNumber(profitValue)} interval={getShortMonthNames()} description = "Data for Last Year" series= {profitSeries} handleClickOpen={handleClickOpen}/>
        </Grid2> 
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph id = "quantity" title = "Total Quantiies Sold: Month-over-Month" value={humanizeNumber(quantityValue)} interval={getShortMonthNames()} description = "Data for Last Year" series= {quantitySeries} handleClickOpen={handleClickOpen}/>
        </Grid2>            
      </Grid2>     
  );
}
