import '@testing-library/jest-dom/extend-expect';
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import 'isomorphic-fetch';
import * as React from 'react';

import {useWaitForTransactionHash} from '../dist/use-wait-for-transaction-hash.js';
import {server} from './mocks/server';

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
});
// Clean up after the tests are finished.
afterAll(() => {
  server.close();
});

test('should use wait transaction hash', async () => {
  const {result} = renderHook(() =>
    useWaitForTransactionHash({
      hash:
        '0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5',
      providerUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    }),
  );
  expect(result.current.status).toBe('PENDING');
});

test('render Notify component', async () => {
  act(() => {
    render(
      <Notify
        providerUrl='https://data-seed-prebsc-1-s1.binance.org:8545'
        transactionHash='0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5'
      />,
    );
  });

  expect(screen.getByRole('heading')).toHaveTextContent(
    'Hash: 0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5',
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Loading');
  expect(screen.getByTestId('status')).toHaveTextContent('PENDING');

  await waitForElementToBeRemoved(() => screen.getByRole('alert'));
  expect(screen.getByTestId('status')).toHaveTextContent('SUCCESS');
});

// Below are test component
type Props = {
  providerUrl: string;
  transactionHash: string;
};

function Notify({providerUrl, transactionHash}: Props) {
  const {status} = useWaitForTransactionHash({
    hash: transactionHash,
    providerUrl,
    pollingInterval: 100,
  });
  return (
    <div>
      {status === 'PENDING' && <p role='alert'>Loading</p>}
      <pre role='heading'>Hash: {transactionHash}</pre>
      <pre>Provider Url: {providerUrl}</pre>
      <pre data-testid='status'>{status}</pre>
    </div>
  );
}
