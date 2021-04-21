import React, { useState, useEffect } from 'react';
import Loader from '../../common/components/Loader';
import './Dashboard.css';
import agent from '../../agent';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { colors, nocStatus } from '../../constants/otherConstants'
import { useHistory } from 'react-router';

export default () => {

  const [nocOverView, setNocOverView] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const history = useHistory()

  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await agent.Dashboard.getNocOverView();
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
            <div key={o.id} className='pointer div' onClick={() => history.push(`/nocs?status=${o}`)} >
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