import React from 'react';
import './ErrorPage.css';

import { goBack } from 'react-router-redux';
import { connect } from 'react-redux';
import { store } from './store';

class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }


  render() {
    // You can render any custom fallback U
    return (
      <div className="error-page">
        <div className="content">

          <h1>Something Went Wrong</h1>
          <p>It's not you it's us. Something broke on our  our side </p>
          <p>
Please
            <a href={`${window.location.pathname}`}> Click Here </a>
            {' '}
to continue.
          </p>
          <br />

        </div>
      </div>

    );
  }
}

const mapStateToProps = state => ({
  // user: state.AuthReducer.user,
  // publicPageUser: state.HomePageReducers.user,
});
export default connect(mapStateToProps)(ErrorPage);
