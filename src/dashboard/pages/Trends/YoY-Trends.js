import React, { useState, useEffect, use } from 'react';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';

import HighlightedCard from '../../components/HighlightedCard';
import KPICard from '../../components/customized/KPI-Card';


import Table from '../../components/customized/Table';
import LineGraph from '../../components/customized/Line-Graph';
import BarGraph from '../../components/customized/Bar-Graph';
import SimpleStatCard from '../../components/customized/Simple-Stat';
import { getShortMonthNames, humanizeNumber, renderSparklineCell } from '../../utils/utils';

export default function YoYTrends() {
  const years = ['2020','2021','2022','2023','2024'];

  // Revenue Bar Graph
  const [revenueValue, setRevenueValue] = useState(0);
  const [revenueSeries, setRevenueSeries] = useState([]);
  useEffect(() => {
    // Fetch the API data
    fetch('http://localhost:5000/api/trends/revenue-yoy')
      .then((response) => response.json())
      .then((data) => {
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

        const stock_value = data.data.stock_revenues_yoy.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const menu_value = data.data.menu_revenues_yoy.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const total_value = stock_value + menu_value;

        setRevenueValue(total_value);
        setRevenueSeries(series);
 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Cost Bar Graph
  const [costValue, setCostValue] = useState(0);
  const [costSeries, setCostSeries] = useState([]);
  useEffect(() => {
    // Fetch the API data
    fetch('http://localhost:5000/api/trends/cost-yoy')
      .then((response) => response.json())
      .then((data) => {
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
 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Profit Bar Graph
  const [profitValue, setProfitValue] = useState(0);
  const [profitSeries, setProfitSeries] = useState([]);
  useEffect(() => {
    Promise.all([
        fetch('http://localhost:5000/api/trends/revenue-yoy').then(res => res.json()),
        fetch('http://localhost:5000/api/trends/cost-yoy').then(res => res.json())
    ])
    .then(([revenueData, costData]) => {
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
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  }, []);

  // Quantity Bar Graph
  const [quantityValue, setQuantityValue] = useState(0);
  const [quantitySeries, setQuantitySeries] = useState([]);
  useEffect(() => {
    // Fetch the API data
    fetch('http://localhost:5000/api/trends/quantity-yoy')
      .then((response) => response.json())
      .then((data) => {
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

        const stock_value = data.data.stock_quantities_yoy.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const menu_value = data.data.menu_quantities_yoy.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const total_value = stock_value + menu_value;

        setQuantityValue(total_value);
        setQuantitySeries(series);
 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  

  return (
      <Grid2
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Cost: Year-over-Year" value={humanizeNumber(costValue)} interval={years} description = "Data for Last 5 Years" series= {costSeries}/>
        </Grid2>   
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Revenue: Year-over-Year" value={humanizeNumber(revenueValue)} interval={years} description = "Data for Last 5 Years" series= {revenueSeries}/>
        </Grid2> 
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Profit: Year-over-Year" value={humanizeNumber(profitValue)} interval={years} description = "Data for Last 5 Years" series= {profitSeries}/>
        </Grid2> 
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph title = "Total Quantiies Sold: Year-over-Year" value={humanizeNumber(quantityValue)} interval={years} description = "Data for Last 5 Years" series= {quantitySeries}/>
        </Grid2>            
      </Grid2>     
  );
}
