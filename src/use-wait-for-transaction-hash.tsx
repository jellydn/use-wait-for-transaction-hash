import { useState, useEffect } from 'react';

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

/**
 *
 * @param tx.hash string
 * @param tx.providerUrl string
 * @param tx.onChangeStatus function
 * @param tx.pollingInterval number default value is a second
 * @returns transaction status
 */
export function useWaitForTransactionHash({
  hash,
  providerUrl,
  onChangeStatus,
  pollingInterval = 1000, // 1 second
}: {
  hash: string;
  providerUrl: string;
  onChangeStatus?: (status: TransactionStatus) => void;
  pollingInterval?: number;
}) {
  const [status, setStatus] = useState<TransactionStatus>('PENDING');

  useEffect(() => {
    if (onChangeStatus) onChangeStatus(status);
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

  // Send fetch request base on pollingInterval (pull) to get the receipt
  useEffect(() => {
    let timer: any;
    if (hash) {
      timer = setInterval(() => {
        fetchReceipt(hash, providerUrl)
          .then(result => {
            if (!result.result) {
              if (status !== 'PENDING') {
                setStatus('PENDING');
              }
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
      if (status !== 'PENDING') {
        setStatus('PENDING');
      }
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [hash]);
  return {
    status,
  };
}
