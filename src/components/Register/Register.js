import React, { useState } from 'react';
import { connect } from 'react-redux';

import { APP_NAME, APP_NAME_short } from '../../constants/otherConstants';
import { LOGIN, SET_USER } from '../../constants/actionTypes';
import NavBar from '../NavBar/NavBar';
import RegisterImage from '../../assets/Images/register.svg';
import TextInput from '../../common/components/TextInput';
import Loader from '../../common/components/Loader';
import logo from '../../assets/Images/logo_short.png';
import './Register.css';
import { Link } from 'react-router-dom';
import agent from '../../agent';
import { store } from '../../store';
import { push } from 'react-router-redux';

const Register = (props) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await agent.Auth.register(user);
      // console.log(res);
      props.login(res.data);
      props.setUser(res.data.data);
      store.dispatch(push('/dashboard'));
      setLoading(false);
    } catch (err) {

      if (err.response && err.response.data && err.response.data.message && err.response.data.message.errors) {
        setError(err.response.data.message.errors[0].message);
      } else {
        setError('Error occured. Please try again after some time');
      }
      setLoading(false);
    }
  };
  const validateForm = () => {
    const { mobileNo } = user;
    // mobileNo = parseInt(mobileNo)+"";

    // setUser({ ...user, mobileNo });

    if (mobileNo.length !== 10) {
      setError('Enter 10 digit mobile number without leading zero.');
      return false;
    }

    return true;
  };
  return (
    <>
      <NavBar />
      <div className="background">
        <div className="form">
          <div className="left">
            <img src={RegisterImage} alt="" />
          </div>
          <form onSubmit={register}>
            <div className="logo">
              <img src={logo} alt="" />
              <p>{APP_NAME}</p>
            </div>
            <div className="w-100">
              <TextInput
                label="Name"
                type="text"
                className="w-100"
                value={user.name}
                onTextChange={value => setUser({ ...user, name: value })}
              />
              <TextInput
                label="College Name"
                type="text"
                className="w-100"
                value={user.college}
                onTextChange={value => setUser({ ...user, college: value })}
              />
              <TextInput
                label="Branch"
                type="text"
                className="w-100"
                value={user.branch}
                onTextChange={value => setUser({ ...user, branch: value })}
              />
              <TextInput
                label="Passing Year"
                type="number"
                className="w-100"
                value={user.passingYear}
                onTextChange={value => setUser({ ...user, passingYear: value })}
              />
              <TextInput
                label="Mobile no."
                type="number"
                className="w-100"
                value={user.mobileNo}
                onTextChange={value => setUser({ ...user, mobileNo: value })}
              />
              <TextInput
                label="Email"
                type="email"
                className="w-100"
                value={user.email}
                onTextChange={value => setUser({ ...user, email: value })}
              />
              <TextInput
                label="Password"
                type="password"
                value={user.password}
                onTextChange={value => setUser({ ...user, password: value })}
              />
              {error && <p className="error">{error}</p>}
              <button type="submit">Register</button>
              <p>
                Already a user?
                <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>

      </div>
      {
        loading && <Loader />
      }
    </>
  );
};

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({
  login: data => dispatch({ type: LOGIN, payload: data }),
  setUser: data => dispatch({ type: SET_USER, payload: data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
