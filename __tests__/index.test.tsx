import * as React from 'react';
import {
  screen,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';

import 'isomorphic-fetch';

import { useWaitForTransactionHash } from '../';
import { server } from './mocks/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

test('should use clock watch', () => {
  const { result } = renderHook(() => useClockWatch());
  expect(result.current.counter).toBe(0);
  expect(typeof result.current.actions.start).toBe('function');
});

test('should use wait transaction hash', async () => {
  const mockChangeStatusFn = jest.fn();
  const { result } = renderHook(() =>
    useWaitForTransactionHash({
      hash:
        '0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5',
      providerUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      onChangeStatus: mockChangeStatusFn,
    })
  );
  expect(result.current.status).toBe('PENDING');
  expect(mockChangeStatusFn.mock.calls.length).toBe(1);
});

test('render Notify component', async () => {
  render(
    <Notify
      providerUrl="https://data-seed-prebsc-1-s1.binance.org:8545"
      transactionHash="0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5"
    />
  );

  expect(screen.getByRole('heading')).toHaveTextContent(
    'Hash: 0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5'
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Loading');
  expect(screen.getByTestId('status')).toHaveTextContent('PENDING');

  await waitForElementToBeRemoved(() => screen.getByRole('alert'));
  expect(screen.getByTestId('status')).toHaveTextContent('SUCCESS');
});

// Below are test component
interface Props {
  providerUrl: string;
  transactionHash: string;
}

function Notify({ providerUrl, transactionHash }: Props) {
  const { counter, actions } = useClockWatch();
  const { status } = useWaitForTransactionHash({
    hash: transactionHash,
    providerUrl,
    pollingInterval: 100,
    onChangeStatus: status => {
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
      {status === 'PENDING' && <p role="alert">Loading</p>}
      <pre role="heading">Hash: {transactionHash}</pre>
      <pre>Provider Url: {providerUrl}</pre>
      <pre data-testid="status">{status}</pre>
      <pre data-testid="counter">Clock Watch: {counter}ms</pre>
    </div>
  );
}

/**
 * Util hook for testing component
 */
export function useClockWatch() {
  const [counter, setCounter] = React.useState(0);
  const [mode, setMode] = React.useState<'START' | 'STOP' | 'PAUSE'>('PAUSE');

  const start = () => {
    setMode('START');
    setCounter(0);
  };
  const stop = () => {
    setMode('STOP');
  };

  React.useEffect(() => {
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
