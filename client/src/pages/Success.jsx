import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRFrameAlt from "../assets/qr-frame-alt.svg";
import Check from "../assets/check.svg";
import Header from "../components/Header";

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
    <main className="success">
      <Header
        onClick={() => {
          navigate("/participants");
        }}
        color="alt"
      />
      <div className="container success-container">
        <h1 className="highlight-header">{station}</h1>
        <div className="cross-box-wrapper">
          <div className="frame">
            <img src={QRFrameAlt} alt="" />
          </div>
          <div className="cross">
            <img src={Check} alt="" />
          </div>
        </div>
        <p className="description negative">{location.state.name}</p>

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
    </main>
  );
};
export default Success;
