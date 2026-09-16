import QRCode from "qrcode";
import { api, privateHeaders } from "../../../../../lib/http";
import { getLink } from "../../../../../lib/database";
export function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  return api(async () => {
    const link = await getLink((await context.params).id);
    const png = await QRCode.toBuffer(
      `${process.env.LINKS_ORIGIN || "https://link.animesh.cc"}/${link.slug}`,
      { type: "png", width: 768, margin: 4, errorCorrectionLevel: "M" },
    );
    return new Response(new Uint8Array(png), {
      headers: {
        ...privateHeaders,
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="link-qr.png"',
      },
    });
  });
}
