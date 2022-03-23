import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import '../styles/dropzone.css';
import uploadicon from '../assets/upload.png';
import ProgressBar from '../components/ProgressBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { REACT_APP_BACKEND_API } = process.env;

const Dropzone = () => {
  const [generatedLink, setGeneratedLink] = useState(null);
  const [progress, setProgress] = useState(0);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const notifyLinkCopied = () => toast("Link Copied!");
  const notifyError = () => toast("Something went wrong!");

  const copyClickHandler = () => {
    navigator.clipboard.writeText(generatedLink);
    notifyLinkCopied();
  }

  useEffect(() => {
    var formData = new FormData();
    formData.append('myfile', acceptedFiles[0]);
    axios
      .post(`${REACT_APP_BACKEND_API}/api/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          // console.log(`${loaded} bytes of ${total} bytes | ${percent}%`);
          if (percent < 100) {
            setProgress(percent);
          }
        },
      })
      .then((res) => {
        setGeneratedLink(res.data.file);
        setProgress(100);
      })
      .catch((error) => {
        notifyError();
      });
  }, [acceptedFiles]);

  return (
    <section className="dropzone-container">
      {progress === 0 ? (
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <img src={uploadicon} alt="" />
          <p>
            You can always drag and drop your files here, or{' '}
            <span id="browseBtn">browse</span> them
          </p>
        </div>
      ) : progress === 100 ? (
        <div className="link-container">
          <h3 className="download-link">{generatedLink}</h3>
          <button className="copy-button" onClick={() => copyClickHandler()}>Copy</button>
        </div>
      ) : (
        <ProgressBar done={progress} />
      )}
      <ToastContainer />
    </section>
  );
}

export default Dropzone;
