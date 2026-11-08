import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

/**
 * Social share card.
 *
 * ImageResponse supports only flexbox and a subset of CSS — no grid, no
 * background-clip text — so the layout here is deliberately plain.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: 72,
          color: "#f4f1ea",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 2, background: "#c9a227" }} />
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8a867e",
            }}
          >
            {`${site.name} · ${site.market}`}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              display: "flex",
            }}
          >
            Where Cairo
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#c9a227",
              display: "flex",
            }}
          >
            comes home.
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#8a867e",
              marginTop: 28,
              maxWidth: 760,
              lineHeight: 1.45,
              display: "flex",
            }}
          >
            Buying, selling, renting and managing property across New Cairo,
            Sheikh Zayed, Zamalek and the New Capital.
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(244,241,234,0.14)",
            paddingTop: 28,
          }}
        >
          {[
            ["1,240+", "Properties closed"],
            ["11 years", "In Greater Cairo"],
            ["98%", "Would recommend"],
          ].map(([value, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 38, letterSpacing: "-0.02em" }}>{value}</div>
              <div
                style={{
                  fontSize: 16,
                  color: "#8a867e",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
