const WalletNotDetected = () => {
  return (
    <div className="container" style={{ fontFamily: "Montserrat" }}>
      <h2>
        Wallet not detected. Please download{" "}
        <a target="_blank" className="link" href="https://metamask.io/download">
          Metamask Browser Extension
        </a>
      </h2>
    </div>
  );
};

export default WalletNotDetected;
