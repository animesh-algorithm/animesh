import { api } from "../../../../lib/http";
import { summary } from "../../../../lib/database";
export function GET() {
  return api(summary);
}
