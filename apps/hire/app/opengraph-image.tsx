import { ImageResponse } from "next/og";
export const alt = "Animesh Sharma — Products. Automation. Internal tools.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", padding: 80, background: "#f7f5f0", color: "#252331", fontFamily: "sans-serif" }}><div style={{ fontSize: 26, marginBottom: 45 }}>ANIMESH SHARMA</div><div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -4 }}>Hire Animesh</div><div style={{ fontSize: 52, color: "#2f6bff", marginTop: 20 }}>Products. Automation. Internal tools.</div></div>, size);
}
