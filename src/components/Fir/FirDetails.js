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
import { firStatus, THEFT_TYPE } from '../../constants/otherConstants';
// import { Link } from 'react-router-dom';

const { VEHICLE_THEFT, MOBILE_THEFT } = THEFT_TYPE;
const FirDetails = ({ match: { params: { id } } }) => {
  const classes = shiftStyles();

  const allfirs = useSelector(state => state.FirReducers.firs)
  const employees = useSelector(state => state.EmployeeReducers.employees)

  const [fir, setFir] = useState({ User: {}, Employee: {}, FirImages: [] });

  const drawerOpen = useSelector(state => state.common.drawerOpen)
  const [loading, setLoading] = useState(false);
  const [addRemark, setAddRemark] = useState(false)
  const [remark, setRemark] = useState(false)



  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
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
        setRemark(fir.remark)
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

    await agent.Firs.updateFir(data);
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
  const changeAddRemark = (value) => {
    if (!value) {

      setRemark(fir.remark)
    }
    setAddRemark(value)
  }
  const updateRemark = async () => {
    const data = { id: fir.id, remark }
    setLoading(true);

    await agent.Firs.updateFir(data);
    setLoading(false);
    setAddRemark(false);

    const updatedFir = { ...fir, ...data }
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
            {
              fir.crimeNature === VEHICLE_THEFT && (
                <div className='card' >
                  <h4 >Stolen Vehicle Details</h4>
                  <p> Type:     {fir.vehicleType}</p>
                  <p > Model:     {fir.vehicleModel}</p>
                  <p > Registration Number:     {fir.registrationNumber}</p>
                </div>
              )

            }
            {
              fir.crimeNature === MOBILE_THEFT && (
                <div className='card'>
                  <h4 >Stolen Mobile Details</h4>
                  <p > Mobile Number:    {fir.stolenMobileNumber || 'Not added'}</p>
                  <p > Model:    {fir.stolenMobileModel || 'Not added'}</p>
                  <p > IMEI Number:    {fir.stolenMobileIMEINumber || 'Not added'}</p>
                </div>
              )
            }
            <div className="card">
              <h4>Images:</h4>
              <div className='fir-images' >
                {
                  fir.FirImages.length == 0 ? (
                    <p>No Images present</p>
                  ) : fir.FirImages.map(img => (

                    <a target="_blank" className='ml2 mr2 block' href={img.image} >
                      <p className='tc'>{img.name}</p>
                      <img src={img.image} />
                      <div>
                        <p>
                          Click to Enlarge
                        </p>
                      </div>
                    </a>

                  ))
                }
              </div>
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
                  <div className='flex items-center justify-between'>

                    <b >Officer's Remark</b>
                    <button
                      className={addRemark ? 'red-btn f6 pa2' : 'primary-btn pa2 f6'}
                      onClick={() => changeAddRemark(!addRemark)} >
                      {addRemark ? 'Cancel' : "Update Remark"}
                    </button>
                  </div>
                  {
                    addRemark ? (
                      <div>
                        <textarea
                          className='w-100'
                          onChange={(e) => setRemark(e.target.value)}
                        >
                          {remark}
                        </textarea>
                        <button className='primary-btn f6 mt2 pa2' onClick={updateRemark} > Update Remark </button>
                      </div>
                    ) : (

                      <p style={{ overflowWrap: 'break-word' }} >{fir.remark || "No remark is added"} </p>
                    )
                  }
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

      </div >
    </>
  );
};

export default FirDetails;
