import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 실행 시 의존성 범위를 줄이기 위해 standalone 번들을 생성한다.
  output: "standalone",
};

export default nextConfig;
