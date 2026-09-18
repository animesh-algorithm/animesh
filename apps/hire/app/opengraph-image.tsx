import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Rasterized from the site's fine-grain SVG so OG rendering needs no SVG filters.
const grainData = readFile(join(process.cwd(), "assets/textures/noise-grain.png"));

const fontData = Promise.all([400, 700].map((weight) =>
  readFile(join(process.cwd(), "assets/fonts/inter-" + weight + ".woff"))
));
export const alt = "Hire Animesh — From messy to shipped. Products, AI automation, and internal tools.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const [regular, bold] = await fontData;
  const grain = "data:image/png;base64," + (await grainData).toString("base64");
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f7f5f0", color: "#191919", fontFamily: "Inter", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", padding: "54px 64px", width: 740 }}>
        <div style={{ display: "flex", alignItems: "center", height: 46, fontSize: 44, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
          Animesh
          <span style={{ display: "flex", width: 17, height: 17, marginLeft: 12, marginTop: -18, borderRadius: "50%", background: "#ffb000", border: "1px solid #fffdf8", boxShadow: "0 0 0 1px #191919, 0 0 12px #ffb000, 0 0 28px rgba(255,176,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.7)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 64, fontSize: 76, fontWeight: 700, letterSpacing: -4, lineHeight: 1.04 }}><span>From messy</span><span style={{ display: "flex", marginTop: 8 }}>to <span style={{ background: "#ffd66b", padding: "0 12px", marginLeft: 14 }}>shipped.</span></span></div>
        <div style={{ display: "flex", marginTop: 30, maxWidth: 560, fontSize: 26, lineHeight: 1.4, color: "#62605b" }}>Products, AI automation, and internal tools. Built with Animesh Sharma.</div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 21 }}>hire.animesh.cc</div>
      </div>
      <svg width="470" height="630" viewBox="0 0 470 630" style={{ position: "absolute", right: 0, top: 0 }}>
        <path d="M95 0H470V630H150C260 540 80 475 102 360C128 235-20 160 95 0Z" fill="#ffd66b" />
        <path d="M68 155C290 72 304 265 140 215C-5 170 116 105 188 160C312 255 61 316 128 380" fill="none" stroke="#191919" strokeWidth="4" strokeLinecap="round" />
        <rect x="156" y="276" width="228" height="196" rx="18" fill="#191919" transform="rotate(6 270 374)" />
        <rect x="145" y="264" width="228" height="196" rx="18" fill="#2f6bff" stroke="#191919" strokeWidth="3" transform="rotate(6 259 362)" />
        <path d="M160 306L371 328" stroke="#191919" strokeWidth="3" />
        <circle cx="173" cy="287" r="5" fill="#fff" /><circle cx="192" cy="289" r="5" fill="#fff" /><circle cx="211" cy="291" r="5" fill="#fff" />
        <path d="M216 372L248 408L308 354" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M266 478V534H375M359 520L375 534L359 548" fill="none" stroke="#191919" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ display: "flex", position: "absolute", top: 0, left: 0, width: 1200, height: 630, backgroundImage: `url(${grain})`, backgroundSize: "256px 256px", backgroundRepeat: "repeat", opacity: 0.26 }} />
    </div>, {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
