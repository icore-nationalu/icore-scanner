import Logo from "../assets/icore-logo.png";
import Close from "../assets/close.svg";
import CloseAlt from "../assets/close-alt.svg";
const Header = ({ onClick, color }) => {
  return (
    <header>
      <div>
        <div className="wrapper" onClick={onClick}>
          {onClick && <img src={color == "alt" ? CloseAlt : Close} alt="" />}
        </div>
      </div>
      <div className="wrapper">
        <img src={Logo} alt="" />
      </div>
    </header>
  );
};
export default Header;
