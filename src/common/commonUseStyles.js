

import { makeStyles } from '@material-ui/core/styles';
import { colors, drawerWidth, } from '../constants/otherConstants';

// import { Link } from 'react-router-dom';

export const shiftStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    marginLeft: theme.spacing(9) + 1,
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
}));


export const dialogStyles = makeStyles((theme) => ({
  root: {
    color: colors.dark.background
  },

}));

