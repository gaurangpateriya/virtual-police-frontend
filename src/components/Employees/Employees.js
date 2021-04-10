import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavBar from '../AuthNavBar/AuthNavBar';
import clsx from 'clsx';
import Loader from '../../common/components/Loader';
import './Employees.css';
import agent from '../../agent';

import { shiftStyles } from '../../common/commonUseStyles';
import Employee from './Employee';
import { GET_EMPLOYEES } from '../../constants/actionTypes';
import { colors, employeeRoles } from '../../constants/otherConstants';
import { useHistory } from 'react-router';
// import { Link } from 'react-router-dom';


const Employees = ({ location: { search } }) => {
  const classes = shiftStyles();
  const [filters, setFilters] = useState("")
  const history = useHistory();

  const employees = useSelector(state => state.EmployeeReducers.employees)

  const drawerOpen = useSelector(state => state.common.drawerOpen)
  const [loading, setLoading] = useState(false);


  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {

        setLoading(true);
        if (search) {
          setFilters(search.substring(0).split("=")[1])

          const res = await agent.Employees.getFilteredEmps(search)
          dispatch({ type: GET_EMPLOYEES, payload: res.data.data })
        } else {
          setFilters("")

          const res = await agent.Employees.getEmployees()
          dispatch({ type: GET_EMPLOYEES, payload: res.data.data })
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
        history.push(`/employees`)
      } else {
        let searchString = `?role=${newFilter}`
        history.push(`/employees${searchString}`)
      }
    }
  }


  return (
    <>
      <AuthNavBar />

      <div className="root-bg">
        <div className={`employees-div ${clsx(classes.appBar, { [classes.appBarShift]: drawerOpen, })}`}>
          <div className='header'>
            <h3>
              All employees
            </h3>
            <Employee isUpdate={false} />

          </div>
          <div
            className='flex items-center justify-end'
          >
            {
              Object.keys(employeeRoles).map((s, i) => (
                <button
                  type='button'
                  className='ba br4 ml2 pa2  f7'
                  onClick={() => chooseFilter(employeeRoles[s])}
                  style={{
                    backgroundColor: employeeRoles[s] === filters ? colors.dark.primaryColor : ''
                  }}
                >
                  {employeeRoles[s]}
                </button>
              ))
            }
          </div>
          <table className='employees-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              {
                employees.length > 0 ? (

                  employees.map(e => (
                    <Employee isUpdate employee={e} key={e.id} />
                  ))
                ) : (
                  <p>No Employee present</p>
                )
              }
            </tbody>
          </table>
          {
            loading && <Loader />
          }
        </div>

      </div>
    </>
  );
};

export default Employees;
