import { Button, Container, Form, Image, InputGroup, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import NotificationPanel from "./NotificationPanel";
import { useState } from "react";
import SearchPanel from "./SearchPanel";

function Header() {
  const { token, logout, loggedUser } = useAuthContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

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
            <div className="d-flex align-items-center">
              <Form className="me-3 w-100" onSubmit={handleSearch}>
                <InputGroup style={{width: '30em'}}>
                <Form.Control
                    type="search"
                    placeholder="Search form communities or users..."
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)}
                  />
                  <InputGroup.Text as={Button} type="submit" variant='outline-secondary' className="hovering"><i className="bi bi-search" /></InputGroup.Text>
                </InputGroup>
              </Form>
              <div className="d-flex align-items-center me-3">
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
                <NavLink className="d-flex align-items-center" onClick={logout}>
                  <i className="bi bi-box-arrow-right fs-3 me-3" />
                </NavLink>
              </div>
            </div>
          </>
        )}
      </Container>
      <SearchPanel show={showSearch} handleClose={()=>setShowSearch(false)} searchTerm={searchTerm} />
    </Navbar>
  );
}

export default Header;
