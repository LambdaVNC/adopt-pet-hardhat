import { ButtonGroup, Button } from "@mui/material";
import React from "react";

const Navbar = ({ address, setView }) => {
  return (
    <div className="navbar-container">
      <ButtonGroup
        variant="outlined"
        color="warning"
        aria-label="text button group"
      >
        <Button onClick={() => setView("home")}>
          {" "}
          <div style={{ fontFamily: "Montserrat" }}>Home</div>
        </Button>
        <Button onClick={() => setView("profile")}>
          <div style={{ fontFamily: "Montserrat" }}>My Profile</div>
        </Button>
      </ButtonGroup>
      <div className="user-account">
        <div style={{ fontFamily: "Audiowide", letterSpacing: "1px" }}>
          WELCOME {address}{" "}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
