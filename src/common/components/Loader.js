import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function CircularIndeterminate(props) {
  return (
    <div className={'loader-div'}>
      <div className='loader'>
        <CircularProgress />
        {props.uploading && (
          <div>
            <p style={{ fontSize: '20px' }}>Uploading document...</p>
          </div>
        )}
        {props.compressing && (
          <div>
            <p style={{ fontSize: '20px' }}>Compressing file...Please Wait</p>
          </div>
        )}
        {props.email && (
          <div>
            <p style={{ fontSize: '20px' }}>
              Preparing file and mailing to {props.email}
            </p>
            <p style={{ fontSize: '16px' }}>
              It generally takes 5-6 secs to send.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
