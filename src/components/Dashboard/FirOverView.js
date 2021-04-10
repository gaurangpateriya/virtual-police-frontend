import React, { useState, useEffect } from 'react';
import Loader from '../../common/components/Loader';
import './Dashboard.css';
import agent from '../../agent';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { colors, firStatus } from '../../constants/otherConstants'
import { useHistory } from 'react-router';

export default () => {

  const [firOverView, setFirOverView] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const history = useHistory()

  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await agent.Dashboard.getFirOverView();
      const data = res.data.data
      const temp = {}
      let total = 0
      data.forEach(d => {
        temp[d.status] = d.count
      })

      Object.keys(firStatus).forEach(k => {
        k = firStatus[k]
        temp[k] = temp[k] ? temp[k] : 0
        total += Number(temp[k])
      })
      setTotal(total)
      setFirOverView(temp);
      setLoading(false)
    })()
  }, [])

  return (
    <div className=" relative fir-overView">
      <h3 className='tc card '>FIR Overview</h3>
      <div className='card content ' >
        {
          Object.keys(firOverView).map(o => (
            <div key={o.id} className='pointer' onClick={() => history.push(`/firs?status=${o}`)} >
              <b>{o} </b>
              <p>{firOverView[o]} </p>
            </div>
          ))
        }
        <div className=''  >
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