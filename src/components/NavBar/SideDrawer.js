import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import './NavBar.css';


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function TemporaryDrawer({ linkList }) {
  const classes = useStyles();
  const [state, setState] = React.useState({ top: false });

  const toggleDrawer = open => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, top: open });
  };

  const list = linkList => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: true,
      })}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <ul className="side-drawer-links">
        {linkList.map((item, index) => (
          <li button key={item} style={{ textAlign: 'center' }}>
            <Link to={item.to}>
              {' '}
              {item.name}
              {' '}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );

  return (
    <>
      <button type="button" className="menu-icon" onClick={toggleDrawer(true)}>
        {' '}
        <MenuIcon />
        {' '}
      </button>
      <Drawer anchor="top" open={state.top} onClose={toggleDrawer(false)}>
        {list(linkList)}
      </Drawer>
    </>
  );
}
