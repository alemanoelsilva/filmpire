import { makeStyles } from '@mui/styles';

const drawerWidth = '240px';

export default makeStyles((theme) => ({
  toolbar: {
    height: '80px',
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '240px',
    // mobile device only
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      flexWrap: 'wrap',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    // desktop device only
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawer: {
    // desktop device only
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  linkButton: {
    // to apply hover
    '&:hover': {
      color: 'white !important',
      textDecoration: 'none',
    },
  },
}));
