import { ImageResponse } from "next/og";
import React from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Rasterized from the site's fine-grain SVG so OG rendering needs no SVG filters.
const grainData = readFile(join(process.cwd(), "assets/textures/noise-grain.png"));

export const alt = "Animesh Admin — Links, in order. Private link operations workspace.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
const fontData = Promise.all([400, 700].map((weight) =>
  readFile(join(process.cwd(), "assets/fonts/inter-" + weight + ".woff"))
));

export default async function Image() {
  const [regular, bold] = await fontData;
  const grain = "data:image/png;base64," + (await grainData).toString("base64");
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f3f4ff", color: "#17181c", fontFamily: "Inter", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "column", padding: "54px 64px", width: 760 }}>
        <div style={{ display: "flex", alignItems: "center", height: 46, fontSize: 44, fontWeight: 700, letterSpacing: -2 }}>
          Animesh
          <span style={{ width: 17, height: 17, marginLeft: 12, marginTop: -18, borderRadius: "50%", background: "#ffb000", boxShadow: "0 0 12px #ffb000, 0 0 28px rgba(255,176,0,0.6)" }} />
        </div>
        <div style={{ display: "flex", marginTop: 65, fontSize: 18, letterSpacing: 4, fontWeight: 700, color: "#175cff" }}>PRIVATE WORKSPACE</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 78, fontWeight: 700, letterSpacing: -4, lineHeight: 1.08 }}>
          <span>Links,</span><span style={{ color: "#175cff" }}>in order.</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 25, color: "#606674" }}>Manage. Measure. Keep things moving.</div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 21 }}>admin.animesh.cc</div>
      </div>
      <svg width="440" height="630" viewBox="0 0 440 630" style={{ position: "absolute", top: 0, right: 0 }}>
        <path d="M55 0H440V630H55Z" fill="#175cff" />
        <rect x="101" y="155" width="272" height="306" rx="14" fill="#fff" />
        <path d="M101 215H373" stroke="#dce2f2" strokeWidth="2" />
        <circle cx="129" cy="184" r="6" fill="#175cff" /><path d="M150 184H229" stroke="#17181c" strokeWidth="7" strokeLinecap="round" />
        <path d="M127 266H342M127 323H342M127 380H342" stroke="#e6eaff" strokeWidth="28" strokeLinecap="round" />
        <path d="M139 266H233M139 323H209M139 380H253" stroke="#175cff" strokeWidth="7" strokeLinecap="round" />
        <path d="M318 260L324 266L335 254M318 317L324 323L335 311M318 374L324 380L335 368" fill="none" stroke="#175cff" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div style={{ display: "flex", position: "absolute", top: 0, left: 0, width: 1200, height: 630, backgroundImage: `url(${grain})`, backgroundSize: "256px 256px", backgroundRepeat: "repeat", opacity: 0.2 }} />
    </div>,
    { ...size, fonts: [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: bold, weight: 700, style: "normal" },
    ] },
  );
}
