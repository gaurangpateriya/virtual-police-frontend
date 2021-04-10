import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FiberManualRecordSharpIcon from '@material-ui/icons/FiberManualRecordSharp';
import EditIcon from '@material-ui/icons/Edit';
import Loader from '../../common/components/Loader';
import './Employees.css';
import agent from '../../agent';
import { Dialog } from '@material-ui/core';
import { dialogStyles } from '../../common/commonUseStyles';
import { colors, employeeRoles, ERROR_MSG } from '../../constants/otherConstants';
import { toast } from 'react-toastify';
import { GET_EMPLOYEES } from '../../constants/actionTypes';


// import { Link } from 'react-router-dom';


const Employee = (props) => {

  const classes = dialogStyles()
  const [employee, setEmployee] = useState({})
  const [isUpdate, setIsUpdate] = useState(false);
  const [openEmployee, setOpenEmployee] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const employees = useSelector(state => state.EmployeeReducers.employees)
  const dispatch = useDispatch();


  useEffect(() => {
    if (props.employee && props.employee !== employee) {
      setEmployee(props.employee);
    }
    if (props.isUpdate !== isUpdate) {
      setIsUpdate(props.isUpdate);
    }
  }, [props]);

  const validateEmp = (emp) => {
    const { name, email, mobileNo, password, retypePassword, aadharNo, role } = emp;

    if (!name) {
      setError("Name is required");
      return false;
    }
    if (!email) {
      setError("Email is required");
      return false;
    }

    if (!role) {
      setError("Designation is required");
      return false;
    }
    if (!mobileNo || mobileNo.length != 10) {
      setError("10 digit Mobile No is required");
      return false;
    }

    if (!aadharNo || aadharNo.length !== 12) {
      setError("12 digit Aadhar card number is required");
      return false;
    }
    if (password !== retypePassword) {
      setError("Password and Re-type password does not match");
      return false;
    }
    return true;

  }
  const createEmployee = (e) => {
    e.preventDefault();
    setError(null)
    if (!validateEmp(employee)) {
      return
    }
    setLoading(true);
    if (!isUpdate) {
      agent.Employees.addEmployee(employee).then(res => {
        setLoading(false);
        const tempEmp = [...employees, res.data.data]
        dispatch({ type: GET_EMPLOYEES, payload: tempEmp });
        toast.success("Employee added succesfully");
        togelEmployeeDialog()
      }).catch(err => {
        console.log(err, err.response)
        toast.error(ERROR_MSG);
        setLoading(false);
      })
    } else {
      agent.Employees.updateEmployee(employee.id, employee).then(res => {
        setLoading(false);
        const tempEmp = employees.map(e => {
          if (e.id === employee.id) {
            return employee
          }
          return e;
        })
        dispatch({ type: GET_EMPLOYEES, payload: tempEmp });
        togelEmployeeDialog()
        toast.success("Employee updated succesfully")
        console.log(res.data.data)
      }).catch(err => {
        console.log(err, err.response)
        toast.error(ERROR_MSG);
        setLoading(false);
      })
    }

    console.log(employee);
  }
  const deleteEmployee = () => {

    setLoading(true);
    agent.Employees.deleteEmployee(employee.id).then(() => {
      setLoading(false);
      const tempEmp = employees.filter(e => e.id !== employee.id);
      togelEmployeeDialog()
      dispatch({ type: GET_EMPLOYEES, payload: tempEmp });
      toast.success("Employee deleted succesfully")
    }).catch(err => {
      console.log(err, err.response)
      toast.error(ERROR_MSG);
      setLoading(false);
    })
  }
  const togelEmployeeDialog = () => {
    setOpenEmployee(!openEmployee);
  }
  const createEmployeeDialog = () => {
    return (
      <Dialog open={openEmployee} className={classes.dialog} >

        <div className='create-employee relative'>
          <h3 className='header'>
            {isUpdate ? `Update Employee` : 'Create Employee'}
          </h3>
          <form onSubmit={createEmployee} className="employee-form" id='employee-form'>
            <div className="input-field">
              <p>Name</p>
              <input
                required
                value={employee.name}
                onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                type='text'
              />
            </div>
            <div className="input-field">
              <p>Email</p>
              <input
                required
                value={employee.email}
                onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                type='email'
              />
            </div>
            <div className="input-field">
              <p>Aadhar Card No</p>
              <input
                required
                value={employee.aadharNo}
                onChange={(e) => setEmployee({ ...employee, aadharNo: e.target.value })}
                type='number'
              />
            </div>
            <div className="input-field">
              <p>Mobile No.</p>
              <input
                required
                value={employee.mobileNo}
                onChange={(e) => setEmployee({ ...employee, mobileNo: e.target.value })}
                type='number'
              />
            </div>
            <div className="input-field">
              <p>Designation</p>
              <select onChange={(e) => setEmployee({ ...employee, role: e.target.value })}>
                <option value={null}>Select a designation</option>
                {
                  Object.keys(employeeRoles).map(r => (
                    <option value={employeeRoles[r]}>{employeeRoles[r]}</option>
                  ))
                }

              </select>
            </div>
            {
              !isUpdate && (
                <>
                  <div className="input-field">
                    <p>Password</p>
                    <input
                      required
                      value={employee.password}
                      onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
                      type='password'
                    />
                  </div>
                  <div className="input-field">
                    <p>Re-typePassword</p>
                    <input
                      required
                      value={employee.retypePassword}
                      onChange={(e) => setEmployee({ ...employee, retypePassword: e.target.value })}
                      type='text'
                    />
                  </div>
                </>
              )
            }

            {error && (
              <p className='error'>{error}</p>
            )}
          </form>
          <div className='actions'>
            <button type='submit' form='employee-form' className='primary-btn pa2 f6'>
              {!isUpdate ? 'Create Employee' : 'Update Employee'}
            </button>
            {
              isUpdate && (
                <button type='button' onClick={deleteEmployee} className='red-btn ml2 pa2 f6'>
                  Delete
                </button>
              )
            }
            <button type='button' onClick={togelEmployeeDialog} className='red-btn pa2 ml2 f6' >
              Cancel
            </button>
          </div>
          {loading && <Loader />}
        </div>
      </Dialog>
    )
  }

  if (isUpdate) {
    return (
      <>
        <tr className="employee" >
          <td>
            {
              employee.onDuty ?
                <FiberManualRecordSharpIcon
                  style={{ fill: 'green', width: '10px', height: '10px' }}
                />
                : <FiberManualRecordSharpIcon
                  style={{ fill: 'red', width: '10px', height: '10px' }}
                />
            } {employee.name}</td>
          <td>{employee.email}</td>
          <td>{employee.mobileNo}</td>
          <td>{employee.role}</td>
          <td>
            <button type='button' onClick={togelEmployeeDialog} >
              <EditIcon style={{ width: '15px', height: '15px', fill: colors.dark.primaryColor }} />
            </button>
          </td>
        </tr>
        {
          createEmployeeDialog()
        }
      </>
    )
  }
  return (
    <>
      <button type='button' className='primary-btn pa2 f6' onClick={togelEmployeeDialog}>
        Add an Employee
    </button>
      {
        createEmployeeDialog()
      }
    </>
  );
};

export default Employee;
