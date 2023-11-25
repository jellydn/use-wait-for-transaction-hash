export function extractAuthFromUrl(url: string) {
  const credential = /^https?:\/\/([^/]+)@/.exec(url);
  if (credential === null) {
    return null;
  }

  const [username, password] = credential?.[1]?.split(":") ?? [];
  const cleanUrl = url.replace(`${credential?.[1]}@`, "");
  return { url: cleanUrl, username, password };
}

export default extractAuthFromUrl;
