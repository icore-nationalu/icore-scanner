import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRReader from "../components/QRReader";

import QRFrameAlt from "../assets/qr-frame-alt.svg";
import Cross from "../assets/cross.svg";
import Header from "../components/Header";

const Participants = () => {
  const navigate = useNavigate();

  const [station, setStation] = useState("");

  const scanner = useRef();

  const [qrContent, setQrContent] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth) {
      navigate("/", { replace: true });
    } else {
      setStation(auth.user.station);
    }
  }, []);

  const onScanSuccess = async (result) => {
    scanner?.current?.stop();

    const auth = JSON.parse(localStorage.getItem("auth"));

    const response = await fetch(import.meta.env.VITE_API_URL + "/add-entry", {
      method: "POST",
      body: JSON.stringify({ or_no: result.data, station: auth.user.station }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (response.ok) {
      navigate("/success", { replace: false, state: { name: json.data.name } });
    } else {
      const { detail } = json;

      if (detail["type"] == "error") {
        setErrorMessage(detail["message"]);
      } else if (detail["type"] == "info") {
        setInfoMessage(detail["message"]);
      }
      setIsScanStatus(detail["type"]);
    }
  };

  const onScanFail = (err) => {
    console.log(err);
  };

  const [isScanStatus, setIsScanStatus] = useState("");
  return isScanStatus == "error" ? (
    <main className="error">
      <Header />
      <div className="failed-container error-container container">
        <h1 className="highlight-header">{station}</h1>

        <div className="cross-box-wrapper">
          <div className="frame">
            <img src={QRFrameAlt} alt="" />
          </div>
          <div className="cross">
            <img src={Cross} alt="" />
          </div>
        </div>

        <p className="description negative">{errorMessage}</p>

        <div className="buttons">
          <div
            className="primary"
            onClick={() => {
              window.location.reload(false);
            }}
          >
            Scan another QR Code
          </div>
          <div
            className="secondary"
            onClick={() => {
              navigate("/home");
            }}
          >
            Back to Home
          </div>
        </div>
      </div>
    </main>
  ) : isScanStatus == "info" ? (
    <main className="info">
      <Header />
      <div className="failed-container info-container container">
        <h1 className="highlight-header">{station}</h1>

        <div className="cross-box-wrapper">
          <div className="frame">
            <img src={QRFrameAlt} alt="" />
          </div>
          <div className="cross">
            <img src={Cross} alt="" />
          </div>
        </div>

        <p className="description negative">{infoMessage}</p>

        <div className="buttons">
          <div
            className="primary"
            onClick={() => {
              window.location.reload(false);
            }}
          >
            Scan another QR Code
          </div>
          <div
            className="secondary"
            onClick={() => {
              navigate("/home");
            }}
          >
            Back to Home
          </div>
        </div>
      </div>
    </main>
  ) : (
    <main>
      <Header
        onClick={() => {
          navigate("/home");
        }}
      />
      <div className="login-container container">
        <h1 className="highlight-header">{station}</h1>

        <QRReader
          onScanSuccess={onScanSuccess}
          onScanFail={onScanFail}
          scanner={scanner}
        />

        <p className="description">Scan Particpant's QR Code</p>
      </div>
    </main>
  );
};
export default Participants;
