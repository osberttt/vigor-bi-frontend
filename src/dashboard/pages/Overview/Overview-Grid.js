import React, { useState, useEffect, use } from 'react';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';
import KPICard from '../../components/customized/KPI-Card';
import Table from '../../components/customized/Table';
import LineGraph from '../../components/customized/Line-Graph';
import BarGraph from '../../components/customized/Bar-Graph';
import { humanizeNumber, renderSparklineCell, calculatePercentageChange, humanizeDate } from '../../utils/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { generateMockBestSelling, generateMockBestSellingInsights, generateMockCostData, generateMockKPIInsights, generateMockLastMonthData, generateMockQuantityData, generateMockQuantityInsights, generateMockRevenueData, generateMockRevenueInsights, generateMockRevenueList, generateMockSKUData, generateMockWorstSelling, generateMockWorstSellingInsights } from '../../data/overview';
import Stack from '@mui/material/Stack';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Button, Tooltip } from '@mui/material';

export default function OverviewGrid({date, useDatabase}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  // Unique SKUs
  const [uniqueSKUs, setUniqueSKUs] = useState([]);
  const [uniqueSKUsInterval, setUniqueSKUsInterval] = useState([]);
  useEffect(() => {
  const fetchUniqueSKUs = async () => {
    let data;
    if (useDatabase) {
      data = await fetchData(`http://localhost:5000/api/overview/unique-skus?end=${date}`);
      data = data.data;
    } else {
      data = generateMockSKUData(date);
    }

    if (data) {
      const interval = data.map((item) => humanizeDate(item.date));
      const skuData = data.map((item) => item.skus);
      setUniqueSKUs(skuData);
      setUniqueSKUsInterval(interval);
    }
  };
  fetchUniqueSKUs();
}, [date]);

  // Quantity Line Graph
  const [quantitySeries, setquantitySeries] = useState([]);
  const [quantityInterval, setquantityInterval] = useState([]);
  const [quantityValue, setquantityValue] = useState('');
  useEffect(() => {
    const fetchQuantityGraph = async () => {
      let data;
      if (useDatabase) {
        data = await fetchData(`http://localhost:5000/api/overview/sale-quantity-graph?end=${date}`);
        data = data.data;
      } else {
        data = generateMockQuantityData(date);
      }

      if (data) {
        let value = 0;
        const interval = data.map((item) => humanizeDate(item.date));
        const menuItemData = data.map((item) => item.menuItemQuantity);
        const stockItemData = data.map((item) => item.stockItemQuantity);
        data.forEach((item) => {
          value += item.menuItemQuantity + item.stockItemQuantity;
        });
        setquantitySeries([
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
        ]);
        setquantityInterval(interval);
        setquantityValue(value);
      }
    };
    fetchQuantityGraph();
  }, [date]);

  // Revenue Bar Graph
  const [revenueValue, setRevenueValue] = useState(0);
  const [revenueSeries, setRevenueSeries] = useState([]);
  useEffect(() => {
    const fetchRevenueGraph = async () => {
      let data;
      if (useDatabase) {
        data = await fetchData(`http://localhost:5000/api/overview/revenue-graph?end=${date}`);
      } else {
        data = generateMockRevenueData(date);
      }

      if (data) {
        setRevenueValue(data.stockRevenue + data.menuRevenue);
        setRevenueSeries([{ id: 'revenue', label: 'Revenue', data: [data.stockRevenue, data.menuRevenue], stack: 'A' }]);
      }
    };
    fetchRevenueGraph();
  }, [date]);

  // Total Cost KPI
  const [costData, setcostData] = useState([]);
  const [costInterval, setcostInterval] = useState([]);
  const [costValue, setcostValue] = useState('');
  useEffect(() => {
    const fetchCostKPI = async () => {
      let data;
      if (useDatabase) {
        data = await fetchData(`http://localhost:5000/api/overview/total-cost-kpi?end=${date}`);
        data = data.data;
      } else {
        data = generateMockCostData(date);
      }

      if (data) {
        const interval = data.map((item) => humanizeDate(item.date));
        const costData = data.map((item) => item.totalCost);
        const value = costData.reduce((acc, curr) => acc + curr, 0);
        setcostData(costData);
        setcostInterval(interval);
        setcostValue(value);
      }
    };
    fetchCostKPI();
  }, [date]);

  // Total Profit KPI
  const [profitData, setProfitData] = useState([]);
  const [profitInterval, setProfitInterval] = useState([]);
  useEffect(() => {
    const fetchProfitKPI = async () => {
      let revenueData;
      let costData;
      if (useDatabase){
        [revenueData, costData] = await Promise.all([
          fetchData(`http://localhost:5000/api/overview/total-revenue-kpi?end=${date}`),
          fetchData(`http://localhost:5000/api/overview/total-cost-kpi?end=${date}`)
        ]);
        revenueData = revenueData.data;
        costData = costData.data;
        if (revenueData && costData) {
          const interval = revenueData.map((item) => humanizeDate(item.date));
          const profitDataArray = revenueData.map((item, i) => item.totalRevenue - costData.data[i].totalCost);
          setProfitData(profitDataArray);
          setProfitInterval(interval);
        }
      } else {
        const revenueData = generateMockRevenueList(date);
        const costData = generateMockCostData(date);
        let interval = [];
        let profitDataArray = [];        
        for (let i = 0; i < revenueData.length; i++) {
          interval.push(humanizeDate(revenueData[i].date));
          
          // Assuming both revenueData and costData are ordered by the same interval (same date array)
          const revenue = revenueData[i].totalRevenue;
          const cost = costData[i].totalCost;
          
          const profit = revenue - cost;
          profitDataArray.push(profit);
        }
        setProfitData(profitDataArray);
        setProfitInterval(interval);
      }
      
      
    };
    fetchProfitKPI();
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
    const fetchBestSellingItems = async () => {
      try {
        let data;
        if (useDatabase) {
          data = await fetchData(`http://localhost:5000/api/overview/best-selling-items?end=${date}`);
          data = data.data;
        } else {
          data = generateMockBestSelling(date);
        }

        if (data && useDatabase) {
          const rows = await Promise.all(
            data.map(async (item, i) => {
              const dailySalesData = await fetchData(`http://localhost:5000/api/overview/get-daily-sales?menuId=${item.menuId}&&end=${date}`);
              return {
                id: i + 1, rank: i + 1, sku: item.menuId, itemName: item.name,
                category: item.category, quantitySold: item.totalQuantitySold,
                revenue: item.totalQuantitySold * item.price,
                conversions: dailySalesData?.data || []
              };
            })
          );
          setBestRows(rows);
        }

        if (data && !useDatabase){
          let rows = [];
          // Loop through the best-selling items
          for (let i = 0; i < data.length; i++) {
            const item = data[i];

            // Push the item with its daily sales data and additional information to rows
            rows.push({
              id: i + 1,
              rank: i + 1,
              sku: item.menuId,
              itemName: item.name,
              category: item.category,
              quantitySold: item.totalQuantitySold,
              revenue: item.totalQuantitySold * item.price,
              conversions: item.conversion.data,
            });
          };
          setBestRows(rows);
        }
      } catch (error) {
        console.error('Error fetching best-selling items:', error);
      }
    };
    fetchBestSellingItems();
  }, [date]);
  // Worst Selling Table
  const [worstRows, setWorstRows] = useState([]); 
  useEffect(() => {
    const fetchWorstSellingItems = async () => {
      try {
        let data;
        if (useDatabase) {
          data = await fetchData(`http://localhost:5000/api/overview/worst-selling-items?end=${date}`);
          data = data.data;
        } else {
          data = generateMockWorstSelling(date);
        }
        if (data && useDatabase) {
          const rows = await Promise.all(
            data.map(async (item, i) => {
              const dailySalesData = await fetchData(`http://localhost:5000/api/overview/get-daily-sales?menuId=${item.menuId}&&end=${date}`);
              return {
                id: i + 1, rank: i + 1, sku: item.menuId, itemName: item.name,
                category: item.category, quantitySold: item.totalQuantitySold,
                revenue: item.totalQuantitySold * item.price,
                conversions: dailySalesData?.data || []
              };
            })
          );
          setWorstRows(rows);
        }

        if (data && !useDatabase){
          let rows = [];
          // Loop through the best-selling items
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            // Push the item with its daily sales data and additional information to rows
            rows.push({
              id: i + 1,
              rank: i + 1,
              sku: item.menuId,
              itemName: item.name,
              category: item.category,
              quantitySold: item.totalQuantitySold,
              revenue: item.totalQuantitySold * item.price,
              conversions: item.conversion.data,
            });
          }
          setWorstRows(rows);
        }
      } catch (error) {
        console.error('Error fetching worst-selling items:', error);
      }
    };
    fetchWorstSellingItems();
  }, [date]);

  // Last Month Data
  const [lastMonthCost, setLastMonthCost] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [lastMonthQuantity, setLastMonthQuantity] = useState(0);
  const [lastMonthProfit, setLastMonthProfit] = useState(0);
  useEffect(() => {
    const fetchLastMonthData = async () => {
        try {
            let data;
            if (useDatabase) {
              const response = await fetch(`http://localhost:5000/api/overview/last-month-data?end=${date}`);
              data = await response.json();
              data = data.data;
            } else {
              data = generateMockLastMonthData(date);
            }         
            setLastMonthCost(data.cost);
            setLastMonthRevenue(data.revenue);
            setLastMonthQuantity(data.quantity);
            setLastMonthProfit(data.profit);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchLastMonthData();
}, [date]);


  // dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("");
  const [dialogDescription, setDialogDescription] = React.useState("");
  const handleClickOpen = async (id) => {
    try {
      if (useDatabase) {
      const response = await axios.get(`http://localhost:5000/api/ai-insights/overview?id=${id}&&end=${date}`);
      setDialogDescription(response.data.data);
      } else {
        switch (id){
          case "sku":
            setDialogDescription(generateMockKPIInsights(uniqueSKUs,uniqueSKUsInterval, 86, 0).sku);
            break;
          case "cost":
            setDialogDescription(generateMockKPIInsights(costData,costInterval, costValue, calculatePercentageChange(costValue,lastMonthCost)).cost);
            break;
          case "profit":
            setDialogDescription(generateMockKPIInsights(profitData,profitInterval, revenueValue - costValue, calculatePercentageChange(revenueValue - costValue,lastMonthProfit)).profit);
            break;
          case "quantity":
            setDialogDescription(generateMockQuantityInsights(quantitySeries,quantityInterval, quantityValue, calculatePercentageChange(quantityValue,lastMonthQuantity)));
            break;
          case "revenue":
            setDialogDescription(generateMockRevenueInsights(revenueSeries, revenueValue, calculatePercentageChange(revenueValue,lastMonthRevenue)));
            break;
          case "best":
            setDialogDescription(generateMockBestSellingInsights(bestRows));
            break;
          case "worst":
            setDialogDescription(generateMockWorstSellingInsights(worstRows));
            break;
          default:
            break
        }
      }
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
          <KPICard id="sku" title = "Total Sold Unique SKU" value = {humanizeNumber(86)}  changeAmount={0} interval = {uniqueSKUsInterval} data = {uniqueSKUs} handleClickOpen={handleClickOpen}/>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard id="cost" title = "Total Cost" value = {humanizeNumber(costValue)}  changeAmount={calculatePercentageChange(costValue,lastMonthCost)} interval = {costInterval} data = {costData} handleClickOpen={handleClickOpen}/>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard id="profit" title = "Gross Profit" value = {humanizeNumber(revenueValue - costValue)}  changeAmount={calculatePercentageChange(revenueValue - costValue,lastMonthProfit)} interval = {profitInterval} data = {profitData} handleClickOpen={handleClickOpen}/>
        </Grid2>       
        <Grid2 size={{ xs: 12, md: 6 }}>
          <LineGraph id = "quantity" title = "Total Sold Quantities of All Stock and Menu Items" value = {humanizeNumber(quantityValue)} description = "Last 30 days" interval = {quantityInterval} series = {quantitySeries} chipValue={calculatePercentageChange(quantityValue,lastMonthQuantity)} handleClickOpen={handleClickOpen}/>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <BarGraph id = "revenue" title = "Total Revenue of all Stock and Menu Items" value={humanizeNumber(revenueValue)} interval={['Stock','Menu']} description = "Last 30 days" series= {revenueSeries} chipValue={calculatePercentageChange(revenueValue,lastMonthRevenue)} handleClickOpen={handleClickOpen}/>
        </Grid2>
      </Grid2>
      <Stack
        direction="row"
        spacing={2}  // Adds some space between the elements
        sx={{ alignItems: 'center', mb: 2}}  // Vertically centers the items
      >
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Best Selling Items (Last 30 days)
        </Typography>
        <Tooltip title="click to see AI insights" placement="right" arrow enterDelay={500} leaveDelay={200}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            endIcon={<ChevronRightRoundedIcon />}
            fullWidth={isSmallScreen}
            onClick={() => handleClickOpen("best")}
          >
            Get insights
          </Button>
        </Tooltip>
      </Stack>  
      <Grid2 container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, lg: 9 }}>
          <Table rows={bestRows} columns={columns} />
        </Grid2>
      </Grid2>
      <Stack
        direction="row"
        spacing={2}  // Adds some space between the elements
        sx={{ alignItems: 'center', mb: 2}}  // Vertically centers the items
      >
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Worst Selling Items (Last 30 days)
        </Typography>
        <Tooltip title="click to see AI insights" placement="right" arrow enterDelay={500} leaveDelay={200}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            endIcon={<ChevronRightRoundedIcon />}
            fullWidth={isSmallScreen}
            onClick={() => handleClickOpen("worst")}
          >
            Get insights
          </Button>
        </Tooltip>       
      </Stack>
      <Grid2 container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, lg: 9 }}>
          <Table rows={worstRows} columns={columns} />
        </Grid2>
      </Grid2>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
