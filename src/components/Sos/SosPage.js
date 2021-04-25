import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavBar from '../AuthNavBar/AuthNavBar';
import clsx from 'clsx';
import Loader from '../../common/components/Loader';
import './SosPage.css';
import agent from '../../agent';

import { shiftStyles } from '../../common/commonUseStyles';

import { GET_SOS } from '../../constants/actionTypes';

import moment from 'moment';
import { convertDMS } from '../../common/functions';
// import { Link } from 'react-router-dom';



const Sos = ({ sos: tempSos }) => {

  const sos = { ...tempSos, startLocation: JSON.parse(tempSos.startLocation) }
  return (
    <div className='sos' >
      <div className='header'>
        <p> Status: {sos.status} </p>

        <p> Date: {moment(sos.createdAt).format("DD-MMM-YYYY")} </p>
      </div>

      <div className='flex w-100'>
        <div className=' w-50' >
          <h4>Raised By: </h4>
          {
            sos.User && (
              <>
                <p className=''> {sos.User.name}</p>
                <p className=''>{sos.User.mobileNo}</p>
                <p className=''>Location:
                  <a
                    target='_blank'
                    className='ml2 white'
                    href={`https://www.google.co.in/maps/place/${convertDMS(sos.startLocation.latitude, sos.startLocation.longitude)}/`}>
                    See on Map
                  </a>
                </p>

              </>
            )
          }

        </div>
        <div className='w-50' >
          <h4>Helping Officer: </h4>
          {
            sos.Employee ? (
              <>
                <p className=''> {sos.Employee.name}</p>
                <p className=''>{sos.Employee.mobileNo}</p>
                <p> Officer's Response: {sos.employeeResponse} </p>
              </>
            ) : (
              <p className=''>No officer is assigned</p>
            )
          }
        </div>
      </div>



    </div >
  )
}


const SosPage = (props) => {
  const classes = shiftStyles();

  const sosRequests = useSelector(state => state.SosReducers.sosRequests)

  const drawerOpen = useSelector(state => state.common.drawerOpen)
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await agent.SosPage.getSos()
        dispatch({ type: GET_SOS, payload: res.data.data })
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error, error.response)
      }
    })()
  }, []);

  return (
    <>
      <AuthNavBar />

      <div className="root-bg">
        <div className={`sos-page-div ${clsx(classes.appBar, { [classes.appBarShift]: drawerOpen, })}`}>
          <div className='header'>
            <h3>
              All SOS Requests
            </h3>
          </div>
          <div className='sos-div'>
            {
              sosRequests && sosRequests.map(f => <Sos sos={f} key={f.id} />)
            }
          </div>
          {
            loading && <Loader />
          }
        </div>

      </div>
    </>
  );
};

export default SosPage;
