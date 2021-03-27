import { renderHook, act } from '@testing-library/react-hooks';
import 'isomorphic-fetch';

import { useClockWatch, useWaitForTransactionHash } from '../';
import { server } from '../../mocks/server';

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

test('should use wait transaction hash', () => {
  const mockOnStatusChange = jest.fn();
  const { result, waitForNextUpdate } = renderHook(() =>
    useWaitForTransactionHash({
      hash:
        '0x5fbc777b0c99e84b8a3f1c750ae4d1cdaa5f8f852da892897f6b9cf0ea2f59b5',
      providerUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      onStatusChange: mockOnStatusChange,
    })
  );
  expect(result.current.status).toBe('PENDING');
  act(async () => {
    await waitForNextUpdate();
  });
  expect(mockOnStatusChange.mock.calls.length).toBe(1);
});
