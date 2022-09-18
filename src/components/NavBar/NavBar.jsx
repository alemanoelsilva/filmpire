import { useEffect, useState, useContext } from 'react';
import { AppBar, IconButton, Toolbar, Drawer, Button, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { Menu, AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { Sidebar, Search } from '..';
import { setUser, userSelector } from '../../features/user-auth';

import { createSessionId, fetchToken, moviesApi } from '../../utils';
import { ColorModeContext } from '../../utils/ToggleColorMode';

import useStyles from './style.js';

const NavBar = () => {
  const { isAuthenticated, user } = useSelector(userSelector);
  const [mobileOpen, setMobileOpen] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  // more than 600px is desktop, less is mobile
  const isMobile = useMediaQuery('(max-width:600px)');

  const colorMode = useContext(ColorModeContext);

  const token = localStorage.getItem('request_token');
  const localSessionId = localStorage.getItem('session_id');

  // useEffect is executed when the component has any update (update/mounted/unmounted ...)
  useEffect(() => {
    const logInUser = async () => {
      if (token) {
        let sessionId = localSessionId;
        if (!localSessionId) {
          sessionId = await createSessionId();
        }
        const { data: userData } = await moviesApi.get(`/account?session_id=${sessionId}`);

        dispatch(setUser(userData));
      }
    };

    logInUser();
    // only run the function when "token" is updated
  }, [token]);

  return (
    <>
      {/* Header */}
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          {/* menu */}
          { isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              style={{ outline: 'none' }}
              onClick={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
          )}

          {/* theme button */}
          <IconButton
            color="inherit"
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
          >
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Searching web */}
          { !isMobile && <Search />}

          {/* Profile button */}
          <div>
            {!isAuthenticated ? (
              <Button
                color="inherit"
                onClick={fetchToken}
              >
                Login &nbsp; <AccountCircle />
              </Button>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to={`/profile/${user.id}`}
                className={classes.linkButton}
                onClick={() => {}}
              >
                {!isMobile && <>My Movies &nbsp;</>}
                <Avatar
                  style={{ width: 30, height: 30 }}
                  alt="Profile"
                  src="https://www.salisburyut.com/wp-content/uploads/2020/09/avatar-1-scaled.jpeg"
                />
              </Button>
            )}
          </div>
          {/* Searching mobile */}
          { isMobile && <Search /> }

        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <div>
        <nav className={classes.drawer}>
          {isMobile ? (
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              className={classes.drawerBackground}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}
            >
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          ) : (
            <Drawer
              classes={{ paper: classes.drawerPaper }}
              variant="permanent"
              open
            >
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          )}
        </nav>
      </div>
    </>

  );
};

export default NavBar;
