import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavBar from '../AuthNavBar/AuthNavBar';
import clsx from 'clsx';
import Loader from '../../common/components/Loader';
import './FirPage.css';
import agent from '../../agent';


import { shiftStyles } from '../../common/commonUseStyles';

import { GET_FIRS, GET_EMPLOYEES } from '../../constants/actionTypes'
import moment from 'moment';
import { firStatus } from '../../constants/otherConstants';
// import { Link } from 'react-router-dom';

const FirDetails = ({ match: { params: { id } } }) => {
  const classes = shiftStyles();

  const allfirs = useSelector(state => state.FirReducers.firs)
  const employees = useSelector(state => state.EmployeeReducers.employees)

  const [fir, setFir] = useState({ User: {}, Employee: {} });

  const drawerOpen = useSelector(state => state.common.drawerOpen)
  const [loading, setLoading] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  };



  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        resize();

        window.addEventListener('resize', resize);
        console.log(id)
        let fir = allfirs.find(f => f.id === id)
        if (!fir) {
          setLoading(true);
          const res = await agent.Firs.getFirDetails(id)
          setLoading(false)
          if (res.data.data && res.data.data.length > 0) {

            fir = res.data.data[0];
          }
        }
        setFir(fir);
        if (employees.length === 0) {

          setLoading(true);
          const res = await agent.Employees.getEmployees()
          dispatch({ type: GET_EMPLOYEES, payload: res.data.data })
          setLoading(false)
        }

      } catch (error) {
        setLoading(false)
        console.log(error, error.response)
      }
    })()
  }, [id]);
  const selectOfficer = async (e) => {
    const emp = e.target.value
    if (!emp) {
      return
    }



    const data = { id: fir.id, EmployeeId: emp, status: firStatus.ACTIVE }


    setLoading(true);
    const res = await agent.Firs.updateFir(data);

    setLoading(false);

    const updatedFir = { ...fir, EmployeeId: emp, Employee: employees.find(e => e.id === emp), status: firStatus.ACTIVE }
    setFir(updatedFir);

    const temp = allfirs.map(f => {
      if (f.id === updatedFir.id) {
        return updatedFir
      }
      return f;
    })

    dispatch({ type: GET_FIRS, payload: temp })
  }
  return (
    <>
      <AuthNavBar />

      <div className="root-bg">
        <div className={`fir-page-details-div ${clsx(classes.appBar, { [classes.appBarShift]: drawerOpen, })}`}>
          <div className="content">
            <div className='header'>
              <h3>
                FIR Details
              </h3>
            </div>
            <div className="card ">
              <h4>Filed By:</h4>
              <p>{fir.User.name} </p>
              <p>{fir.User.mobileNo} </p>
              <p>Aadhar card No: {fir.User.aadharNumber} </p>
              <p>Address: {fir.User.address} </p>

            </div>
            <div className="card">
              <h4>Offence Details:</h4>
              <p>Nature: {fir.crimeNature}</p>
              <p>Date of offence: {moment(fir.data).format("DD-MMM-YYYY")}</p>
              <p>Place of offence: {fir.placeOfOccurence}</p>
              <b>Accused Desciption: </b>
              <p>{fir.accusedDesciption} </p>
              <b>Complaint: </b>
              <p>{fir.complaint} </p>
              <b>Property Damage: </b>
              <p>{fir.propertyDamage || 'Not added'} </p>
              <b>Witness Details: </b>
              <p>{fir.witnessDetails || 'Not added'} </p>
            </div>
          </div>
          <div className="actions card">
            <p className='bb pb2'>Status: {fir.status}</p>
            <div className='emp-div'>
              <h4>Investing Officer </h4>
              {fir.Employee ? (
                <>
                  <p>{fir.Employee.name}</p>
                  <p className='bb w-100 pb2'>{fir.Employee.mobileNo}</p>
                  <b  >Officer's Remark</b>
                  <p>{fir.remark || "No remark is added"} </p>
                </>
              ) : (
                <>
                  <p>No officer assigned</p>
                  <b className='mb2'>Select Officer for investigation</b>
                  <select className='mt2' onChange={selectOfficer}>
                    <option value={""}> Select officer </option>
                    {employees.map(e => (
                      <option value={e.id}> {e.name}  ({e.role})</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {
            loading && <Loader />
          }
        </div>

      </div>
    </>
  );
};

export default FirDetails;
