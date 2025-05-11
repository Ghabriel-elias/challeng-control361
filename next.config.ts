export default {
  output: 'export', 
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.tsx'
      }
    }
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/, 
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
}