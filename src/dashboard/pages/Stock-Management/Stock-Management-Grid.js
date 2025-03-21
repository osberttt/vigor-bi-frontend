import React, { useState, useEffect} from 'react';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../../internals/components/Copyright';
import Table from '../../components/customized/Table';
import { Chip, Tooltip } from '@mui/material';
import { generateMockStockData, generateStockInsights, mockStockData } from '../../data/stock';
import Stack from '@mui/material/Stack';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';


export default function StockGrid({useDatabase}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  function renderDeficit(value) {
    let color = 'error'
    if (value <= 0){
        color = 'success';
      }
    value = value * -1;
  
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
        let data;
        if (useDatabase) {
        // Fetch the best-selling items data
        const response = await fetch('http://localhost:5000/api/stock-management/table');
        data = await response.json();
        } else {
          data = mockStockData;
        }
        
        let rows = [];
        
        // Loop through the best-selling items
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];

          // Push the item with its daily sales data and additional information to rows
          rows.push({
            id: i + 1,
            sku: item.sku,
            itemName: item.itemName,
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

   // dialog
   const [dialogOpen, setDialogOpen] = React.useState(false);
   const [dialogTitle, setDialogTitle] = React.useState("");
   const [dialogDescription, setDialogDescription] = React.useState("");
   const handleClickOpen = async (id) => {
     try {
       if (useDatabase) {
        const response = await axios.get(`http://localhost:5000/api/ai-insights/stock`);
        setDialogDescription(response.data.data);
       } else {
         setDialogDescription(generateStockInsights());
       }
       setDialogTitle("Gemini AI Insights for Stock Items");
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
      <Stack
        direction="row"
        spacing={2}  // Adds some space between the elements
        sx={{ alignItems: 'center', mb: 2}}  // Vertically centers the items
      >
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Stock Items
        </Typography>
        <Tooltip title="click to see AI insights" placement="right" arrow enterDelay={500} leaveDelay={200}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            endIcon={<ChevronRightRoundedIcon />}
            fullWidth={isSmallScreen}
            onClick={() => handleClickOpen()}
          >
            Get insights
          </Button>
        </Tooltip>
      </Stack>       
      <Grid2 container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, lg: 9 }}>
          <Table rows={stockRows} columns={columns} />
        </Grid2>
      </Grid2>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
