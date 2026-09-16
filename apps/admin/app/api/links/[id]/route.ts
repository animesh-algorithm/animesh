import { api, jsonBody } from "../../../../lib/http";
import { getLink, editLink, deleteLink } from "../../../../lib/database";
type Context = { params: Promise<{ id: string }> };
export function GET(_: Request, context: Context) {
  return api(async () => getLink((await context.params).id));
}
export function PATCH(request: Request, context: Context) {
  return api(async () =>
    editLink((await context.params).id, await jsonBody(request)),
  );
}
export function DELETE(request: Request, context: Context) {
  return api(async () =>
    deleteLink((await context.params).id, await jsonBody(request)),
  );
}
