import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          color: "#c9a227",
        }}
      >
        <div style={{ fontSize: 78, fontWeight: 600, letterSpacing: "-0.04em" }}>
          AM
        </div>
        <div
          style={{
            width: 54,
            height: 2,
            background: "#c9a227",
            marginTop: 10,
          }}
        />
      </div>
    ),
    size,
  );
}
