import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { APP_NAME, WEB_TOKEN } from '../../constants/otherConstants';
import NavBar from '../NavBar/NavBar';
import LoginImage from '../../assets/Images/login.svg';
import TextInput from '../../common/components/TextInput';
import Loader from '../../common/components/Loader';
import logo from '../../assets/Images/logo_short.png';
import './Login.css';
import { Link } from 'react-router-dom';
import agent from '../../agent';
import { LOGIN, SET_USER } from '../../constants/actionTypes';
import { store } from '../../store';
import { push } from 'connected-react-router';


const ResetPassword = (props) => {
  const [password, setPassword] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");


  useEffect(() => {
    const webToken = window.localStorage.getItem(WEB_TOKEN);

    if (webToken) {
      store.dispatch(push('/dashboard'));
    }

    if (props.match.params.token) {
      setToken(props.match.params.token);
    }
  }, []);

  const changePassword = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (password !== confirmPassword) {
      setError("Password does not match!!!");
      return;
    }
    setLoading(true);
    setError(null);

    try {

      const res = await agent.Auth.resetPassword({ token, password });
      setLoading(false);
      setError(null);

      console.log(res);
      store.dispatch(push('/'));
    } catch (err) {
      // console.log(err, err.response);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error occured. Please try again after some time');
      }
      setLoading(false);
    }
  };
  return (
    <>
      <NavBar />
      <div className="background">
        <div className="form">
          <div className="left">
            <img src={LoginImage} alt="" />
          </div>
          <form onSubmit={changePassword}>
            <div className="logo">
              <img src={logo} alt="" />
              <p>{APP_NAME}</p>
            </div>
            <div className="w-100">
              <p>Enter new password</p>
              <TextInput required label="Password" type="password" value={password || ""} onTextChange={value => setPassword(value)} />
              <TextInput required label="Confirm Password" type="password" value={confirmPassword} onTextChange={value => setConfirmPassword(value)} autoComplete />


              {error && (
                <p className="error">
                  {error}

                </p>
              )}
              <button type="submit">Change Password</button>
              <p>
                Already a user?
                <Link to="/">Login</Link>
              </p>
            </div>

          </form>

        </div>
        {
          loading && <Loader />
        }
      </div>
    </>
  );
};
const mapStateToProps = () => ({

});
const mapDispatchToProps = dispatch => ({
  login: data => dispatch({ type: LOGIN, payload: data }),
  setUser: data => dispatch({ type: SET_USER, payload: data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
