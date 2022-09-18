import { useState, useEffect } from 'react';
import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, useMediaQuery, Rating } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { useGetMovieQuery, useGetRecommendationsQuery, useGetListQuery } from '../../services/TMDB';
import genreIcons from '../../assets/genres';
import { selectGenreOrCategory } from '../../features/current-genre-or-category';
import { userSelector } from '../../features/user-auth';

import { MovieList } from '..';
import useStyle from './style';

const MovieInformation = () => {
  const classes = useStyle();

  const { id: movieId } = useParams();
  const {
    data: movie,
    isFetching: isMovieFetching,
    error: movieError,
  } = useGetMovieQuery(movieId);

  const dispatch = useDispatch();

  const { user } = useSelector(userSelector);

  const isMobile = useMediaQuery('(max-width:600px)');

  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  const sessionId = localStorage.getItem('session_id');

  const {
    data: recommendations,
    // isFetching: isRecommendationsFetching,
  } = useGetRecommendationsQuery({ list: '/recommendations', movieId });

  const { data: favoriteMovies } = useGetListQuery({
    listName: 'favorite/movies',
    accountId: user.id,
    sessionId,
    page: 1,
  });

  const { data: watchlistMovies } = useGetListQuery({
    listName: 'watchlist/movies',
    accountId: user.id,
    sessionId,
    page: 1,
  });

  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((favoriteMovie) => favoriteMovie?.id === movie?.id));
  }, [favoriteMovies, movie]);

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((watchlistMovie) => watchlistMovie?.id === movie?.id));
  }, [watchlistMovies, movie]);

  // * not using redux to not make those functions below global
  const addToFavorites = async () => {
    const tmdbApikey = process.env.REACT_APP_TMDB_API_KEY;
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${tmdbApikey}&session_id=${sessionId}`, {
      media_type: 'movie',
      media_id: movieId,
      favorite: !isMovieFavorited,
    });

    setIsMovieFavorited((prev) => !prev);
  };

  const addToWatchlist = async () => {
    const tmdbApikey = process.env.REACT_APP_TMDB_API_KEY;
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${tmdbApikey}&session_id=${sessionId}`, {
      media_type: 'movie',
      media_id: movieId,
      watchlist: !isMovieWatchlisted,
    });

    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isMovieFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  if (movieError) {
    return (
      <Box display="flex" alignItems="center" mt="20px">
        <Link to="/">Something has gone wrong</Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      {/* Movie Poster */}
      <Grid item sm={12} lg={4} style={{ display: 'flex', width: '300px', marginBottom: '30px' }}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
        />
      </Grid>
      {/* //* Movie Details */}
      <Grid item container direction="column" lg={7}>
        {/* Movie Title */}
        <Typography variant="h3" align="center" gutterBottom>
          {movie?.title} ({movie.release_date.split('-')[0]})
        </Typography>
        {/* Movie Description */}
        <Typography variant="h5" align="center" gutterBottom>
          {movie?.tagline}
        </Typography>
        {/* Rating and language */}
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={movie.vote_average / 2} />
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: '10px' }}>
              {movie?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant={isMobile ? 'h6' : 'h7'} align="center" gutterBottom>
            {movie?.runtime}min | Language: {movie?.spoken_languages[0].name}
          </Typography>
        </Grid>
        {/* Genres */}
        <Grid item className={classes.genresContainer}>
          {movie?.genres?.map((genre) => (
            <Link
              key={genre.name}
              className={classes.links}
              to="/"
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
              <img src={genreIcons[genre.name.toLowerCase()]} className={classes.genreImage} height={30} alt={genre.name} style={{ justifyContent: 'center' }} />
              <Typography color="textPrimary" variant="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        {/* Overview */}
        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {movie?.overview}
        </Typography>
        {/* Top Cast */}
        <Typography variant="h5" gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {movie && movie.credits.cast
            .filter((character) => character.profile_path) // get only actor with photo
            .slice(0, 6) // get only the first 6 actors
            .map((character, index) => (
              <Grid key={index} item xs={4} md={2} component={Link} to={`/actors/${character.id}`} style={{ textDecoration: 'none' }}>
                <img
                  className={classes.castImage}
                  src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                  alt={character.name}
                />
                <Typography color="textPrimary">
                  {character?.name}
                </Typography>
                <Typography color="secondary">
                  {character?.character.split('/')[0]}
                </Typography>
              </Grid>
            ))}
        </Grid>
        {/* Action Buttons */}
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="small" variant="outlined">
                <Button target="_blank" rel="noopener noreferrer" href={movie?.homepage} endIcon={<Language />}>Website</Button>
                <Button target="_blank" rel="noopener noreferrer" href={`https://www.imdb.com/title/${movie?.imdb_id}`} endIcon={<MovieIcon />}>IMDB</Button>
                {/* setOpen to open the modal when button is clicked */}
                <Button onClick={() => setOpen(true)} href="#" endIcon={<Theaters />}>Trailer</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  onClick={addToFavorites}
                  href="#"
                  endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}
                >
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite' }
                </Button>
                <Button
                  onClick={addToWatchlist}
                  href="#"
                  endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}
                >
                  {isMovieWatchlisted ? 'Watchlist' : 'Watchlist' }
                </Button>
                <Button
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: 'primary.main' }}
                >
                  <Typography component={Link} to="/" color="inherit" variant="subtitle2" style={{ textDecoration: 'none' }}>
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      {/* Recommendations */}
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {/* Movies Recommendations */}
        {recommendations ? <MovieList movies={recommendations} numberOfMovies={12} /> : <Box>Sorry, nothing was found</Box>}
      </Box>
      {/* Trailer Modal */}
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {/* Trailer Video */}
        {movie?.videos?.results?.length > 0 && (
          <iframe
            autoPlay
            className={classes.video}
            frameBorder="0"
            title="Trailer"
            src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
            allow="autoplay"
          />
        )}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;
