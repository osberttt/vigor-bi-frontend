import React, { useState, useEffect} from 'react';
import Grid2 from '@mui/material/Grid2';
import BarGraph from '../../components/customized/Bar-Graph';
import {humanizeNumber} from '../../utils/utils';
import { revenueYOY, costYOY, quantityYOY, generateMockYOYCostInsights, generateMockYOYProfitInsights, generateMockYOYQuantityInsights, generateMockYOYRevenueInsights } from '../../data/trends';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import axios from 'axios';

export default function YoYTrends({useDatabase}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("");
  const [dialogDescription, setDialogDescription] = React.useState("");
  const handleClickOpen = async (id) => {
    try {
      if (useDatabase) {
      const response = await axios.get(`http://localhost:5000/api/ai-insights/yoy?id=${id}`);
      setDialogDescription(response.data.data);
      } else {
        switch (id){
          case "cost":
            setDialogDescription(generateMockYOYCostInsights(costValue, costSeries));
            break;
          case "profit":
            setDialogDescription(generateMockYOYProfitInsights(profitValue, profitSeries));
            break;
          case "quantity":
            setDialogDescription(generateMockYOYQuantityInsights(quantityValue, quantitySeries));
            break;
          case "revenue":
            setDialogDescription(generateMockYOYRevenueInsights(revenueValue, revenueSeries));
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
  const years = ['2020','2021','2022','2023','2024'];
  // Revenue Bar Graph
const [revenueValue, setRevenueValue] = useState(0);
const [revenueSeries, setRevenueSeries] = useState([]);
useEffect(() => {
  const fetchRevenueData = async () => {
    try {
      let data;
      if (useDatabase) {
      const response = await fetch('http://localhost:5000/api/trends/revenue-yoy');
      data = await response.json();
      } else {
        data = revenueYOY;
      }

      const series = [
        {
          id: 'stock_revenue',
          label: 'Stock Revenue',
          data: data.data.stock_revenues_yoy,
          stack: 'A',
        },
        {
          id: 'menu_revenue',
          label: 'Menu Revenue',
          data: data.data.menu_revenues_yoy,
          stack: 'A',
        }
      ];

      const stock_value = data.data.stock_revenues_yoy.reduce((acc, val) => acc + val, 0);
      const menu_value = data.data.menu_revenues_yoy.reduce((acc, val) => acc + val, 0);
      const total_value = stock_value + menu_value;

      setRevenueValue(total_value);
      setRevenueSeries(series);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchRevenueData();
}, []);

// Cost Bar Graph
const [costValue, setCostValue] = useState(0);
const [costSeries, setCostSeries] = useState([]);
useEffect(() => {
  const fetchCostData = async () => {
    try {
      let data;
      if (useDatabase) {
      const response = await fetch('http://localhost:5000/api/trends/cost-yoy');
      data = await response.json();
      } else {
        data = costYOY;
      }
      const series = [
        {
          id: 'total_cost',
          label: 'Total Cost',
          data: data.data,
          stack: 'A',
        }
      ];

      const total_value = data.data.reduce((acc, val) => acc + val, 0);
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
      const [revenueResponse, costResponse] = await Promise.all([
        fetch('http://localhost:5000/api/trends/revenue-yoy'),
        fetch('http://localhost:5000/api/trends/cost-yoy')
      ]);
      const revenueData = await revenueResponse.json();
      const costData = await costResponse.json();
      } else {
      revenueData = revenueYOY;
      costData = costYOY;
      }

      const stockRevenue = revenueData.data.stock_revenues_yoy;
      const menuRevenue = revenueData.data.menu_revenues_yoy;
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

// Quantity Bar Graph
const [quantityValue, setQuantityValue] = useState(0);
const [quantitySeries, setQuantitySeries] = useState([]);
useEffect(() => {
  const fetchQuantityData = async () => {
    try {
      let data;
      if (useDatabase) {
      const response = await fetch('http://localhost:5000/api/trends/quantity-yoy');
      data = await response.json();
      } else {
        data = quantityYOY;
      }

      const series = [
        {
          id: 'stock_revenue',
          label: 'Stock Revenue',
          data: data.data.stock_quantities_yoy,
          stack: 'A',
        },
        {
          id: 'menu_revenue',
          label: 'Menu Revenue',
          data: data.data.menu_quantities_yoy,
          stack: 'A',
        }
      ];

      const stock_value = data.data.stock_quantities_yoy.reduce((acc, val) => acc + val, 0);
      const menu_value = data.data.menu_quantities_yoy.reduce((acc, val) => acc + val, 0);
      const total_value = stock_value + menu_value;

      setQuantityValue(total_value);
      setQuantitySeries(series);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchQuantityData();
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
          <BarGraph id = "cost" title = "Total Cost: Year-over-Year" value={humanizeNumber(costValue)} interval={years} description = "Data for Last 5 Years" series= {costSeries} handleClickOpen={handleClickOpen}/>
        </Grid2>   
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph id = "revenue" title = "Total Revenue: Year-over-Year" value={humanizeNumber(revenueValue)} interval={years} description = "Data for Last 5 Years" series= {revenueSeries} handleClickOpen={handleClickOpen}/>
        </Grid2> 
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph id = "profit" title = "Total Profit: Year-over-Year" value={humanizeNumber(profitValue)} interval={years} description = "Data for Last 5 Years" series= {profitSeries} handleClickOpen={handleClickOpen}/>
        </Grid2> 
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph id = "quantity" title = "Total Quantiies Sold: Year-over-Year" value={humanizeNumber(quantityValue)} interval={years} description = "Data for Last 5 Years" series= {quantitySeries} handleClickOpen={handleClickOpen}/>
        </Grid2>            
      </Grid2>     
  );
}
