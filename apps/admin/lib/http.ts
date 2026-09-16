import { AccessError, requireOwner } from "./auth";
import { originAllowed } from "./auth-policy";
import { InputError } from "./validation";
export const privateHeaders = {
  "Cache-Control": "private, no-store",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};
export async function jsonBody(request: Request) {
  if (!originAllowed(request))
    throw new InputError("Invalid request origin.", 403);
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  )
    throw new InputError("JSON content type required.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("Request body required.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        throw new InputError("Request body too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new InputError("Invalid JSON.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new InputError("JSON object required.");
  return body as Record<string, unknown>;
}
export async function api(action: () => Promise<unknown | Response>) {
  try {
    await requireOwner();
    const result = await action();
    if (result instanceof Response) return result;
    return Response.json(result, { headers: privateHeaders });
  } catch (error) {
    const status =
      error instanceof AccessError || error instanceof InputError
        ? error.status
        : 503;
    const message =
      error instanceof InputError
        ? error.message
        : status === 503
          ? "Service temporarily unavailable."
          : "Access denied.";
    if (status === 503) console.error("admin_operation_failed");
    return Response.json(
      { error: message },
      { status, headers: privateHeaders },
    );
  }
}
