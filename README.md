# Welcome to use-wait-for-transaction-hash 👋

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D10-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: jellydn](https://img.shields.io/twitter/follow/jellydn.svg?style=social)](https://twitter.com/jellydn)

> Simple hook for getting transaction status from the ETH network.

### ✨ [Demo](https://use-wait-for-transaction-hash.vercel.app/)

## Prerequisites

- React >=16.8

## Install

```sh
yarn add use-wait-for-transaction-hash
```

## Usage

```js
import {
  useWaitForTransactionHash,
  useClockWatch,
} from 'use-wait-for-transaction-hash';

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
```

## Run tests

```sh
yarn test
```

## Author

👤 **Huynh Duc Dung**

- Website: https://productsway.com/
- Twitter: [@jellydn](https://twitter.com/jellydn)
- Github: [@jellydn](https://github.com/jellydn)

## Show your support

Give a ⭐️ if this project helped you!

[![support us](https://img.shields.io/badge/become-a patreon%20us-orange.svg?cacheSeconds=2592000)](https://www.patreon.com/jellydn)

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
