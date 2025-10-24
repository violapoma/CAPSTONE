import {
  Button,
  Container,
  Form,
  Image,
  InputGroup,
  Navbar,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import NotificationPanel from "./NotificationPanel";
import { useState } from "react";
import SearchPanel from "./SearchPanel";

function Header() {
  const { token, logout, loggedUser } = useAuthContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [showNotif, setShowNotif] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSearch(true);
    }
  };

  return (
    <Navbar expand="lg" className="navbarStyle">
      <Container className="d-flex align-items-center justify-content-between">
        <Navbar.Brand
          as={Link}
          to="/"
          className="py-0 me-2 d-flex align-items-center"
        >
          <Image
            src="/imgs/chitchat-logo.png"
            style={{ width: "4em" }}
            className="me-2"
          />
          <h1 className="fs-3"> CHITCHAT</h1>
        </Navbar.Brand>

        {token && loggedUser && (
          <>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            <Navbar.Collapse
              id="responsive-navbar-nav"
              className="d-lg-flex justify-content-lg-end flex-grow-1"
            >
              {/* 3. BARRA DI RICERCA */}
              <Form
                onSubmit={handleSearch}
                // w-100 per mobile, max-width 30em centrato in lg, margine a destra
                className="w-100 my-2 my-lg-0 mx-auto mx-lg-0 ms-lg-auto"
                style={{ maxWidth: "30em" }}
              >
                <InputGroup>
                  <Form.Control
                    type="search"
                    placeholder="Search for communities or users..."
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <InputGroup.Text
                    as={Button}
                    type="submit"
                    variant="outline-secondary"
                    className="hovering"
                  >
                    <i className="bi bi-search" />
                  </InputGroup.Text>
                </InputGroup>
              </Form>

              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center ms-lg-4 me-3 mt-2 mt-lg-0">
                <NavLink
                  to={"/avatar"}
                  className="d-flex align-items-center py-2 py-lg-0 me-lg-3"
                >
                  <i className="bi bi-controller fs-3 me-3" /> Avatar
                </NavLink>
                <NavLink
                  to={"/communities"}
                  className="d-flex align-items-center py-2 py-lg-0 me-lg-3"
                >
                  <i className="bi bi-layout-wtf fs-3 me-3" /> Communities
                </NavLink>
                <div className="w-100 d-flex align-items-center jusitfy-content-between">
                  <NotificationPanel />
                  <div
                    className="d-flex align-items-center ms-3 cursorPointer" // Assicurati che 'cursorPointer' sia definito nel tuo CSS
                    onClick={logout}
                  >
                    <i className="bi bi-box-arrow-right fs-3 me-3" /> Logout
                  </div>
                </div>
              </div>
            </Navbar.Collapse>
          </>
        )}
      </Container>

      <SearchPanel
        show={showSearch}
        handleClose={() => setShowSearch(false)}
        searchTerm={searchTerm}
      />
    </Navbar>
  );
}

export default Header;
