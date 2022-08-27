import { CssBaseline } from '@mui/material';
import { Route, Switch } from 'react-router-dom';

import useStyles from './style';

import { Actors, Movies, MovieInformation, NavBar, Profile } from '.';

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <NavBar />
        <Switch>
          <Route exact path="/movies/:id">
            <MovieInformation />
          </Route>
          <Route exact path="/actors/:id">
            <Actors />
          </Route>
          <Route exact path="/">
            <Movies />
          </Route>
          <Route exact path="/profile/:id">
            <Profile />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default App;
