import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontData = Promise.all([400, 700].map((weight) =>
  readFile(join(process.cwd(), "assets/fonts/outfit-" + weight + ".woff"))
));

export const alt = "Animesh — Notes & rabbit holes. Building, curiosity, and perspective.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [regular, bold] = await fontData;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#a9d9ed", color: "#342246", fontFamily: "Outfit", position: "relative", overflow: "hidden" }}>
      <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
        <circle cx="990" cy="134" r="63" fill="#f4ce54" />
        <path d="M0 235C45 140 130 162 160 201C190 97 313 109 347 196C409 152 480 191 495 249C571 195 660 220 690 269C772 175 888 205 918 278C1020 197 1127 226 1200 165V630H0Z" fill="#c9e8f4" />
        <path d="M0 440C230 350 442 578 735 490C906 438 1004 327 1200 392V630H0Z" fill="#fdf8ed" />
        <g transform="rotate(12 949 350)">
          <rect x="832" y="239" width="213" height="244" rx="16" fill="#342246" />
          <rect x="821" y="228" width="213" height="244" rx="16" fill="#e4d5fb" stroke="#5633a7" strokeWidth="4" />
          <path d="M855 229V472M885 300H999M885 337H999M885 374H973" stroke="#5633a7" strokeWidth="4" strokeLinecap="round" />
          <path d="M846 263H867M846 300H867M846 337H867M846 374H867M846 411H867" stroke="#342246" strokeWidth="7" strokeLinecap="round" />
        </g>
        <g transform="rotate(28 1082 359)"><path d="M1069 245H1095V438L1082 465L1069 438Z" fill="#f4ce54" stroke="#342246" strokeWidth="3" /><path d="M1069 270H1095M1069 436H1095M1082 245V435" stroke="#342246" strokeWidth="3" /></g>
        <path d="M752 135V167M736 151H768M741 140L763 162M741 162L763 140" stroke="#5633a7" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", padding: "50px 64px", position: "relative", width: 770 }}>
        <div style={{ display: "flex", alignItems: "center", height: 46, fontSize: 44, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
          Animesh
          <span style={{ display: "flex", width: 17, height: 17, marginLeft: 12, marginTop: -18, borderRadius: "50%", background: "#ffb000", border: "1px solid #fffdf8", boxShadow: "0 0 0 1px #342246, 0 0 12px #ffb000, 0 0 28px rgba(255,176,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.7)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 88, fontSize: 86, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02 }}><span>Notes &</span><span>rabbit holes.</span></div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 25, maxWidth: 580, lineHeight: 1.4 }}>On building things, following curiosity, and finding a little perspective.</div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 21, color: "#5633a7" }}>blog.animesh.cc</div>
      </div>
    </div>, {
      ...size,
      fonts: [
        { name: "Outfit", data: regular, weight: 400, style: "normal" },
        { name: "Outfit", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
