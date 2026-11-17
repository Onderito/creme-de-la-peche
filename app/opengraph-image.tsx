import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Crème de la pêche — Original drawings, prints & clothing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/images/brand/logo-beige.png"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#2a2a2a", color: "#e9e2d6" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 740, padding: "58px 52px" }}>
        <div style={{ fontSize: 28 }}>Crème de la pêche</div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "serif", fontSize: 82, lineHeight: 1.1 }}><span>Art to wear.</span><span>Art to keep.</span></div>
        <div style={{ fontSize: 23 }}>Original drawings, prints &amp; clothing.</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 460, background: "#e9e2d6" }}>
        {/* ImageResponse renders a native image rather than a browser element. */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="" width={360} height={360} />
      </div>
    </div>, size,
  );
}
