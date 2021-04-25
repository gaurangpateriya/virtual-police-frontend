import React, { useState, useEffect } from 'react';
import Loader from '../../common/components/Loader';
import './Dashboard.css';
import agent from '../../agent';

import { useSelector } from 'react-redux';

import { nocStatus } from '../../constants/otherConstants'
import { useHistory } from 'react-router';
import { urls } from '../../constants/pageUrls'

export default () => {

  const [nocOverView, setNocOverView] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.common.user)

  const history = useHistory()

  useEffect(() => {
    (async () => {
      setLoading(true)
      const search = `?StationId=${user.StationId}`

      const res = await agent.Dashboard.getNocOverView(search);
      const data = res.data.data
      const temp = {}
      let total = 0
      data.forEach(d => {
        temp[d.status] = d.count
      })

      Object.keys(nocStatus).forEach(k => {
        k = nocStatus[k]
        temp[k] = temp[k] ? temp[k] : 0
        total += Number(temp[k])
      })
      setTotal(total)
      setNocOverView(temp);
      setLoading(false)
    })()
  }, [])

  return (
    <div className=" relative emp-overView">
      <h3 className='tc '>NOC Applications Overview</h3>
      <div className='card content ' >
        {
          Object.keys(nocOverView).map(o => (
            <div key={o.id} className='pointer div' onClick={() => history.push(`${urls.NOC_PAGE}?status=${o}`)} >
              <b>{o} </b>
              <p>{nocOverView[o]} </p>
            </div>
          ))
        }
        <div className='div'  >
          <b>Total </b>
          <p>{total} </p>
        </div>
      </div>
      {
        loading && <Loader />
      }

    </div>
  );

}

// export default Line;