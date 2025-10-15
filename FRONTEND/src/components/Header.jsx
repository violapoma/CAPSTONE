import { Container, Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
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
          CHITCHAT
        </Navbar.Brand>
        {token && loggedUser && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <NavDropdown
                  title={
                    <Image
                      src={loggedUser.profilePic}
                      roundedCircle
                      className="dropdownAvatar"
                    />
                  }
                  id="nav-avatar-dropdown"
                  align="end"
                >
                  <NavDropdown.Header>
                    {loggedUser.username}
                  </NavDropdown.Header>
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