import React, { useState, useEffect } from 'react';
import Loader from '../../common/components/Loader';
import './Dashboard.css';
import agent from '../../agent';


import { employeeRoles, ERROR_MSG } from '../../constants/otherConstants'
import { urls } from '../../constants/pageUrls'
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default () => {

  const [empOverView, setEmpOverView] = useState([])
  const [total, setTotal] = useState([])
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.common.user)

  const history = useHistory()

  useEffect(() => {
    (async () => {
      try {

        setLoading(true)
        const search = `?StationId=${user.StationId}`
        const res = await agent.Dashboard.getEmpOverView(search);
        const data = res.data.data
        const temp = {}
        let total = 0
        data.forEach(d => {
          temp[d.role] = d.count
        })

        Object.keys(employeeRoles).forEach(k => {
          k = employeeRoles[k]
          temp[k] = temp[k] ? temp[k] : 0
          total += Number(temp[k])
        })
        setTotal(total)
        setEmpOverView(temp);
        setLoading(false)
      } catch (err) {
        console.log(err, err.reponse)
        setLoading(false)
        toast.error(ERROR_MSG)
      }
    })()
  }, [])

  return (
    <div className=" relative emp-overView">
      <h3 className='tc card '>Employees Overview</h3>
      <div className='card content ' >
        {
          Object.keys(empOverView).map(o => (
            <div key={o.id} className='pointer div' onClick={() => history.push(`${urls.EMPLOYESS_PAGE}?role=${o}`)} >
              <b>{o} </b>
              <p>{empOverView[o]} </p>
            </div>
          ))
        }
        <div className='div' >
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