import { Alert, Button } from "@mui/material";
import React from "react";

const TxError = ({ message, dismiss }) => {
  return (
    <Alert severity="error">
      Error Sending Transaction:
      <br /> {message}
      <Button
        sx={{ mx: 3 }}
        variant="contained"
        color="error"
        onClick={dismiss}
      >
        Dismiss
      </Button>
    </Alert>
  );
};

export default TxError;
