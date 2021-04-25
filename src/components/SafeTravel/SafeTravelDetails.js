import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavBar from '../AuthNavBar/AuthNavBar';
import clsx from 'clsx';
import Loader from '../../common/components/Loader';
import './SafeTravelPage.css';
import agent from '../../agent';


import { shiftStyles } from '../../common/commonUseStyles';

import { GET_NocS, GET_EMPLOYEES } from '../../constants/actionTypes'
import moment from 'moment';
import { ERROR_MSG, nocStatus } from '../../constants/otherConstants';
import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

const { REJECTED, VERIFIED } = nocStatus;

const NocDetails = ({ match: { params: { id } } }) => {
  const classes = shiftStyles();

  const drawerOpen = useSelector(state => state.common.drawerOpen)
  const allNocs = useSelector(state => state.NocReducers.nocs)


  const [noc, setNoc] = useState({ User: {}, relatedDocuments: [] });
  const [addRemark, setAddRemark] = useState(false);
  const [remarks, setRemarks] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {

        let noc = allNocs.find(f => f.id === id)
        if (!noc) {
          setLoading(true);
          const res = await agent.Nocs.getNocDetails(id)

          setLoading(false)
          if (res.data.data && res.data.data.length > 0) {
            noc = res.data.data[0];
          }
        }


        setNoc(noc);
        setRemarks(noc.remarks)
      } catch (error) {
        setLoading(false)
        console.log(error, error.response)
      }
    })()
  }, [id]);
  const changeRemarkInput = (value) => {
    if (!value) {
      setRemarks(noc.remarks);
    }
    setAddRemark(value)
  }

  const updateRemark = async () => {
    if (!remarks) {
      toast.error("Remark is required");
      return false
    }
    try {

      const data = { ...noc, remarks, status: REJECTED }
      setLoading(true);
      await agent.Nocs.updateNoc(data);
      setAddRemark(false)
      toast.info("Remark added")
      setNoc(data);
      setLoading(false);
    } catch (err) {
      console.log(err, err.response)
      toast.error(ERROR_MSG)
      setLoading(false);
    }
  }
  const selectVerifiedDoc = async (e) => {
    try {

      const file = e.target.files[0];
      const data = { id: noc.id, status: VERIFIED, remarks: "", verifiedCertificate: file };
      const temp = Object.keys(data).map(k => ({ key: k, file: data[k] }))

      setLoading(true)

      const res = await agent.Nocs.verifyNoc(temp);
      const { verifiedCertificate } = res.data.data

      setNoc({ ...noc, ...data, verifiedCertificate });
      toast.info("Verified Document uploaded");

      setLoading(false);


    } catch (err) {
      console.log(err, err.response);
      setLoading(false);
      toast.error(ERROR_MSG);

    }
  }
  return (
    <>
      <AuthNavBar />

      <div className="root-bg">
        <div className={`noc-page-details-div ${clsx(classes.appBar, { [classes.appBarShift]: drawerOpen, })}`}>

          <div className="content">
            <div className='header'>
              <h2>
                {noc.name || noc.type}
              </h2>
            </div>
            <div className="card ">
              <h4>Applied By:</h4>
              <p>{noc.User.name} </p>
              <p>{noc.User.mobileNo} </p>
              <p>Aadhar card No: {noc.User.aadharNumber} </p>
              <p>Address: {noc.User.address} </p>
            </div>


            <div className="card">
              <h4>Documents: </h4>
              <div className='flex doc-btn items-center justify-between'>
                <p>Application Form</p>
                <a target="_blank" href={noc.form} >
                  See Document
                </a>
              </div>

              {
                noc.relatedDocuments && noc.relatedDocuments.length !== 0 && (
                  <>
                    <h4 className='bt pt3' >Supporting Documents: </h4>
                    {
                      noc.relatedDocuments.map(doc => (
                        <div className='flex doc-btn items-center justify-between' key={doc.id}>
                          <p>{doc.name} </p>
                          <a target="_blank" href={doc.file} >
                            See Document
                          </a>
                        </div>
                      ))
                    }
                  </>
                )
              }

            </div>

          </div>
          <div className="actions card">
            <p className='bb pb2'>Status: {noc.status}</p>
            <div className='emp-div'>
              <>
                <div className='flex items-center justify-between'>
                  <b>Remark</b>
                  <button
                    type='button'
                    onClick={() => changeRemarkInput(!addRemark)}
                    className={addRemark ? 'red-btn pa2 f6' : 'primary-btn pa2 f6'}
                  >
                    {
                      addRemark ? "Cancel" : "Edit Remark"
                    }
                  </button>
                </div>
                {
                  addRemark ? (
                    <>
                      <textarea rows={5} className='w-100 mt2' onChange={(e) => setRemarks(e.target.value)}>
                        {remarks}
                      </textarea>
                      <button
                        type='button'
                        onClick={() => updateRemark()}
                        className={'red-btn pa2 f6 mt2 mb2 w-100'}
                      >
                        Update Remark and Reject Application

                      </button>
                    </>
                  ) : (


                    <p>{noc.remarks || "No remarks is added"} </p>


                  )
                }
                {
                  !addRemark && (
                    <div className='bt pt2 pb2' >
                      <b className='pb2 pt2' style={{ display: 'block' }} >Verify NOC/Certificate</b>
                      {
                        noc.verifiedCertificate && (

                          <div className='flex doc-btn items-center justify-between'>
                            <p>Verified NOC/Certificate</p>
                            <a target="_blank" href={noc.verifiedCertificate} >
                              See Document
                            </a>
                          </div>
                        )
                      }
                      <div className='primary-btn verify-btn'>
                        <input type='file' onChange={selectVerifiedDoc} />
                        {!noc.verifiedCertificate ? "Upload" : "Update"} Verified NOC/Certificate
                      </div>
                    </div>
                  )
                }
              </>
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

export default NocDetails;
