import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { APP_NAME, WEB_TOKEN } from '../../constants/otherConstants';

import LoginImage from '../../assets/Images/login.svg';
import TextInput from '../../common/components/TextInput';
import Loader from '../../common/components/Loader';
import logo from '../../assets/Images/logo_short.png';
import './Login.css';

import agent from '../../agent';
import { LOGIN, SET_USER } from '../../constants/actionTypes';
import { store } from '../../store';
import { push } from 'connected-react-router';
import { urls } from '../../constants/pageUrls';
import { toast } from 'react-toastify';


const Login = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stations, setStations] = useState([]);

  const dispatch = useDispatch()
  useEffect(() => {
    const webToken = window.localStorage.getItem(WEB_TOKEN);

    if (webToken) {
      store.dispatch(push('/dashboard'));
    }

    agent.Auth.getStations().then(res => {
      setStations(res.data.data)
    }).catch(err => {
      console.log(err, err.response)
    })
  }, []);
  const login = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const { StationId } = user;
    console.log(user)
    if (!StationId) {
      toast.error("Select a station")
      return
    }
    setLoading(true);
    setError(null);
    try {
      const res = await agent.Auth.login(user);

      setLoading(false);
      setError(null)
      dispatch({ type: LOGIN, payload: res.data })
      dispatch({ type: SET_USER, payload: res.data.data })

      store.dispatch(push(urls.DASHBOARD));
    } catch (err) {
      // console.log(err, err.response);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`${err.response.data.message}`);
      } else {
        setError('Error occured. Please try again after some time');
      }
      setLoading(false);
    }
  };
  return (
    <div className='root-bg '>
      {/* <NavBar /> */}
      <div className="background">
        <div className="form">
          <div className="left">
            <img src={LoginImage} alt="" />
          </div>
          <form onSubmit={login}>
            <div className="logo">
              <img src={logo} alt="" />
              <p>{APP_NAME}</p>
            </div>
            <div className="w-100">
              <select value={user.StationId} onChange={(e) => setUser({ ...user, StationId: e.target.value })} >
                <option value="">Select Station</option>
                {
                  stations.map(s => (
                    <option value={s.id} key={s.id}> {s.name} </option>
                  ))
                }
              </select>
              <TextInput required autoComplete label="Aadhar Card number" type="number" className="w-100" value={user.aadharNumber} onTextChange={value => setUser({ ...user, aadharNumber: value })} />
              <TextInput required autoComplete label="Password" type="password" value={user.password} onTextChange={value => setUser({ ...user, password: value })} />
              {/* <p>

                <Link to="/forgot-password">Forgot password?</Link>
              </p> */}
              {error && (
                <p className="error">
                  {error}

                </p>
              )}
              <button type="submit">Login</button>

            </div>

          </form>

        </div>
        {
          loading && <Loader />
        }
      </div>
    </div>
  );
};


export default Login;
