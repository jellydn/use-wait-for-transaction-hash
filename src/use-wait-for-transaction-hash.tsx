import QuickLRU from "quick-lru";
import { useEffect, useState } from "react";

import { extractAuthFromUrl } from "./extract-auth-from-url";

const lru = new QuickLRU({ maxSize: 1000 });
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

type TransactionReceipt = {
  id: number;
  jsonrpc: "2.0";
  result:
    | {
        transactionHash: string;
        gasUsed: string;
        cumulativeGasUsed: string;
        blockHash: string;
        blockNumber: number;
        status: "0x0" | "0x1";
        from: string;
        to: string;
      }
    | undefined;
};

const fetchReceipt = async (
  txHash: string,
  url: string,
): Promise<TransactionReceipt> => {
  const cacheKey = `${txHash}-${url}`;
  if (lru.has(cacheKey)) {
    return lru.get(cacheKey) as TransactionReceipt;
  }

  const urlWithCredential = extractAuthFromUrl(url);
  const receipt = urlWithCredential?.url
    ? await fetch(urlWithCredential.url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${urlWithCredential.username}:${urlWithCredential.password}`,
          )}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getTransactionReceipt",
          params: [txHash],
          id: Date.now(),
        }),
      }).then(async (resp) => resp.json())
    : await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getTransactionReceipt",
          params: [txHash],
          id: Date.now(),
        }),
      }).then(async (resp) => resp.json());

  lru.set(cacheKey, receipt);
  return receipt;
};

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
  const [status, setStatus] = useState<TransactionStatus>("PENDING");

  // Send fetch request base on pollingInterval (pull) to get the receipt
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hash) {
      timer = setInterval(() => {
        fetchReceipt(hash, providerUrl)
          .then((result) => {
            if (!result.result) {
              if (status !== "PENDING") {
                setStatus("PENDING");
              }
            } else if (result.result.status === "0x0") {
              setStatus("FAILED");
              if (timer) {
                clearInterval(timer);
              }
            } else {
              setStatus("SUCCESS");
              if (timer) {
                clearInterval(timer);
              }
            }
          })
          .catch(console.error);
      }, pollingInterval);
    }

    return () => {
      if (status !== "PENDING") {
        setStatus("PENDING");
      }

      if (timer) {
        clearInterval(timer);
      }
    };
  }, [hash, pollingInterval, providerUrl]);

  // Reset to pending if hash has been changed
  useEffect(() => {
    setStatus("PENDING");
  }, [hash]);

  return {
    status,
  };
}
