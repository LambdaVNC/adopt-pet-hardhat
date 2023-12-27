import { Alert, Button } from "@mui/material";
import React from "react";

const TxInfo = ({ message, dismiss }) => {
  return (
    <Alert severity="info">
      Waiting For:
      <br /> {message}
      <Button sx={{ mx: 3 }} variant="contained" color="info" onClick={dismiss}>
        Dismiss
      </Button>
    </Alert>
  );
};

export default TxInfo;
