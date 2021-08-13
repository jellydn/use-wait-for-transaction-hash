export function extractAuthFromUrl(url: string) {
  const credential = url.match(/^https?:\/\/([^/]+)@/);
  if (credential == null) return null;
  let [username, password] = credential?.[1]?.split(':') ?? [];
  const cleanUrl = url.replace(`${credential?.[1]}@`, '');
  return { url: cleanUrl, username, password };
}

export default extractAuthFromUrl;
