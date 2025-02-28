import React, { useState, useEffect, use } from 'react';
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
import {series as salesSeries} from '../../data/Overview/Total-Sales-Amount';
import {series as quantitySeries} from '../../data/Overview/Total-Quantity';

import Table from '../../components/customized/Table';
import LineGraph from '../../components/customized/Line-Graph';
import BarGraph from '../../components/customized/Bar-Graph';
import SimpleStatCard from '../../components/customized/Simple-Stat';
import { humanizeNumber, renderSparklineCell } from '../../utils/utils';

export default function OverviewGrid() {

  // Unique SKUs
  const [uniqueSKUs, setUniqueSKUs] = useState([]);
  const [uniqueSKUsInterval, setUniqueSKUsInterval] = useState([]);
  useEffect(() => {
    // Fetch the API data
    fetch('http://localhost:5000/api/overview/unique-skus')
      .then((response) => response.json())
      .then((data) => {
        let interval = [];
        let skuData = [];

        for (let i = 0; i < data.data.length; i++) {
          interval.push(data.data[i].date);
          skuData.push(data.data[i].skus);
        }

        setUniqueSKUs(skuData);
        setUniqueSKUsInterval(interval);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Quantity Line Graph
  const [quantitySeries, setquantitySeries] = useState([]);
  const [quantityInterval, setquantityInterval] = useState([]);
  const [quantityValue, setquantityValue] = useState('');
  useEffect(() => {
    // Fetch the API data
    fetch('http://localhost:5000/api/overview/sale-quantity-graph')
      .then((response) => response.json())
      .then((data) => {
        

        // Initialize arrays and variable for tracking data
        let interval = [];
        let menuItemData = [];
        let stockItemData = [];
        let value = 0;

        // Iterate through the data array
        for (let i = 0; i < data.data.length; i++) {
          interval.push(data.data[i].date);             // Push the date
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
  }, []);

  // Revenue Bar Graph
  const [revenueValue, setRevenueValue] = useState(0);
  const [revenueSeries, setRevenueSeries] = useState([]);
  useEffect(() => {
    // Fetch the API data
    fetch('http://localhost:5000/api/overview/revenue-graph')
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
  }, []);

  // Total Cost KPI
  const [costData, setcostData] = useState([]);
  const [costInterval, setcostInterval] = useState([]);
  const [costValue, setcostValue] = useState('');
  useEffect(() => {
    // Fetch the API data
    fetch('http://localhost:5000/api/overview/total-cost-kpi')
      .then((response) => response.json())
      .then((data) => {
        let interval = [];
        let costData = [];
        let value = 0;

        for (let i = 0; i < data.data.length; i++) {
          interval.push(data.data[i].date);
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
  }, []);

  // Total Profit KPI
  const [profitData, setProfitData] = useState([]);
  const [profitInterval, setProfitInterval] = useState([]);
  const [profitValue, setProfitValue] = useState(''); 
  useEffect(() => {
    // Fetch the API data for Total Revenue and Total Cost
    Promise.all([
      fetch('http://localhost:5000/api/overview/total-revenue-kpi'),
      fetch('http://localhost:5000/api/overview/total-cost-kpi'),
    ])
      .then(async ([revenueResponse, costResponse]) => {
        const revenueData = await revenueResponse.json();
        const costData = await costResponse.json();

        let interval = [];
        let profitDataArray = [];
        let totalProfit = 0;

        for (let i = 0; i < revenueData.data.length; i++) {
          interval.push(revenueData.data[i].date);
          
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
  }, []);

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
      renderCell: renderSparklineCell,
    },
  ];
  // Best Selling Table
  const [bestRows, setBestRows] = useState([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the best-selling items data
        const response = await fetch('http://localhost:5000/api/overview/best-selling-items');
        const data = await response.json();
        
        let rows = [];
        
        // Loop through the best-selling items
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];
          
          // Fetch daily sales data for the current item
          const dailySalesResponse = await fetch(`http://localhost:5000/api/overview/get-daily-sales?menuId=${item.menuId}`);
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
  }, []);
  // Best Selling Table
  const [worstRows, setWorstRows] = useState([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the best-selling items data
        const response = await fetch('http://localhost:5000/api/overview/worst-selling-items');
        const data = await response.json();
        
        let rows = [];
        
        // Loop through the best-selling items
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];
          
          // Fetch daily sales data for the current item
          const dailySalesResponse = await fetch(`http://localhost:5000/api/overview/get-daily-sales?menuId=${item.menuId}`);
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
  }, []);

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
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard title = "Total Sold Unique SKU" value = {humanizeNumber(87)} trend = "neutral" changeAmount="0" interval = {uniqueSKUsInterval} data = {uniqueSKUs} />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard title = "Total Cost" value = {humanizeNumber(costValue)} trend = "up" changeAmount="5" interval = {costInterval} data = {costData} />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard title = "Gross Profit" value = {humanizeNumber(profitValue)} trend = "up" changeAmount="12" interval = {profitInterval} data = {profitData} />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <LineGraph title = "Total Sold Quantities of All Stock and Menu Items" value = {humanizeNumber(quantityValue)} description = "Last 30 days" interval = {quantityInterval} series = {quantitySeries}/>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Revenue of all Stock and Menu Items" value={humanizeNumber(revenueValue)} interval={['Stock','Menu']} description = "Last 30 days" series= {revenueSeries}/>
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
