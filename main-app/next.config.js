// const { i18n } = require("./next-i18next.config");

// /**
//  * @type {import('next').NextConfig}
//  */

// const nextConfig = {
//   i18n,
//   webpack(config) {
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       fs: false,
//     };

//     return config;
//   },
//   experimental: {
//     serverActions: true,
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
};

module.exports = nextConfig;
