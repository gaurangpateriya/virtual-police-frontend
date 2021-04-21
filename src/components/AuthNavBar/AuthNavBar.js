import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'tachyons';
import './AuthNavBar.css';
import { APP_NAME, colors, drawerWidth } from '../../constants/otherConstants';
import logo from '../../assets/Images/logo_short.png';
import { LOGOUT, TOGEL_DRAWER } from '../../constants/actionTypes';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import GroupSharpIcon from '@material-ui/icons/GroupSharp';
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from '@material-ui/icons/Menu';
import DescriptionIcon from '@material-ui/icons/Description';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';

import NotesIcon from '@material-ui/icons/Notes';
import { push } from 'react-router-redux';
import { useLocation } from 'react-router';

const { background, primaryColor, lighBackground } = colors.dark

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {

  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: lighBackground,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),

  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: lighBackground,
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));



function AuthNavBar() {
  const classes = useStyles();
  const theme = useTheme();
  const { pathname } = useLocation();
  const drawerOpen = useSelector(state => state.common.drawerOpen)
  const dispatch = useDispatch()

  const links = [
    { text: 'Dashboard', icon: <DashboardIcon style={{ fill: pathname === '/dashboard' ? background : primaryColor }} />, onClick: () => dispatch(push('/dashboard')), link: '/dashboard' },
    { text: 'SOS', icon: <ThumbsUpDownIcon style={{ fill: pathname === '/sos-requests' ? background : primaryColor }} />, onClick: () => dispatch(push('/sos-requests')), link: '/sos-requests' },
    { text: 'Employees', icon: <GroupSharpIcon style={{ fill: pathname === '/employees' ? background : primaryColor }} />, onClick: () => dispatch(push('/employees')), link: '/employees' },
    { text: 'FIRs', icon: <NotesIcon style={{ fill: pathname === '/firs' ? background : primaryColor }} />, onClick: () => dispatch(push('/firs')), link: '/firs' },
    { text: 'NOC Applications', icon: <DescriptionIcon style={{ fill: pathname === '/nocs' ? background : primaryColor }} />, onClick: () => dispatch(push('/nocs')), link: '/nocs' },
    { text: 'Logout', icon: <ExitToAppSharpIcon style={{ fill: pathname === '' ? background : primaryColor }} />, onClick: () => dispatch({ type: LOGOUT }) },

  ]

  const handleDrawerOpen = () => {
    dispatch({ type: TOGEL_DRAWER, payload: true })
  };

  const handleDrawerClose = () => {
    dispatch({ type: TOGEL_DRAWER, payload: false })

  };

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          }),
        }}
      >
        <img style={{ width: '60%', margin: '10px auto' }} src={logo} />

        <h2 className='center' style={{ opacity: drawerOpen ? 1 : 0, transition: '0.3s' }} >{APP_NAME}</h2>


        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: drawerOpen,
          })}
        >
          <ChevronRightIcon />
        </IconButton>
        {drawerOpen && (
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
        )}

        <Divider />
        <List>
          {links.map((l) => (
            <ListItem button key={l.text} onClick={l.onClick} style={{ backgroundColor: pathname === l.link ? primaryColor : "" }} >
              <ListItemIcon  >{l.icon}</ListItemIcon>
              <ListItemText primary={l.text} />
            </ListItem>
          ))}
        </List>
        <Divider />

      </Drawer>

    </div>
  );
}


export default AuthNavBar;
