import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavBar from '../AuthNavBar/AuthNavBar';
import clsx from 'clsx';
import Loader from '../../common/components/Loader';
import './SafeTravelPage.css';
import agent from '../../agent';


import { shiftStyles } from '../../common/commonUseStyles';

import { GET_SAFE_TRAVELS } from '../../constants/actionTypes'
import moment from 'moment';
import { useHistory } from 'react-router';
import { colors, safeTravelStatus } from '../../constants/otherConstants';

import { convertDMS } from '../../common/functions';
import { urls } from '../../constants/pageUrls';


const SafeTravel = ({ safeTravel: tempSafeTravel }) => {
  const safeTravel = {
    ...tempSafeTravel,
    startLocation: JSON.parse(tempSafeTravel.startLocation),
    endLocation: JSON.parse(tempSafeTravel.endLocation),
    lastLocation: JSON.parse(tempSafeTravel.lastLocation)
  }
  let diff = moment(safeTravel.endDate || new Date()).diff(moment(safeTravel.createdAt), 'minutes')
  diff = diff % 60 // in hours

  return (
    <div className='safe-travel' style={{ border: safeTravel.status === safeTravelStatus.ACTIVE ? "5px solid #b3323b" : "" }} >
      <div className='header'>
        <p> Status: {safeTravel.status} </p>
        <p> Date: {moment(safeTravel.createdAt).format("DD-MMM-YYYY")} </p>
      </div>
      <div className=' flex '>
        <div className=' w-40' >
          <h2>User: </h2>
          {
            safeTravel.User && (
              <>
                <p> {safeTravel.User.name}</p>
                <p>{safeTravel.User.mobileNo}</p>
                <p>{safeTravel.User.address}</p>
                {
                  safeTravel.User.UserRelatives && safeTravel.User.UserRelatives.length > 0 && (
                    <>
                      <b>Emergency Contact numbers:</b>
                      {
                        safeTravel.User.UserRelatives.map(r => (
                          <p>{`${r.name},              ${r.mobileNo} `}</p>
                        ))
                      }
                    </>
                  )
                }
              </>
            )
          }

        </div>
        <div className=' w-30' >
          <h2>Travel Details: </h2>

          <p> <b>Vehicle Number: </b> {safeTravel.vehicleNumber}</p>

          <p>
            <b>Start Point:</b>
            <a
              target='_blank'
              className='ml2 white'
              href={`https://www.google.co.in/maps/place/${convertDMS(safeTravel.startLocation.latitude, safeTravel.startLocation.longitude)}/`}>
              See on Map
              </a>
          </p>
          <p>
            <b>End Point:</b>
            {
              safeTravel.endLocation ? (
                <a
                  target='_blank'
                  className='ml2 white'
                  href={`https://www.google.co.in/maps/place/${convertDMS(safeTravel.endLocation.latitude, safeTravel.endLocation.longitude)}/`}>

                  See on Map
                </a>
              ) : (
                <b className='red' >
                  Yet To reach
                </b>
              )
            }

          </p>
          <p>
            <b>Last Location:</b>
            {
              safeTravel.lastLocation ? (
                <a
                  target='_blank'
                  className='ml2 white'
                  href={`https://www.google.co.in/maps/place/${convertDMS(safeTravel.lastLocation.latitude, safeTravel.lastLocation.longitude)}/`}>

                  See on Map
                </a>
              ) : (
                <b className='red' >
                  Not Present
                </b>
              )
            }

          </p>
          <p>
            <b>Path :</b>
            {
              safeTravel.endLocation ? (
                <a
                  target='_blank'
                  className='ml2 white'
                  href={`https://www.google.com/maps/dir/${safeTravel.startLocation.latitude}, ${safeTravel.startLocation.longitude}/${safeTravel.endLocation.latitude}, ${safeTravel.endLocation.longitude}/`}
                >
                  See on Map
                </a>
              ) : (
                <p className='red b' >
                  Yet To reach
                </p>
              )
            }

          </p>
        </div>
        <div className=' w-30' >
          <h2>Timing Details: </h2>
          <p> <b>Start Time: </b> {moment(safeTravel.createdAt).format("DD-MMM-YYYY hh:mm A")}</p>
          <p> <b>End Time: </b> {
            safeTravel.endDate ? (
              moment(safeTravel.endDate).format("DD-MMM-YYYY hh:mm A")
            ) : (
              <b className='red b' >
                Yet To reach
              </b>
            )
          } </p>
          <div className='mt5 ba br3'>
            <p className='tc b f3 block' > Time Took For Journey:</p>
            <p style={{ color: colors.dark.primaryColor, fontSize: '1.5rem', textAlign: 'center' }} >
              {`${Math.round(diff / 60)} Hours ${diff % 60} Minutes`}
            </p>
          </div>
        </div>
      </div>
    </div >
  )
}



const SafeTravelPage = ({ location: { search } }) => {
  const classes = shiftStyles();
  const user = useSelector(state => state.common.user)

  const safeTravels = useSelector(state => state.SafeTravelReducers.safeTravels)
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
          search = search + `&&StationId=${user.StationId}`

          const res = await agent.SafeTravel.getSafeTravel(search)
          dispatch({ type: GET_SAFE_TRAVELS, payload: res.data.data })

        } else {
          let search = `?StationId=${user.StationId}`
          const res = await agent.SafeTravel.getSafeTravel(search)
          dispatch({ type: GET_SAFE_TRAVELS, payload: res.data.data })
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
        history.push(`${urls.SAFE_TRAVEL_PAGE}`)
      } else {
        let searchString = `?status=${newFilter}`
        history.push(`${urls.SAFE_TRAVEL_PAGE}${searchString}`)
      }
    }
  }

  return (
    <>
      <AuthNavBar />

      <div className="root-bg">
        <div className={`safe-travel-page-div ${clsx(classes.appBar, { [classes.appBarShift]: drawerOpen, })}`}>
          <div className='header'>
            <h3>
              Safe Travel Requests
            </h3>
            <div
              className='flex items-center'
            >
              {
                Object.keys(safeTravelStatus).map((s) => (
                  <button
                    type='button'
                    className='ba br4 ml2 pa2  f7'
                    onClick={() => chooseFilter(safeTravelStatus[s])}
                    style={{
                      backgroundColor: safeTravelStatus[s] === filters ? colors.dark.primaryColor : ''
                    }}
                  >
                    {safeTravelStatus[s]}
                  </button>
                ))
              }
            </div>
          </div>
          <div className='safe-travels-div'>
            {
              safeTravels && safeTravels.length ? safeTravels.map(f => <SafeTravel safeTravel={f} key={f.id} />) : (
                <p>No Requests present</p>
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

export default SafeTravelPage;
