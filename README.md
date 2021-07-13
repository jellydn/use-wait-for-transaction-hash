# Welcome to use-wait-for-transaction-hash 👋

[![Version](https://img.shields.io/npm/v/use-wait-for-transaction-hash.svg)](https://npmjs.org/package/use-wait-for-transaction-hash)
[![Downloads/week](https://img.shields.io/npm/dw/use-wait-for-transaction-hash.svg)](https://npmjs.org/package/use-wait-for-transaction-hash)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D10-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: jellydn](https://img.shields.io/twitter/follow/jellydn.svg?style=social)](https://twitter.com/jellydn)

> Simple hook for getting transaction status from the ETH network.

## ✨ [Demo](https://use-wait-for-transaction-hash.vercel.app/)

## Prerequisites

- React >=16.8

## Install

```sh
yarn add use-wait-for-transaction-hash
```

## Usage

Simple usage with `Notify component`

```js
import { useWaitForTransactionHash } from 'use-wait-for-transaction-hash';

interface Props {
  providerUrl: string;
  transactionHash: string;
}

function Notify({ providerUrl, transactionHash }: Props) {
  const { status } = useWaitForTransactionHash({
    hash: transactionHash,
    providerUrl,
  });
  return (
    <div>
      <pre>Hash: {transactionHash}</pre>
      <pre>Provider Url: {providerUrl}</pre>
      <pre>Status: {status}</pre>
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

For more detail, please check the example app (`example` folder),

## Recipes

<details>
 <summary>Usage with react-hot-toast</summary>

```js
import { useEffect } from 'react';
import { useWaitForTransactionHash } from 'use-wait-for-transaction-hash';
import toast, { Toaster } from 'react-hot-toast';

function Notify({ providerUrl, transactionHash }: Props) {
  const { status } = useWaitForTransactionHash({
    hash: transactionHash,
    providerUrl,
  });

  // measure performance base on the transaction status
  useEffect(() => {
    switch (status) {
      case 'SUCCESS':
        toast.success('This is a success transaction');
        break;

      case 'FAILED':
        toast.error('This is a failed transaction');
        break;
      default: // PENDING
    }
  }, [status]);

  // clear previous toast message and show checking information
  useEffect(() => {
    toast.dismiss();
    toast.loading('Checking...' + transactionHash);
  }, [transactionHash]);

  return (
    <div>
      <pre>Hash: {transactionHash}</pre>
      <pre>Provider Url: {providerUrl}</pre>
      <pre>Status: {status}</pre>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Notify
        providerUrl="https://data-seed-prebsc-1-s1.binance.org:8545"
        transactionHash="0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5"
      />

      <Toaster position="top-right" />
    </div>
  );
}
```

</details>

## Run tests

```sh
yarn test
```

## Author

👤 **Huynh Duc Dung**

- Website: https://productsway.com/
- Twitter: [@jellydn](https://twitter.com/jellydn)
- Github: [@jellydn](https://github.com/jellydn)

### Stargazers 🌟

[![Stargazers repo roster for jellydn/use-wait-for-transaction-hash](https://reporoster.com/stars/jellydn/use-wait-for-transaction-hash)](https://github.com/jellydn/use-wait-for-transaction-hash/stargazers)


## Show your support

Give a ⭐️ if this project helped you!

[![support us](https://img.shields.io/badge/become-a patreon%20us-orange.svg?cacheSeconds=2592000)](https://www.patreon.com/jellydn)

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
