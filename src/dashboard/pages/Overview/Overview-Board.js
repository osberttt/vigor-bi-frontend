import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import OverviewGrid from './Overview-Grid';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from '../../components/CustomDatePicker';
import NavbarBreadcrumbs from '../../components/NavbarBreadcrumbs';
import MenuButton from '../../components/MenuButton';
import ColorModeIconDropdown from '../../../shared-theme/ColorModeIconDropdown';
import dayjs from 'dayjs';
import Search from '../../components/Search';
import { Button, Snackbar, Typography } from '@mui/material';
import { useState } from 'react';
import { topStockItems } from '../../data/stock';

export default function OverviewBoard({useDatabase}) {
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  
    const handleDateChange = (newDate) => {
      console.log('Selected Date:', newDate.format('YYYY-MM-DD'));
      // Perform any action here
    };
  
  const [open, setOpen] = useState(false);
    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  return (
    <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Snackbar
            open={open}
            message={
              <>
                <Typography variant="h6" color="error">
                  Attention: Low Stock Alert!
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  The following items are below the stock level threshold and require immediate restocking:
                </Typography>
                {topStockItems.slice(0, 5).map((item, index) => (
                  <Typography key={index} variant="body2" color="textSecondary">
                    {item.itemName}: {Math.abs(item.quantityDeficit)} units below stock level threshold
                  </Typography>
                ))}
              </>
            }
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",   // Position the Snackbar at the top
              horizontal: "right", // Position the Snackbar at the right
            }}
            sx={{
              pt: 5
            }}
          />
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Stack
              direction="row"
              sx={{
                display: { xs: 'none', md: 'flex' },
                width: '100%',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                pt: 1.5,
              }}
              spacing={2}
            >
              <NavbarBreadcrumbs pageName="Overview"/>
              <Stack direction="row" sx={{ gap: 1 }}>
                <CustomDatePicker value={selectedDate} setValue={setSelectedDate} onDateChange={handleDateChange} />
                <Button onClick={handleClick}>
                  <MenuButton showBadge aria-label="Open notifications">
                    <NotificationsRoundedIcon />
                  </MenuButton>
                </Button>
                <ColorModeIconDropdown />
              </Stack>
            </Stack>
            <OverviewGrid date = {selectedDate.format('YYYY-M-D')} useDatabase={useDatabase}/>
          </Stack>
    </Box>
  );
}
