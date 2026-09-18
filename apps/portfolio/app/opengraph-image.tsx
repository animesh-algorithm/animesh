import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontData = Promise.all([400, 700].map((weight) =>
  readFile(join(process.cwd(), "assets/fonts/manrope-" + weight + ".woff"))
));
export const alt = "Animesh Sharma — I figure things out. Then I build them.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const [regular, bold] = await fontData;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f5f0e6", color: "#20201f", fontFamily: "Manrope", position: "relative", overflow: "hidden" }}>
      <svg width="440" height="630" viewBox="0 0 440 630" style={{ position: "absolute", right: 0, top: 0 }}>
        <path d="M180 0H440V630H80C-20 520 20 390 140 340C270 285 70 130 180 0Z" fill="#332c61" />
        <circle cx="288" cy="220" r="112" fill="#f36f5f" />
        <path d="M195 220H381M288 127V313M222 154L354 286M222 286L354 154" stroke="#332c61" strokeWidth="22" />
        <rect x="116" y="375" width="206" height="136" rx="22" fill="#f3d96d" transform="rotate(-12 219 443)" />
        <path d="M166 437L193 410M166 437L193 464M264 410L291 437L264 464M236 400L219 474" fill="none" stroke="#332c61" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-12 219 443)" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", padding: "54px 64px", width: 820 }}>
        <div style={{ display: "flex", alignItems: "center", height: 46, fontSize: 44, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
          Animesh
          <span style={{ display: "flex", width: 17, height: 17, marginLeft: 12, marginTop: -18, borderRadius: "50%", background: "#ffb000", border: "1px solid #fffdf8", boxShadow: "0 0 0 1px #20201f, 0 0 12px #ffb000, 0 0 28px rgba(255,176,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.7)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 72, fontSize: 84, fontWeight: 700, letterSpacing: -5, lineHeight: 1.04 }}><span>I figure</span><span>things out.</span><span style={{ color: "#332c61", fontSize: 62, letterSpacing: -3, marginTop: 14 }}>Then I build them.</span></div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 22, color: "#55524d" }}>Engineering · Product · AI & automation</div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 20 }}>www.animesh.cc</div>
      </div>
    </div>, {
      ...size,
      fonts: [
        { name: "Manrope", data: regular, weight: 400, style: "normal" },
        { name: "Manrope", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
