import React, { useMemo } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'animate.css/animate.min.css';

import { WEB_TOKEN } from './constants/otherConstants';
import './App.css';

import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Employees from './components/Employees/Employees';
import agent from './agent';
import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';
import FirPage from './components/Fir/FirPage';
import FirDetails from './components/Fir/FirDetails';
import SosPage from './components/Sos/SosPage';

const isLogin = () => {
  const webToken = window.localStorage.getItem(WEB_TOKEN);
  return webToken ? true : false;
};


const PrivateRoute = ({ component: Component, ...rest }) => {
  if (!isLogin()) {
    return <Route {...rest} render={() => <Redirect to='/login' />} />;
  }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};


const App = ({ history }) => {
  // const dispatch = useDispatch();
  const useComponentWillMount = (func) => {
    useMemo(func, []);
  };
  useComponentWillMount(() => {
    const webToken = window.localStorage.getItem(WEB_TOKEN);
    if (webToken) {
      agent.setToken(webToken);
    }
  }, []);

  return (
    <>
      <React.Suspense
        fallback={
          <div
            style={{
              width: '40px',
              height: '40px',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          >
            <h4>Loading...</h4>
            <CircularProgress />
          </div>
        }
      >
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' component={Login} exact />
            <Route path='/login' component={Login} exact />

            <Route path='/forgot-password' component={ForgotPassword} exact />
            <Route
              path='/reset-password/:token'
              component={ResetPassword}
              exact
            />

            <PrivateRoute
              path='/dashboard'
              component={Dashboard}
              exact
            />
            <PrivateRoute
              path='/employees'
              component={Employees}
              exact
            />
            <PrivateRoute
              path='/firs'
              component={FirPage}
              exact
            />
            <PrivateRoute
              path='/sos-requests'
              component={SosPage}
              exact
            />

            <PrivateRoute
              path='/firDetails/:id'
              component={FirDetails}
              exact
            />

          </Switch>
        </ConnectedRouter>
      </React.Suspense>
      <ToastContainer style={{ color: 'white' }} />
    </>
  );
};

export default App;
