import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRReader from "../components/QRReader";

import QRFrameAlt from "../assets/qr-frame-alt.svg";
import Cross from "../assets/cross.svg";

const Participants = () => {
  const navigate = useNavigate();

  const [station, setStation] = useState("");

  const scanner = useRef();

  const [qrContent, setQrContent] = useState("");

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth) {
      navigate("/", { replace: true });
    } else {
      console.log("AAAA");
      console.log(auth.user.station);
      setStation(auth.user.station);
    }
  }, []);

  const onScanSuccess = async (result) => {
    console.log(result);
    console.log("end qr");
    scanner?.current?.stop();
    console.log("Station");
    const auth = JSON.parse(localStorage.getItem("auth"));
    console.log(JSON.parse(localStorage.getItem("auth")));
    const response = await fetch(import.meta.env.VITE_API_URL + "/add-entry", {
      method: "POST",
      body: JSON.stringify({ or_no: result.data, station: auth.user.station }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (response.ok) {
      console.log("Success LOGIN");
      console.log(json);

      navigate("/success", { replace: false, state: { or: result.data } });
      // localStorage.setItem("auth", JSON.stringify({ user: json.data }));

      // navigate("/home", { replace: true });
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
      <h1>PARTICPANT</h1>

      <div className="cross-box-wrapper">
        <div className="frame">
          <img src={QRFrameAlt} alt="" />
        </div>
        <div className="cross">
          <img src={Cross} alt="" />
        </div>
      </div>

      <p className="description">Registration Not Found</p>

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
  ) : (
    <div className="login-container container">
      <div className="station-name">
        <p>{station}</p>
      </div>

      <QRReader
        onScanSuccess={onScanSuccess}
        onScanFail={onScanFail}
        scanner={scanner}
      />

      <p className="description">Scan QR Code</p>

      {/* <div className="station-name-footer">
        <p>Station Name</p>
      </div> */}
    </div>
  );
};
export default Participants;
