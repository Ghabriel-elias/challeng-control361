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
  webpack: (config: { module: { rules: { test: RegExp; use: { loader: string; options: { typescript: boolean; icon: boolean; }; }[]; }[]; }; }) => {
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