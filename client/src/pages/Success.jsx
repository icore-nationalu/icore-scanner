import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRFrameAlt from "../assets/qr-frame-alt.svg";
import Check from "../assets/check.svg";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [station, setStation] = useState("");
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
  useEffect(() => {
    console.log(location);
  }, []);
  return (
    <div className="container success-container">
      <div className="station-name">
        <p>{station}</p>
      </div>
      <div className="check-box-wrapper">
        <div className="frame">
          <img src={QRFrameAlt} alt="" />
        </div>
        <div className="check">
          <img src={Check} alt="" />
        </div>
      </div>
      <p className="description">Validated</p>

      <div className="buttons">
        <div
          className="primary"
          onClick={() => {
            navigate("/participants");
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
  );
};
export default Success;
