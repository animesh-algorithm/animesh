import { api } from "../../../../../lib/http";
import { analytics } from "../../../../../lib/database";
export function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return api(async () =>
    analytics((await context.params).id, new URL(request.url).searchParams),
  );
}
