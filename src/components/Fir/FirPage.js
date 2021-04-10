import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavBar from '../AuthNavBar/AuthNavBar';
import clsx from 'clsx';
import Loader from '../../common/components/Loader';
import './FirPage.css';
import agent from '../../agent';


import { shiftStyles } from '../../common/commonUseStyles';

import { GET_FIRS } from '../../constants/actionTypes'
import moment from 'moment';
import { useHistory, useLocation } from 'react-router';
import { colors, firStatus } from '../../constants/otherConstants';
// import { Link } from 'react-router-dom';

const Fir = ({ fir }) => {
  const history = useHistory();
  return (
    <div className='fir pointer' onClick={() => history.push(`/firDetails/${fir.id}`)}>
      <div className='header'>
        <p> Status: {fir.status} </p>
        <p> Date: {moment(fir.createdAt).format("DD-MMM-YYYY")} </p>
      </div>
      <h4 className='mt2 block'>Complaint: ( {fir.crimeNature} )</h4>
      <p>  {fir.complaint}  </p>

      <div className=' flex items-center' >
        <h4>Filed By: </h4>
        <p className='ml2'> {fir.User.name}</p>
        <p className='ml2'>{fir.User.mobileNo}</p>
      </div>
      <div className=' flex items-center' >
        <h4>Investigating Officer: </h4>
        {
          fir.Employee ? (
            <>
              <p className='ml2'> {fir.Employee.name}</p>
              <p className='ml2'>{fir.Employee.mobileNo}</p>
            </>
          ) : (
            <p className='ml2'>No officer is assigned</p>
          )
        }
      </div>
      <p className='mt0 mb0  primary-btn w-10 pa2' style={{ marginLeft: 'auto' }}>See details</p>
    </div >
  )
}



const FirPage = ({ location: { search } }) => {
  const classes = shiftStyles();

  const firs = useSelector(state => state.FirReducers.firs)
  const [filters, setFilters] = useState("")
  const drawerOpen = useSelector(state => state.common.drawerOpen)
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {

        setLoading(true);

        if (search) {

          setFilters(search.substring(0).split("=")[1])
          const res = await agent.Firs.getFilteredFirs(search)
          dispatch({ type: GET_FIRS, payload: res.data.data })

        } else {
          const res = await agent.Firs.getFirs()
          dispatch({ type: GET_FIRS, payload: res.data.data })
          setFilters("")
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error, error.response)
      }
    })()
  }, [search]);

  const chooseFilter = (newFilter) => {

    if (newFilter) {
      if (newFilter === filters) {
        history.push(`/firs`)
      } else {
        let searchString = `?status=${newFilter}`
        history.push(`/firs${searchString}`)
      }
    }
  }

  return (
    <>
      <AuthNavBar />

      <div className="root-bg">
        <div className={`fir-page-div ${clsx(classes.appBar, { [classes.appBarShift]: drawerOpen, })}`}>
          <div className='header'>
            <h3>
              FIRs
            </h3>
            <div
              className='flex items-center'
            >
              {
                Object.keys(firStatus).map((s, i) => (
                  <button
                    type='button'
                    className='ba br4 ml2 pa2  f7'
                    onClick={() => chooseFilter(firStatus[s])}
                    style={{
                      backgroundColor: firStatus[s] === filters ? colors.dark.primaryColor : ''
                    }}
                  >
                    {firStatus[s]}
                  </button>
                ))
              }
            </div>
          </div>
          <div className='firs-div'>
            {
              firs.length ? firs.map(f => <Fir fir={f} key={f.id} />) : (
                <p>No FIR present</p>
              )
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

export default FirPage;
