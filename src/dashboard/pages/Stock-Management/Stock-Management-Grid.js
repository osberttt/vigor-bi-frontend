import React, { useState, useEffect, use } from 'react';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';
import Table from '../../components/customized/Table';
import { Chip } from '@mui/material';


export default function StockGrid() {

    function renderDeficit(value) {
        let color = 'error'
        if (value <= 0){
            color = 'success';
            value = 'Above the level'
        }
      
        return <Chip label={value} color={color} size="small" />;
      }

  const columns = [
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
      field: 'quantityAvailable',
      headerName: 'Quantity Available',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 80,
    },
    {
      field: 'stockLevelThreshold',
      headerName: 'Stock Level Threshold',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      minWidth: 100,
    },
    {
        field: 'quantityDeficit',
        headerName: 'Quantity Deficit',
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => renderDeficit(params.value),
      }
  ];
  // Stock Table
  const [stockRows, setStockRows] = useState([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the best-selling items data
        const response = await fetch('http://localhost:5000/api/stock-management/table');
        const data = await response.json();
        
        let rows = [];
        
        // Loop through the best-selling items
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];

          // Push the item with its daily sales data and additional information to rows
          rows.push({
            id: i + 1,
            rank: i + 1,
            sku: item.sku,
            itemName: item.name,
            category: item.category,
            quantityAvailable: item.quantityAvailable,
            stockLevelThreshold: item.stockLevelThreshold,
            quantityDeficit: item.stockLevelThreshold - item.quantityAvailable,
          });
        }

        // Update the state with the populated rows
        setStockRows(rows);

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
        Stock Items
      </Typography>     
      <Grid2 container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, lg: 9 }}>
          <Table rows={stockRows} columns={columns} />
        </Grid2>
      </Grid2>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
