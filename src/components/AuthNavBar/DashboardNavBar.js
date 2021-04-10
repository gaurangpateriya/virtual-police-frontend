import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'tachyons';
import './AuthNavBar.css';
import Dashboard from '@material-ui/icons/Dashboard';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import Whatshot from '@material-ui/icons/Whatshot';
import LibraryBooks from '@material-ui/icons/LibraryBooks';

const links = [
  {
    icon: <Dashboard />,
    name: 'DashBoard',
    to: '/dashboard',
  },
  {
    icon: <LibraryBooks />,
    name: 'My Academics',
    to: '/academics',
  },
  {
    icon: <Whatshot />,
    name: 'Leaderboards',
    to: '/leaderboard',
  },
  {
    icon: <QuestionAnswer />,
    name: 'Question Forum',
    to: '/question-forum',
  },
  {
    icon: <SupervisorAccount />,
    name: 'Peer Review',
    to: '/review',
  },
];
const DashboardNavBar = (props) => {
  const [pathname, setPathname] = useState(null);
  useEffect(() => {
    setPathname(window.location.pathname);
  }, [props.user]);

  return (
    <nav className='dashboard-nav-bar'>
      {links.map((l,i) => (
        <Link key={i} to={l.to} className={pathname === l.to ? 'link active' : 'link'}>
          <div className='icon'>{l.icon}</div>
          <div className='name'>{l.name}</div>
        </Link>
      ))}
    </nav>
  );
};

export default DashboardNavBar;
