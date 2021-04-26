import { useState, useEffect, useRef } from 'react';

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

/**
 *
 * @param tx.hash string
 * @param tx.providerUrl string
 * @param tx.pollingInterval number default value is a second
 * @returns transaction status
 */
export function useWaitForTransactionHash({
  hash,
  providerUrl,
  pollingInterval = 1000, // 1 second
}: {
  hash: string;
  providerUrl: string;
  pollingInterval?: number;
}): { status: TransactionStatus } {
  const [status, setStatus] = useState<TransactionStatus>('PENDING');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Send fetch request base on pollingInterval (pull) to get the receipt
  useEffect(() => {
    if (hash) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          fetchReceipt(hash, providerUrl)
            .then(result => {
              if (!result.result) {
                if (status !== 'PENDING') {
                  setStatus('PENDING');
                }
              } else if (result.result.status === '0x0') {
                setStatus('FAILED');
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                }
              } else {
                setStatus('SUCCESS');
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                }
              }
            })
            .catch(console.error);
        }, pollingInterval);
      }
    }
    return () => {
      if (status !== 'PENDING') {
        setStatus('PENDING');
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hash, status, pollingInterval, providerUrl]);

  // reset to pending if hash has been changed
  useEffect(() => {
    setStatus('PENDING');
  }, [hash]);

  return {
    status,
  };
}
