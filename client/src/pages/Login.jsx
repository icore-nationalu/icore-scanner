import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRFrame from "../assets/qr-frame.svg";
import QRReader from "../components/QRReader";
import QRFrameAlt from "../assets/qr-frame-alt.svg";
import Cross from "../assets/cross.svg";
import Logo from "../assets/icore-logo.png";

import Close from "../assets/close.svg";
import Header from "../components/Header";

const Login = () => {
  const navigate = useNavigate();

  const scanner = useRef();

  const [qrContent, setQrContent] = useState("");

  const onScanSuccess = async (result) => {
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
      localStorage.setItem("auth", JSON.stringify({ user: json.data }));

      navigate("/home", { replace: true });
    } else {
      setIsScanFailed(true);
    }
  };

  const onScanFail = (err) => {
    console.log(err);
  };

  const [isScanFailed, setIsScanFailed] = useState();

  return isScanFailed ? (
    <main className="error">
      <Header />
      <div className="failed-container error-container container">
        <h1 className="highlight-header">Sign in Committee</h1>

        <div className="cross-box-wrapper">
          <div className="frame">
            <img src={QRFrameAlt} alt="" />
          </div>
          <div className="cross">
            <img src={Cross} alt="" />
          </div>
        </div>

        <p className="description negative">Authentication Failed</p>

        <div className="buttons">
          <div
            className="primary"
            onClick={() => {
              window.location.reload(false);
            }}
          >
            Scan another QR Code
          </div>
        </div>
      </div>
    </main>
  ) : (
    <main>
      <Header />
      <div className="login-container container">
        <h1 className="highlight-header">Sign in Committee</h1>
        <QRReader
          onScanSuccess={onScanSuccess}
          onScanFail={onScanFail}
          scanner={scanner}
        />
        <p className="description">Scan Committee's QR Code</p>
      </div>
    </main>
  );
};
export default Login;
