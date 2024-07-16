import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRFrame from "../assets/qr-frame.svg";
import QRReader from "../components/QRReader";
import QRFrameAlt from "../assets/qr-frame-alt.svg";
import Cross from "../assets/cross.svg";

const Login = () => {
  const navigate = useNavigate();

  const scanner = useRef();

  const [qrContent, setQrContent] = useState("");

  const onScanSuccess = async (result) => {
    console.log(result);
    console.log("QR Code Scanned. Authenticating");
    scanner?.current?.stop();

    const response = await fetch(
      import.meta.env.VITE_API_URL + "/authenticate",
      {
        method: "POST",
        body: JSON.stringify({ or_no: result.data }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      console.log("Success LOGIN");
      console.log(json);

      localStorage.setItem("auth", JSON.stringify({ user: json.data }));

      navigate("/home", { replace: true });
    } else {
      setIsScanFailed(true);
      // alert("Authentication Failed");
      // window.location.reload(false);
    }
  };

  const onScanFail = (err) => {
    console.log(err);
  };

  const [isScanFailed, setIsScanFailed] = useState(false);

  return isScanFailed ? (
    <div className="failed-container container">
      <h1>COMMITTEE</h1>

      <div className="cross-box-wrapper">
        <div className="frame">
          <img src={QRFrameAlt} alt="" />
        </div>
        <div className="cross">
          <img src={Cross} alt="" />
        </div>
      </div>

      <p className="description">Authentication Failed</p>

      <div className="buttons">
        <div
          className="primary"
          onClick={() => {
            window.location.reload(false);
          }}
        >
          Scan again
        </div>
      </div>
    </div>
  ) : (
    <div className="login-container container">
      <h1>COMMITTEE</h1>
      {/* <div className="qr-reader">
        {/* OR *
        <video ref={videoRef}></video>
        <div ref={qrBoxRef} className="qr-box">
          {!videoRef?.current && (
            <img src={QRFrame} alt="" className="qr-frame" />
          )}
        </div>

        {qrContent && (
          <p
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 99999,
              color: "white",
            }}
          >
            Scanned Result: {qrContent}
          </p>
        )}
      </div> */}

      <QRReader
        onScanSuccess={onScanSuccess}
        onScanFail={onScanFail}
        scanner={scanner}
      />
      <p className="description">Scan QR Code</p>
    </div>
  );
};
export default Login;
