import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useWaitForTransactionHash } from "use-wait-for-transaction-hash";

import "./App.css";
import Box from "./components/Box/Box";

interface Props {
  providerUrl: string;
  transactionHash: string;
}

function Notify({ providerUrl, transactionHash }: Props) {
  const { status } = useWaitForTransactionHash({
    hash: transactionHash,
    providerUrl,
  });

  // Measure performance base on the transaction status
  useEffect(() => {
    switch (status) {
      case "SUCCESS":
        toast.success("This is a success transaction");
        break;

      case "FAILED":
        toast.error("This is a failed transaction");
        break;
      default:
    }
  }, [status]);

  // Clear previous toast message and show checking information
  useEffect(() => {
    toast.dismiss();
    toast.loading("Checking..." + transactionHash);
  }, [transactionHash]);

  return (
    <Box>
      <pre>Hash: {transactionHash}</pre>
      <pre>Provider Url: {providerUrl}</pre>
      <pre>Status: {status}</pre>
    </Box>
  );
}

function App() {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <Box>
          <button
            onClick={() => {
              toggle ? setToggle(false) : setToggle(true);
            }}
          >
            Toggle the transaction hash
          </button>
        </Box>
        <Notify
          providerUrl="https://data-seed-prebsc-1-s1.binance.org:8545"
          transactionHash={
            toggle
              ? "0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5"
              : "0x35403cfc33cababac41ad998dff9038c57945ac7cbe9f22e5bdfbf89a8756bd7"
          }
        />
      </header>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
