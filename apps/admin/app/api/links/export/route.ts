import { api, privateHeaders } from "../../../../lib/http";
import { directory } from "../../../../lib/database";
import { linksCsv } from "../../../../lib/csv";
export function GET(request: Request) {
  return api(
    async () =>
      new Response(
        linksCsv(
          (await directory(new URL(request.url).searchParams, true)).rows,
        ),
        {
          headers: {
            ...privateHeaders,
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="links.csv"',
          },
        },
      ),
  );
}
