import type { NextConfig } from "next";

const nextConfig : NextConfig = {
    images: {
        domains: ['i.scdn.co', 'www.udiscovermusic.com']
    }
}

// module.exports = {
//   assetPrefix: './'
// }

module.exports = {
  output: 'standalone'
}

export default nextConfig;
