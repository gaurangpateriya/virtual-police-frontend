import React, { useMemo } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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
import NocPage from './components/Nocs/NocPage';
import NocDetails from './components/Nocs/NocDetails';
import SosPage from './components/Sos/SosPage';
import SafeTravelPage from './components/SafeTravel/SafeTravelPage';
import SafeTravelDetails from './components/SafeTravel/SafeTravelDetails';
import { urls } from './constants/pageUrls';

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
            <Route path={urls.LOGIN_PAGE} component={Login} exact />


            <Route
              path={urls.FORGOT_PASSWORD}
              component={ResetPassword}
              exact
            />

            <PrivateRoute
              path={urls.DASHBOARD}
              component={Dashboard}
              exact
            />
            <PrivateRoute
              path={urls.EMPLOYESS_PAGE}
              component={Employees}
              exact
            />
            <PrivateRoute
              path={urls.FIRS_PAGE}
              component={FirPage}
              exact
            />
            <PrivateRoute
              path={urls.NOC_PAGE}
              component={NocPage}
              exact
            />
            <PrivateRoute
              path={urls.SOS_PAGE}
              component={SosPage}
              exact
            />

            <PrivateRoute
              path={urls.NOC_DETAILS_PAGE}
              component={NocDetails}
              exact
            />
            <PrivateRoute
              path={urls.FIR_DETAILS_PAGE}
              component={FirDetails}
              exact
            />

            <PrivateRoute
              path={urls.SAFE_TRAVEL_PAGE}
              component={SafeTravelPage}
              exact
            />
            <PrivateRoute
              path={urls.SAFE_TRAVEL_DETAILS_PAGE}
              component={SafeTravelDetails}
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
