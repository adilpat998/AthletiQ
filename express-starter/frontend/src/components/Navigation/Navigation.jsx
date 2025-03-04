import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="home-button">Home</NavLink>
      <ProfileButton className="profile-button" />
    </nav>
  );
}

export default Navigation;
