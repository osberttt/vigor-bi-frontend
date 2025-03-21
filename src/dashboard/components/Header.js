import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import { Button, Snackbar, Typography } from '@mui/material';
import { useState } from 'react';
import { topStockItems } from '../data/stock';

export default function Header({pageName}) {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
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
      <NavbarBreadcrumbs pageName={pageName}/>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Button onClick={handleClick}>
          <MenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </MenuButton>
        </Button>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
