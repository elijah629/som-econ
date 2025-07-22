import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://avatars.slack-edge.com/**"),
      new URL(
        "https://ca.slack-edge.com/T0266FRGM-U015ZPLDZKQ-gf3696467c28-512",
      ),
      new URL("https://summer.hackclub.com/shell.avif")
    ],
  },
};

export default nextConfig;
