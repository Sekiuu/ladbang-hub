import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    ...require("dotenv").config({ path: path.resolve(__dirname, "../.env") })
      .parsed,
  },
};

export default nextConfig;
