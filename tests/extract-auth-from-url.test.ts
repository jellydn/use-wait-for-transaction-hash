import {extractAuthFromUrl} from '../src/extract-auth-from-url';

describe('Test extract auth from url', () => {
  test('should return null', () => {
    const result = extractAuthFromUrl('http://localhost');

    expect(result).toBeNull();
  });
  test('should return url with username and password', () => {
    const result = extractAuthFromUrl('http://usr:pwd@localhost');

    expect(result).not.toBeNull();
    expect(result?.url).toBe('http://localhost');
    expect(result?.username).toBe('usr');
    expect(result?.password).toBe('pwd');
  });
});
