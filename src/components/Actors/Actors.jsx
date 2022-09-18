import { useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';

import { useGetActorDetailsQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import { MovieList, Pagination } from '..';

import useStyle from './style';

const Actors = () => {
  const { id } = useParams();
  const {
    data: actor,
    isFetching: isActorFetching,
    error: actorError,
  } = useGetActorDetailsQuery(id);
  const [page, setPage] = useState(1);

  const classes = useStyle();
  const history = useHistory();

  const {
    data: movies,
    // isFetching: isMoviesFetching,
  } = useGetMoviesByActorIdQuery({ actorId: id, page });

  const goBack = () => {
    history.goBack();
  };

  if (isActorFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (actorError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" md="20px">
        <Button startIcon={<ArrowBack />} onClick={goBack} color="primary">Go back</Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {/* Actor Poster */}
        <Grid item sm={12} lg={5} xl={4}>
          <img
            className={classes.image}
            alt={actor.name}
            src={`https://image.tmdb.org/t/p/w780/${actor?.profile_path}`}
          />
        </Grid>
        {/* Actor detail */}
        <Grid item className={classes.details} lg={7} xl={8}>
          <Typography variant="h2" gutterBottom>
            {actor?.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Born: {new Date(actor?.birthday).toDateString()}
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            {actor?.biography || 'Sorry, no biography yet ...'}
          </Typography>
          {/* Buttons action */}
          <Box className={classes.buttonsContainer}>
            <Button target="_blank" color="primary" variant="contained" href={`https://www.imdb.com/name/${actor?.imdb_id}`}>IMDB</Button>
            <Button
              startIcon={<ArrowBack />}
              onClick={goBack}
              color="primary"
            >
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
      {/* Recommendations */}
      <Box margin="2rem 0">
        <Typography variant="h2" gutterBottom align="center"> Movies
          {movies && <MovieList movies={movies} numberOfMovies={12} />}
        </Typography>
        <Pagination currentPage={page} setPage={setPage} totalPAges={movies?.total_pages} />
      </Box>
    </>
  );
};

export default Actors;
