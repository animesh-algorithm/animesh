import { ImageResponse } from "next/og";
import React from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Animesh Links — A shorter way there. Branded links at link.animesh.cc.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
const fontData = Promise.all([400, 700].map((weight) =>
  readFile(join(process.cwd(), "assets/fonts/inter-" + weight + ".woff"))
));

export default async function Image() {
  const [regular, bold] = await fontData;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f5f3ef", color: "#272331", fontFamily: "Inter", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "column", padding: "54px 64px", width: 760 }}>
        <div style={{ display: "flex", alignItems: "center", height: 46, fontSize: 44, fontWeight: 700, letterSpacing: -2 }}>
          Animesh
          <span style={{ width: 17, height: 17, marginLeft: 12, marginTop: -18, borderRadius: "50%", background: "#ffb000", boxShadow: "0 0 12px #ffb000, 0 0 28px rgba(255,176,0,0.6)" }} />
        </div>
        <div style={{ display: "flex", marginTop: 65, fontSize: 18, letterSpacing: 4, fontWeight: 700 }}>LINKS</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 78, fontWeight: 700, letterSpacing: -4, lineHeight: 1.08 }}>
          <span>A shorter</span><span>way there.</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 25, color: "#615d67" }}>Small links. Clear destinations.</div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 21 }}>link.animesh.cc</div>
      </div>
      <svg width="450" height="630" viewBox="0 0 450 630" style={{ position: "absolute", top: 0, right: 0 }}>
        <path d="M60 0H450V630H60Z" fill="#e6e1f1" />
        <path d="M80 410L330 160M165 160H330V325" fill="none" stroke="#272331" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M70 514H340" stroke="#aaa0ba" strokeWidth="2" />
        <circle cx="70" cy="514" r="7" fill="#272331" /><circle cx="340" cy="514" r="7" fill="#272331" />
      </svg>
    </div>,
    { ...size, fonts: [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: bold, weight: 700, style: "normal" },
    ] },
  );
}
