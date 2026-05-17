/**
 * SHA-256 hash of a File, computed in the browser via Web Crypto.
 * Used as the `X-File-Hash` header so the backend can dedup re-uploads
 * (see `docs/specs/E01-onboarding-y-upload.md §3 & §6.2`).
 */
export async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return bufferToHex(digest);
}

function bufferToHex(buffer: ArrayBuffer): string {
  let hex = '';
  for (const byte of new Uint8Array(buffer)) {
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}
