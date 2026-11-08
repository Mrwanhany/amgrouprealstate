import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Gold "AM" monogram on obsidian — the favicon, generated at build time. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          color: "#c9a227",
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          borderRadius: 12,
        }}
      >
        AM
      </div>
    ),
    size,
  );
}
