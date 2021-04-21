import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavBar from '../AuthNavBar/AuthNavBar';
import clsx from 'clsx';
import Loader from '../../common/components/Loader';
import './NocPage.css';
import agent from '../../agent';


import { shiftStyles } from '../../common/commonUseStyles';

import { GET_NOCS } from '../../constants/actionTypes'
import moment from 'moment';
import { useHistory, useLocation } from 'react-router';
import { colors, nocStatus } from '../../constants/otherConstants';
// import { Link } from 'react-router-dom';

const Noc = ({ noc }) => {
  const history = useHistory();
  return (
    <div className='noc pointer' onClick={() => history.push(`/noc/${noc.id}`)}>
      <div className='header'>
        <p> Status: {noc.status} </p>
        <p> Application Date: {moment(noc.createdAt).format("DD-MMM-YYYY")} </p>
      </div>
      <h4 className='mt2 block'> {noc.name || noc.type}</h4>
      <p>   </p>

      <div className=' flex items-center' >
        <h4>Applied By: </h4>
        <p className='ml2'> {noc.User.name}</p>
        <p className='ml2'>{noc.User.mobileNo}</p>
      </div>

      <p className='mt0 mb0  primary-btn w-10 pa2' style={{ marginLeft: 'auto' }}>See details</p>
    </div >
  )
}



const NocPage = ({ location: { search } }) => {
  const classes = shiftStyles();

  const nocs = useSelector(state => state.NocReducers.nocs)
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
          const res = await agent.Nocs.getFilteredNocs(search)
          dispatch({ type: GET_NOCS, payload: res.data.data })

        } else {
          const res = await agent.Nocs.getNocs()
          dispatch({ type: GET_NOCS, payload: res.data.data })
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
        history.push(`/nocs`)
      } else {
        let searchString = `?status=${newFilter}`
        history.push(`/nocs${searchString}`)
      }
    }
  }

  return (
    <>
      <AuthNavBar />

      <div className="root-bg">
        <div className={`noc-page-div ${clsx(classes.appBar, { [classes.appBarShift]: drawerOpen, })}`}>
          <div className='header'>
            <h3>
              NOC Applications
            </h3>
            <div
              className='flex items-center'
            >
              {
                Object.keys(nocStatus).map((s, i) => (
                  <button
                    type='button'
                    className='ba br4 ml2 pa2  f7'
                    onClick={() => chooseFilter(nocStatus[s])}
                    style={{
                      backgroundColor: nocStatus[s] === filters ? colors.dark.primaryColor : ''
                    }}
                  >
                    {nocStatus[s]}
                  </button>
                ))
              }
            </div>
          </div>
          <div className='nocs-div'>
            {
              nocs && nocs.length ? nocs.map(f => <Noc noc={f} key={f.id} />) : (
                <p>No Noc present</p>
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

export default NocPage;
