import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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
    <main>
      <Header />
      <div className="container home-container">
        <h1 className="highlight-header">{data.station}</h1>
        <div className="committee-details">
          <p className="name">{data.name}</p>
          <p className="label">Committee</p>
        </div>

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
    </main>
  );
};
export default Home;
