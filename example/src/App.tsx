import React, { useState } from 'react';
import {
  useWaitForTransactionHash,
  useClockWatch,
} from 'use-wait-for-transaction-hash';
import './App.css';

interface Props {
  providerUrl: string;
  transactionHash: string;
  onStatusChange?: (status: string) => void;
}

function Notify({
  providerUrl,
  transactionHash,
  onStatusChange = console.warn,
}: Props) {
  const { counter, actions } = useClockWatch();
  const { status } = useWaitForTransactionHash({
    hash: transactionHash,
    providerUrl,
    onStatusChange: status => {
      switch (status) {
        case 'PENDING':
          actions.start();
          break;

        default:
          actions.stop();
      }
    },
  });
  return (
    <div>
      <pre>Hash: {transactionHash}</pre>
      <pre>Provider Url: {providerUrl}</pre>
      <pre>Status: {status}</pre>
      <pre>Clock Watch: {counter}ms</pre>
    </div>
  );
}

function App() {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => (toggle ? setToggle(false) : setToggle(true))}>
          Toggle the transaction hash
        </button>
        <Notify
          providerUrl="https://data-seed-prebsc-1-s1.binance.org:8545"
          transactionHash={
            toggle
              ? '0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5'
              : '0x35403cfc33cababac41ad998dff9038c57945ac7cbe9f22e5bdfbf89a8756bd7'
          }
        />
      </header>
    </div>
  );
}

export default App;
