import {
  Container,
  Image,
  ListGroup,
  Nav,
  NavDropdown,
  Navbar,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import SingleNotification from "./Helpers/SingleNotification";
import NotificationPanel from "./NotificationPanel";
//import Logo from "./Logo"; //TODO: logo component

function Header() {
  const { token, logout, loggedUser } = useAuthContext();

  return (
    <Navbar expand="lg" className="navbarStyle">
      <Container className="d-flex align-items-center">
        <Navbar.Brand
          as={Link}
          to="/"
          className="py-0 me-2 d-flex align-items-center"
        >
          {/* <Logo />  TODO: LOGO HERE*/}
          <Image
            src="/imgs/chitchat-logo.png"
            style={{ width: "4em" }}
            className="me-2"
          />
          <h1 className="fs-3"> CHITCHAT</h1>
        </Navbar.Brand>
        {token && loggedUser && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <NavLink to={"/avatar"} className="d-flex align-items-center">
                  <i className="bi bi-controller fs-3 me-3" />
                </NavLink>
                <NavLink
                  to={"/communities"}
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-layout-wtf fs-3 me-3" />
                </NavLink>
                <NotificationPanel />
                <NavDropdown
                  title={
                    <Image
                      src={loggedUser.usesAvatar ? loggedUser.avatarRPM : loggedUser.profilePic}
                      roundedCircle
                      className="dropdownAvatar"
                    />
                  }
                  id="nav-avatar-dropdown"
                  align="end"
                >
                  <NavDropdown.Header>{loggedUser.username}</NavDropdown.Header>
                  <NavDropdown.Item to="/" as={Link}>
                    View profile
                  </NavDropdown.Item>
                  <NavDropdown.Item to="/communities" as={Link}>
                    Browse communities
                  </NavDropdown.Item>
                  <NavDropdown.Item to="#" as={Link}>
                    Propose a new community
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item to="/" as={Link} onClick={logout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;
