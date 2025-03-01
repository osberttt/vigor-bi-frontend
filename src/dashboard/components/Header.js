import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import dayjs from 'dayjs';
import Search from './Search';

export default function Header({pageName}) {

  const [selectedDate, setSelectedDate] = React.useState(dayjs());

  const handleDateChange = (newDate) => {
    console.log('Selected Date:', newDate.format('YYYY-MM-DD'));
    // Perform any action here
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
      <NavbarBreadcrumbs pageName={pageName}/>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <CustomDatePicker value={selectedDate} setValue={setSelectedDate} onDateChange={handleDateChange} />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
