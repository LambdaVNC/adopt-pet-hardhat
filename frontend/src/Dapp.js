import { useEffect, useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import PetItem from "./components/PetItem";
import TxError from "./components/TxError";
import TxInfo from "./components/TxInfo";
import WalletNotDetected from "./components/WalletNotDetected";
import ConnectWallet from "./components/ConnectWallet";
import { ethers } from "ethers";
import contractAddress from "./contracts/contract-address-localhost.json";
import artifactAddress from "./contracts/PetAdoption.json";

const HARDHAT_NETWORK_ID = 31337;

function Dapp() {
  const [pets, setPets] = useState([]);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [ownedPet, setOwnedPet] = useState([]);
  const [txError, setTxError] = useState(undefined);
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [txInfo, setTxInfo] = useState(undefined);
  const [view, setView] = useState("home");

  useEffect(() => {
    async function fetchPets() {
      const res = await fetch("/pets.json");
      const data = await res.json();
      setPets(data);
    }

    fetchPets();
  }, []);

  async function connectWallet() {
    try {
      // Bağlı olan cüzdan adresini al
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const currentAccount = accounts[0];
      initializeDapp(currentAccount);

      window.ethereum.on("accountsChanged", ([newAddress]) => {
        if (newAddress === undefined) {
          setSelectedAddress(undefined);
          setContract(undefined);
          setAdoptedPets([]);
          setTxError(undefined);
          setTxInfo(undefined);
          setView("home");
          setOwnedPet([]);
          return;
          initializeDapp(newAddress);
        }
      });

      checkNetwork();
    } catch (error) {
      if (error.code == 4001) {
        // EIP-1193 userRejectedRequest Error
        console.log("--- User Rejected Request ---");
      } else {
        console.log(error);
      }
    } finally {
      setTxInfo(undefined);
    }
  }

  async function initializeDapp(address) {
    setSelectedAddress(address);
    const contract = await initContract();

    getAdoptedPets(contract);
  }

  async function initContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress.PetAdoption,
      artifactAddress.abi,
      await provider.getSigner(0)
    );

    setContract(contract);
    return contract;
  }
  async function getAdoptedPets(contract) {
    try {
      const adoptedPets = await contract.getAllAdoptedPets();
      const ownedPets = await contract.getAllAdoptedPetsByOwner();
      if (adoptedPets.length > 1) {
        setAdoptedPets(adoptedPets.map((petIdx) => Number(petIdx)));
      } else {
        setAdoptedPets([]);
      }

      if (ownedPets.length > 1) {
        setOwnedPet(ownedPets.map((petIdx) => Number(petIdx)));
      } else {
        setOwnedPet([]);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function adoptPet(id) {
    try {
      const tx = await contract.adoptPet(id);
      setTxInfo(tx.hash);
      const receipt = await tx.wait();

      await new Promise((res) => setTimeout(res, 2000));

      if (receipt.status === 0) {
        throw new Error("Transaction failed!");
      }

      setAdoptedPets([...adoptedPets, id]);
      setOwnedPet([...ownedPet, id]);
    } catch (e) {
      setTxError(e?.reason);
    } finally {
      setTxInfo(undefined);
    }
  }

  async function switchNetwork() {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`;

    return await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  }

  async function checkNetwork() {
    const hardhatNetworkId = HARDHAT_NETWORK_ID.toString();
    if (window.ethereum.networkVersion !== hardhatNetworkId) {
      alert("You are on wrong network! Changing network on Hardhat.");

      switchNetwork();
      return;
    }
  }

  if (!window.ethereum) {
    return <WalletNotDetected />;
  }

  if (!selectedAddress) {
    return <ConnectWallet connect={connectWallet} />;
  }

  return (
    <div className="container">
      {txInfo && (
        <TxInfo dismiss={() => setTxInfo(undefined)} message={txInfo} />
      )}
      {txError && (
        <TxError dismiss={() => setTxError(undefined)} message={txError} />
      )}
      <br />
      <Navbar setView={setView} address={selectedAddress} />
      <div className="items">
        {view === "home"
          ? pets.map((pet) => (
              <PetItem
                key={pet.id}
                pet={pet}
                adoptPet={() => adoptPet(pet.id)}
                disabled={adoptedPets.includes(pet.id)}
              />
            ))
          : pets
              .filter((pet) => ownedPet.includes(pet.id))
              .map((pet) => (
                <PetItem
                  key={pet.id}
                  pet={pet}
                  adoptPet={() => {}}
                  disabled={true}
                />
              ))}
      </div>
    </div>
  );
}

export default Dapp;
