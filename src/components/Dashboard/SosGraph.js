import React, { useState, useEffect } from 'react';
import Loader from '../../common/components/Loader';
import './Dashboard.css';
import agent from '../../agent';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { colors } from '../../constants/otherConstants'

export default () => {
  const [graphData, setGraphData] = useState([])
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await agent.Dashboard.getSosOverView();
      const data = res.data.data

      const graphData = []
      for (let i = 15; i >= 1; i -= 1) {
        const date = moment().subtract(i, 'days').startOf('day').format("DD-MM")
        const count = data.find(d => moment(d.date_trunc).format("DD-MM") === date)
        graphData.push({ name: date, SOS: count ? Number(count.count) : 0 })
      }
      setGraphData(graphData)
      setLoading(false)
    })()
  }, [])

  return (
    <div className="card relative">
      <h3 className='tc'>Number of SOS request of past 15 days</h3>
      <LineChart
        width={700}
        height={300}
        data={graphData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >

        <XAxis dataKey="name" />
        <YAxis interval='preserveStartEnd' />
        <Tooltip contentStyle={{ backgroundColor: colors.dark.background }} />


        <Line type="monotone" dataKey="SOS" stroke="#82ca9d" />
      </LineChart>
      {
        loading && <Loader />
      }

    </div>
  );

}

// export default Line;