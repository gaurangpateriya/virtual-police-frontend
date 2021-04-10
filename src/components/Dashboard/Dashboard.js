import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavBar from '../AuthNavBar/AuthNavBar';
import clsx from 'clsx';
import Loader from '../../common/components/Loader';
import './Dashboard.css';
import agent from '../../agent';
import SosGraph from './SosGraph';
import FirOverView from './FirOverView';

import { shiftStyles } from '../../common/commonUseStyles';
import EmployeeOverView from './EmployeeOverView';
// import { Link } from 'react-router-dom';



const Dashboard = (props) => {
  const classes = shiftStyles();

  const user = useSelector((state) => state.common.user);
  const drawerOpen = useSelector(state => state.common.drawerOpen)
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {


  }, []);

  return (
    <>
      <AuthNavBar />
      <div className="root-bg">
        <div className={'dashboard-div ' + clsx(classes.appBar, { [classes.appBarShift]: drawerOpen })}>
          <div className='left'>

            <SosGraph />
            <FirOverView />
          </div>
          <div className='right'>
            <EmployeeOverView />
          </div>

        </div>
      </div>

    </>
  );
};

export default Dashboard;
