import { useState, useEffect } from 'react';

/**
 * Util hook for testing component
 */
export function useClockWatch() {
  const [counter, setCounter] = useState(0);
  const [mode, setMode] = useState<'START' | 'STOP' | 'PAUSE'>('PAUSE');

  const start = () => {
    setMode('START');
    setCounter(0);
  };
  const stop = () => {
    setMode('STOP');
  };

  useEffect(() => {
    let timer: any;
    if (mode === 'START') {
      timer = setInterval(() => {
        setCounter(prevCounter => prevCounter + 1);
      }, 1);
    }
    return () => {
      // reset counter
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [mode]);

  return {
    counter,
    actions: {
      start,
      stop,
    },
  };
}

type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

/**
 *
 * @param tx.hash string
 * @param tx.providerUrl string
 * @param tx.onChangeStatus function
 * @param tx.pollingInterval number default value is 0.5 second
 * @returns transaction status
 */
export function useWaitForTransactionHash({
  hash,
  providerUrl,
  onChangeStatus,
  pollingInterval = 500, // 0.5 second
}: {
  hash: string;
  providerUrl: string;
  onChangeStatus: (status: string) => void;
  pollingInterval?: number;
}) {
  const [status, setStatus] = useState<TransactionStatus>('PENDING');

  useEffect(() => {
    onChangeStatus(status);
  }, [status]);

  const fetchReceipt = (
    txHash: string,
    url: string
  ): Promise<{
    id: number;
    jsonrpc: '2.0';
    result: {
      transactionHash: string;
      gasUsed: string;
      cumulativeGasUsed: string;
      blockHash: string;
      blockNumber: number;
      status: '0x0' | '0x1';
      from: string;
      to: string;
    } | null;
  }> =>
    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: Date.now(),
      }),
    }).then(resp => resp.json());

  // Send fetch request every 0.5 second (pull) to get the receipt
  useEffect(() => {
    let timer: any;
    if (hash) {
      timer = setInterval(() => {
        fetchReceipt(hash, providerUrl)
          .then(result => {
            if (!result.result) {
              setStatus('PENDING');
            } else if (result.result.status === '0x0') {
              setStatus('FAILED');
              clearInterval(timer);
            } else {
              setStatus('SUCCESS');
              clearInterval(timer);
            }
          })
          .catch(console.error);
      }, pollingInterval);
    }
    return () => {
      setStatus('PENDING');
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [hash]);
  return {
    status,
  };
}
