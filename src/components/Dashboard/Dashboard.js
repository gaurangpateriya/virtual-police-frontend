import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AuthNavBar from '../AuthNavBar/AuthNavBar';
import clsx from 'clsx';

import './Dashboard.css';

import SosGraph from './SosGraph';
import FirOverView from './FirOverView';

import { shiftStyles } from '../../common/commonUseStyles';
import EmployeeOverView from './EmployeeOverView';
import NocOverView from './NocOverView';
import SafeTravelOverview from './SafeTravelOverview';
// import { Link } from 'react-router-dom';



const Dashboard = (props) => {
  const classes = shiftStyles();

  const drawerOpen = useSelector(state => state.common.drawerOpen)


  useEffect(() => {


  }, []);

  return (
    <>
      <AuthNavBar />
      <div className="root-bg">
        <div className={'dashboard-div ' + clsx(classes.appBar, { [classes.appBarShift]: drawerOpen })}>
          <div className='left'>

            <SosGraph />
            <SafeTravelOverview />
            <FirOverView />
          </div>
          <div className='right'>
            <EmployeeOverView />
            <NocOverView />
          </div>

        </div>
      </div>

    </>
  );
};

export default Dashboard;
