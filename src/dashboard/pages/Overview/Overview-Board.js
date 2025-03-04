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

export default function OverviewBoard(props) {
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  
    const handleDateChange = (newDate) => {
      console.log('Selected Date:', newDate.format('YYYY-MM-DD'));
      // Perform any action here
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
                <Search />
                <CustomDatePicker value={selectedDate} setValue={setSelectedDate} onDateChange={handleDateChange} />
                <MenuButton showBadge aria-label="Open notifications">
                  <NotificationsRoundedIcon />
                </MenuButton>
                <ColorModeIconDropdown />
              </Stack>
            </Stack>
            <OverviewGrid date = {selectedDate.format('YYYY-M-D')}/>
          </Stack>
    </Box>
  );
}
