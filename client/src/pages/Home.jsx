import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    station: "",
    name: "",
  });
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth) {
      navigate("/", { replace: true });
    } else {
      setData({ station: auth.user.station, name: auth.user.name });
    }
  }, []);
  return (
    <div className="container home-container">
      <div className="station-name">
        <p>{data.station}</p>
      </div>

      <p className="committee-name">{data.name}</p>

      <div className="buttons">
        <div
          className="primary"
          onClick={() => {
            navigate("/participants");
          }}
        >
          Scan QR Code
        </div>
        <div
          className="secondary"
          onClick={() => {
            localStorage.removeItem("auth");
            navigate("/");
          }}
        >
          Logout
        </div>
      </div>
    </div>
  );
};
export default Home;
