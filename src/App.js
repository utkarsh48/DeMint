import "bootstrap/dist/css/bootstrap.min.css";
import Minter from "./components/Minter";
import { Routes, Route, useNavigate } from "react-router-dom";
import Auth from "./components/Auth";
import { getWallet, mintNFT } from "./util/interact";
import { useEffect, useState } from "react";
import { CONNECTED, NOT_CONNECTED, NO_WALLET } from "./constants/status";
import TopNav from "./components/TopNav";
import Sidebar from "./components/SideBar";
import { Container, Toast, ToastContainer } from "react-bootstrap";
import Home from "./components/Home";
import { getTransactionsOf } from "./util/scan";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const initialFormOptions = {
  name: "",
  description: "",
  asset: null,
  uploadType: "url",
};

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [formOptions, setFormOptions] = useState({ ...initialFormOptions });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const input = e.currentTarget;
    if (
      input.name === "asset" &&
      input.files &&
      input.files.length > 0 &&
      input.files[0]
    ) {
      setFormOptions({
        ...formOptions,
        [input.name]: input.files[0],
      });
      return;
    }
    setFormOptions({
      ...formOptions,
      [input.name]: input.value,
    });
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setStatus(CONNECTED);
        } else {
          setWalletAddress("");
          setStatus(NOT_CONNECTED);
        }
      });
    } else {
      setStatus(NO_WALLET);
    }
    setLink("");
  }

  useEffect(() => {
    (async () => {
      const { status: currentStatus, address } = await getWallet({
        connected: true,
      });
      setStatus(currentStatus);
      setLink("");
      setWalletAddress(address);
      addWalletListener();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (walletAddress) {
        const {
          data: { result },
        } = await getTransactionsOf(walletAddress);
        result &&
          Array.isArray(result) &&
          setTransactions(
            result.filter((txn) =>
              new RegExp(contractAddress, "i").test(txn.to)
            )
          );
      } else {
        setTransactions([]);
      }
    })();
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) {
      navigate("/auth");
    }
  }, [navigate, walletAddress]);

  useEffect(() => {
    setShowToast(true);
  }, [status]);

  const connectWalletPressed = async () => {
    const { status: currentStatus, address } = await getWallet();
    setStatus(currentStatus);
    setWalletAddress(address);
    setLink("");
  };

  const handleMintPressed = async (e) => {
    e.preventDefault();
    const { uploadType } = formOptions;
    const {
      success,
      status: currentStatus,
      link: currentLink,
    } = await mintNFT(formOptions, uploadType === "file");
    setStatus(currentStatus);
    setLink(currentLink);
    if (success) {
      setFormOptions({ ...initialFormOptions });
    }
  };

  return (
    <>
      <TopNav wAddress={walletAddress} connectWallet={connectWalletPressed} />
      <main className="bg-light mt-5 pt-2">
        <div className="d-flex h-100">
          {walletAddress && <Sidebar />}
          <Container
            fluid
            style={{ minHeight: "calc(100vh - 56px)", marginLeft: "5rem" }}
            className="py-2"
          >
            <Routes>
              <Route
                path="/auth"
                element={
                  <Auth
                    status={status}
                    walletAddress={walletAddress}
                    connectWalletPressed={connectWalletPressed}
                  />
                }
              />
              <Route
                path="/mint"
                element={
                  <Minter
                    connectWalletPressed={connectWalletPressed}
                    formOptions={formOptions}
                    onChange={handleChange}
                    onMintPress={handleMintPressed}
                  />
                }
              />
              <Route path="/" element={<Home transactions={transactions} />} />
            </Routes>
          </Container>
        </div>
      </main>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={link ? 7000 : 5000}
          autohide
        >
          <Toast.Header className="justify-content-between">
            <span>{status}</span>
          </Toast.Header>
          {link && (
            <Toast.Body>
              <a rel="noreferrer" target="_blank" href={link}>
                {link}
              </a>
            </Toast.Body>
          )}
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
