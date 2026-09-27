export type BoundedBodyResult =
  | { status: "ok"; body: string }
  | { status: "payload-too-large" }
  | { status: "invalid-encoding" }
  | { status: "read-error" };

function getDeclaredLength(request: Request): number | null {
  const header = request.headers.get("content-length");
  if (!header) {
    return null;
  }

  const length = Number(header);
  return Number.isSafeInteger(length) && length >= 0 ? length : null;
}

export async function readBoundedBody(
  request: Request,
  maxBytes: number,
): Promise<BoundedBodyResult> {
  const declaredLength = getDeclaredLength(request);
  if (declaredLength !== null && declaredLength > maxBytes) {
    return { status: "payload-too-large" };
  }

  if (!request.body) {
    return { status: "ok", body: "" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { status: "payload-too-large" };
      }

      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    try {
      return {
        status: "ok",
        body: new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      };
    } catch {
      return { status: "invalid-encoding" };
    }
  } catch {
    return { status: "read-error" };
  } finally {
    reader.releaseLock();
  }
}
