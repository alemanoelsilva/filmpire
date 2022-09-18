import React from 'react';
import { Typography, Box } from '@mui/material';

import { Movie } from '..';
import useStyle from './style';

const RatedCards = ({ title, movies }) => {
  const classes = useStyle();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Box className={classes.container}>
        {movies?.results.map((movie, index) => (
          <Movie key={movie.id} movie={movie} index={index} />
        ))}
      </Box>
    </Box>
  );
};

export default RatedCards;
