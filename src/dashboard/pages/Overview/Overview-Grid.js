import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';
import HighlightedCard from '../../components/HighlightedCard';
import KPICard from '../../components/customized/KPI-Card';


import Table from '../../components/customized/Table';
import LineGraph from '../../components/customized/Line-Graph';
import BarGraph from '../../components/customized/Bar-Graph';
import { humanizeNumber, renderSparklineCell, calculatePercentageChange, humanizeDate } from '../../utils/utils';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

export default function OverviewGrid({date}) {
  // Unique SKUs
  const [uniqueSKUs, setUniqueSKUs] = useState([]);
  const [uniqueSKUsInterval, setUniqueSKUsInterval] = useState([]);
  useEffect(() => {
    // Fetch the API data
    fetch(`http://localhost:5000/api/overview/unique-skus?end=${date}`)
      .then((response) => response.json())
      .then((data) => {
        let interval = [];
        let skuData = [];

        for (let i = 0; i < data.data.length; i++) {
          interval.push(humanizeDate(data.data[i].date));
          skuData.push(data.data[i].skus);
        }

        setUniqueSKUs(skuData);
        setUniqueSKUsInterval(interval);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [date]);

  // Quantity Line Graph
  const [quantitySeries, setquantitySeries] = useState([]);
  const [quantityInterval, setquantityInterval] = useState([]);
  const [quantityValue, setquantityValue] = useState('');
  useEffect(() => {
    // Fetch the API data
    fetch(`http://localhost:5000/api/overview/sale-quantity-graph?end=${date}`)
      .then((response) => response.json())
      .then((data) => {
        

        // Initialize arrays and variable for tracking data
        let interval = [];
        let menuItemData = [];
        let stockItemData = [];
        let value = 0;

        // Iterate through the data array
        for (let i = 0; i < data.data.length; i++) {
          interval.push(humanizeDate(data.data[i].date));             // Push the date
          menuItemData.push(data.data[i].menuItemQuantity);      // Push the menu item quantity
          stockItemData.push(data.data[i].stockItemQuantity);    // Push the stock item quantity
          value += data.data[i].menuItemQuantity;        // Add to the total quantity value
          value += data.data[i].stockItemQuantity;       // Add to the total quantity value
        }


        // Create the series object to pass to the LineGraph component
        const series = [
          {
            id: 'menu',
            label: 'Menu Items',
            showMark: false,
            curve: 'linear',
            stack: 'total',
            area: true,
            stackOrder: 'ascending',
            data: menuItemData,
          },
          {
            id: 'stock',
            label: 'Stock Items',
            showMark: false,
            curve: 'linear',
            stack: 'total',
            area: true,
            stackOrder: 'ascending',
            data: stockItemData,
          },
        ];

        setquantitySeries(series);      // Set the series state
        setquantityInterval(interval);  // Set the interval state
        setquantityValue(value);        // Set the value state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [date]);

  // Revenue Bar Graph
  const [revenueValue, setRevenueValue] = useState(0);
  const [revenueSeries, setRevenueSeries] = useState([]);
  useEffect(() => {
    // Fetch the API data
    fetch(`http://localhost:5000/api/overview/revenue-graph?end=${date}`)
      .then((response) => response.json())
      .then((data) => {
        const series = [
          {
            id: 'revenue',
            label: 'Revenue',
            data: [data.stockRevenue, data.menuRevenue],
            stack: 'A',
          }
        ];

        setRevenueValue(data.stockRevenue + data.menuRevenue);
        setRevenueSeries(series);
 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [date]);

  // Total Cost KPI
  const [costData, setcostData] = useState([]);
  const [costInterval, setcostInterval] = useState([]);
  const [costValue, setcostValue] = useState('');
  useEffect(() => {
    // Fetch the API data
    fetch(`http://localhost:5000/api/overview/total-cost-kpi?end=${date}`)
      .then((response) => response.json())
      .then((data) => {
        let interval = [];
        let costData = [];
        let value = 0;

        for (let i = 0; i < data.data.length; i++) {
          interval.push(humanizeDate(data.data[i].date));
          costData.push(data.data[i].totalCost);
          value += data.data[i].totalCost;
        }

        setcostData(costData);
        setcostInterval(interval);
        setcostValue(value);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [date]);

  // Total Profit KPI
  const [profitData, setProfitData] = useState([]);
  const [profitInterval, setProfitInterval] = useState([]);
  const [profitValue, setProfitValue] = useState(''); 
  useEffect(() => {
    // Fetch the API data for Total Revenue and Total Cost
    Promise.all([
      fetch(`http://localhost:5000/api/overview/total-revenue-kpi?end=${date}`),
      fetch(`http://localhost:5000/api/overview/total-cost-kpi?end=${date}`),
    ])
      .then(async ([revenueResponse, costResponse]) => {
        const revenueData = await revenueResponse.json();
        const costData = await costResponse.json();

        let interval = [];
        let profitDataArray = [];
        let totalProfit = 0;

        for (let i = 0; i < revenueData.data.length; i++) {
          interval.push(humanizeDate(revenueData.data[i].date));
          
          // Assuming both revenueData and costData are ordered by the same interval (same date array)
          const revenue = revenueData.data[i].totalRevenue;
          const cost = costData.data[i].totalCost;

          const profit = revenue - cost;
          profitDataArray.push(profit);
          totalProfit += profit;
        }

        setProfitData(profitDataArray);
        setProfitInterval(interval);
        setProfitValue(totalProfit);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [date]);

  const columns = [
    {
      field: 'rank',
      headerName: 'Rank',
      headerAlign: 'right',
      align: 'right',
      flex: 0.3,
      minWidth: 60,
    },
    {
      field: 'sku',
      headerName: 'SKU',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'itemName',
      headerName: 'Item',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'category',
      headerName: 'Category',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'quantitySold',
      headerName: 'Quantity Sold',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 80,
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'conversions',
      headerName: 'Daily Conversions',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => renderSparklineCell(params, costInterval),
    },
  ];
  // Best Selling Table
  const [bestRows, setBestRows] = useState([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the best-selling items data
        const response = await fetch(`http://localhost:5000/api/overview/best-selling-items?end=${date}`);
        const data = await response.json();
        
        let rows = [];
        
        // Loop through the best-selling items
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];
          
          // Fetch daily sales data for the current item
          const dailySalesResponse = await fetch(`http://localhost:5000/api/overview/get-daily-sales?menuId=${item.menuId}&&end=${date}`);
          const dailySalesData = await dailySalesResponse.json();

          // Push the item with its daily sales data and additional information to rows
          rows.push({
            id: i + 1,
            rank: i + 1,
            sku: item.menuId,
            itemName: item.name,
            category: item.category,
            quantitySold: item.totalQuantitySold,
            revenue: item.totalQuantitySold * item.price,
            conversions: dailySalesData.data,
          });
        }

        // Update the state with the populated rows
        setBestRows(rows);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the async function
    fetchData();
  }, [date]);
  // Worst Selling Table
  const [worstRows, setWorstRows] = useState([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the best-selling items data
        const response = await fetch(`http://localhost:5000/api/overview/worst-selling-items?end=${date}`);
        const data = await response.json();
        
        let rows = [];
        
        // Loop through the best-selling items
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];
          
          // Fetch daily sales data for the current item
          const dailySalesResponse = await fetch(`http://localhost:5000/api/overview/get-daily-sales?menuId=${item.menuId}&&end=${date}`);
          const dailySalesData = await dailySalesResponse.json();

          // Push the item with its daily sales data and additional information to rows
          rows.push({
            id: i + 1,
            rank: i + 1,
            sku: item.menuId,
            itemName: item.name,
            category: item.category,
            quantitySold: item.totalQuantitySold,
            revenue: item.totalQuantitySold * item.price,
            conversions: dailySalesData.data,
          });
        }

        // Update the state with the populated rows
        setWorstRows(rows);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the async function
    fetchData();
  }, [date]);

  // Last Month Data
  const [lastMonthCost, setLastMonthCost] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [lastMonthQuantity, setLastMonthQuantity] = useState(0);
  const [lastMonthProfit, setLastMonthProfit] = useState(0);
  useEffect(() => {
    // Fetch the API data
    fetch(`http://localhost:5000/api/overview/last-month-data?end=${date}`)
      .then((response) => response.json())
      .then((data) => {
        setLastMonthCost(data.data.cost);
        setLastMonthRevenue(data.data.revenue);
        setLastMonthQuantity(data.data.quantity);
        setLastMonthProfit(data.data.profit);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [date]);

  // dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("");
  const [dialogDescription, setDialogDescription] = React.useState("");
  const handleClickOpen = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ai-insights/overview?id=${id}&&end=${date}`);
      setDialogDescription(response.data.data);
      switch (id) {
        case "sku": 
          setDialogTitle("Gemini AI Insight for Total Sold Unique SKU");
          break;
        case "cost":
          setDialogTitle("Gemini AI Insight for Total Cost");
          break;
        case "profit":
          setDialogTitle("Gemini AI Insight for Total Profit");
          break;
        case "quantity":
          setDialogTitle("Gemini AI Insight for Total Sold Quantities of All Stock and Menu Items");
          break;
        case "revenue":
          setDialogTitle("Gemini AI Insight for Total Revenue of all Stock and Menu Items");
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
        Overview
      </Typography>
      <Grid2
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard id="sku" title = "Total Sold Unique SKU" value = {humanizeNumber(87)}  changeAmount={0} interval = {uniqueSKUsInterval} data = {uniqueSKUs} handleClickOpen={handleClickOpen}/>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard id="cost" title = "Total Cost" value = {humanizeNumber(costValue)}  changeAmount={calculatePercentageChange(costValue,lastMonthCost)} interval = {costInterval} data = {costData} handleClickOpen={handleClickOpen}/>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard id="profit" title = "Gross Profit" value = {humanizeNumber(profitValue)}  changeAmount={calculatePercentageChange(profitValue,lastMonthProfit)} interval = {profitInterval} data = {profitData} handleClickOpen={handleClickOpen}/>
        </Grid2>       
        <Grid2 size={{ xs: 12, md: 6 }}>
          <LineGraph id = "quantity" title = "Total Sold Quantities of All Stock and Menu Items" value = {humanizeNumber(quantityValue)} description = "Last 30 days" interval = {quantityInterval} series = {quantitySeries} chipValue={calculatePercentageChange(quantityValue,lastMonthQuantity)} handleClickOpen={handleClickOpen}/>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph id = "revenue" title = "Total Revenue of all Stock and Menu Items" value={humanizeNumber(revenueValue)} interval={['Stock','Menu']} description = "Last 30 days" series= {revenueSeries} chipValue={calculatePercentageChange(revenueValue,lastMonthRevenue)} handleClickOpen={handleClickOpen}/>
        </Grid2>
      </Grid2>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Best Selling Items (Last 30 days)
      </Typography>
      <Grid2 container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, lg: 9 }}>
          <Table rows={bestRows} columns={columns} />
        </Grid2>
      </Grid2>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Worst Selling Items (Last 30 days)
      </Typography>
      <Grid2 container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, lg: 9 }}>
          <Table rows={worstRows} columns={columns} />
        </Grid2>
      </Grid2>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
