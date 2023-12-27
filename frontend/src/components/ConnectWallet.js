import { Fingerprint, FingerprintRounded } from "@mui/icons-material";
import {
  Button,
  Container,
  IconButton,
  Typography,
  dividerClasses,
} from "@mui/material";

const ConnectWallet = ({ connect }) => {
  return (
    <Container sx={{ mt: 15, textAlign: "center" }}>
      <Typography variant="h2">
        <div style={{ fontFamily: "Audiowide", letterSpacing: "1px" }}>
          Please, connect the wallet to enter the application.
        </div>
      </Typography>
      <br />
      <Container>
        <Button
          sx={{
            fontSize: 25,
            backgroundColor: "#cd6116",
            "&:hover": "#ff9100",
          }}
          size="large"
          onClick={connect}
          variant="contained"
          color="warning"
        >
          <Fingerprint sx={{ mr: 1, height: 50 }} />
          <div style={{ fontFamily: "Audiowide", letterSpacing: "1px" }}>
            Connect Wallet
          </div>
        </Button>
      </Container>
    </Container>
  );
};

export default ConnectWallet;
