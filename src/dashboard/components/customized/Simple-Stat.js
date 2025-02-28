import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function SimpleStatCard({ title, value }) {
  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

SimpleStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default SimpleStatCard;
