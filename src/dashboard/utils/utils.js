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
  
  export function renderSparklineCell(params, data) {
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

  export function humanizeNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M'; // For millions
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k'; // For thousands
    } else {
      return number.toString(); // Return the number as it is if it's less than 1000
    }
  }

  export function calculatePercentageChange(thisMonth, lastMonth) {
      if (lastMonth === 0) {
        return thisMonth === 0 ? 0 : 100; // Handle case where last month's value is 0
      }
      const change = ((thisMonth - lastMonth) / lastMonth) * 100;
      return parseFloat(change.toFixed(2));
    }  

    export function humanizeDate(dateString) {
      const date = new Date(dateString); // Create Date object from string
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }