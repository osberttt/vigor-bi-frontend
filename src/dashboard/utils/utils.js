import * as React from 'react';

import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export function getDaysInMonth(month, year) {
    const date = new Date(year, month, 0);
    const monthName = date.toLocaleDateString('en-US', {
      month: 'short',
    });
    const daysInMonth = date.getDate();
    const days = [];
    let i = 1;
    while (days.length < daysInMonth) {
      days.push(`${monthName} ${i}`);
      i += 1;
    }
    return days;
  }

  export function getMonthNames(locale = 'en-US') {
    return Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i).toLocaleString(locale, { month: 'long' })
    );
  }
  
  export function getShortMonthNames(locale = 'en-US') {
    return Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i).toLocaleString(locale, { month: 'short' })
    );
  }
  
  export function renderSparklineCell(params) {
    const data = getDaysInMonth(4, 2024);
    const { value, colDef } = params;
  
    if (!value || value.length === 0) {
      return null;
    }
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <SparkLineChart
          data={value}
          width={colDef.computedWidth || 100}
          height={32}
          plotType="bar"
          showHighlight
          showTooltip
          colors={['hsl(210, 98%, 42%)']}
          xAxis={{
            scaleType: 'band',
            data,
          }}
        />
      </div>
    );
  }