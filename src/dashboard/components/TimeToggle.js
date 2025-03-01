import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

export default function TimeToggle({ onChange }) {
  const [timeFrame, setTimeFrame] = useState("months");

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setTimeFrame(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  return (
    <ToggleButtonGroup
      value={timeFrame}
      exclusive
      onChange={handleChange}
      aria-label="time frame toggle"
      sx={{ mb: 2 }}
    >
      <ToggleButton value="months" aria-label="months">
        <CalendarTodayRoundedIcon sx={{ mr: 1 }} />
        Month-Over-Month
      </ToggleButton>
      <ToggleButton value="years" aria-label="years">
        <CalendarMonthRoundedIcon sx={{ mr: 1 }} />
        Year-Over-Year
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
