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


const ForgotPassword = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enableResend, setEnableResend] = useState(false);
  const [message, setmessage] = useState(null);

  useEffect(() => {
    const webToken = window.localStorage.getItem(WEB_TOKEN);

    if (webToken) {
      store.dispatch(push('/dashboard'));
    }
  }, []);

  const sendLink = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);
    setError(null);
    setmessage(null);
    try {

      const res = await agent.Auth.forgotPassword(user);
      setLoading(false);
      setError(null);
      setEnableResend(true);
      setmessage("An email has been sent to your email.")
    } catch (err) {

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message.error);
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
          <form onSubmit={sendLink}>
            <div className="logo">
              <img src={logo} alt="" />
              <p>{APP_NAME}</p>
            </div>
            <div className="w-100">
              <p>Enter the email with which you have registered.</p>
              <TextInput required label="Email" type="email" className="w-100" value={user.email} onTextChange={value => setUser({ ...user, email: value })} autoComplete />
              {message && (
                <p className="green b " style={{ color: 'green' }}>
                  {message}

                </p>
              )}
              {error && (
                <p className="error">
                  {error}

                </p>
              )}
              <button type="submit">{enableResend ? "Resend Link" : 'Send Link'}</button>
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
const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({
  login: data => dispatch({ type: LOGIN, payload: data }),
  setUser: data => dispatch({ type: SET_USER, payload: data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
