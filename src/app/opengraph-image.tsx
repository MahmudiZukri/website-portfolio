import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";
export const alt = "Mhd. Mahmudi Zukri Lubis Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#2C3930",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          textAlign: "center",
          color: "#DCD7C9",
          border: "20px solid #A27B5C",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#3F4F44",
            padding: "60px",
            border: "8px solid #A27B5C",
            boxShadow: "20px 20px 0px 0px #000000",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#A27B5C",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: "42px",
              fontWeight: "600",
              color: "#DCD7C9",
            }}
          >
            {siteConfig.title}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
