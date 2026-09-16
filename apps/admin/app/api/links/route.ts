import { api, jsonBody } from "../../../lib/http";
import { directory, createLink } from "../../../lib/database";
export function GET(request: Request) {
  return api(() => directory(new URL(request.url).searchParams));
}
export function POST(request: Request) {
  return api(async () => createLink(await jsonBody(request)));
}
